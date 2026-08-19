import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Program } from '../models/Program.js';
import { MentorProfile } from '../models/MentorProfile.js';
import { Lead } from '../models/Lead.js';
import { Download } from '../models/Download.js';
import { AnalyticsEvent } from '../models/AnalyticsEvent.js';
import * as programController from '../controllers/programController.js';
import { protect } from '../middlewares/auth.js';
import { generateAccessToken } from '../utils/jwt.js';

async function runStrictAuthBrochureTest() {
  console.log('================================================================');
  console.log('🔒 STRICT SECURITY & AUTHENTICATION BROCHURE/CURRICULUM TEST');
  console.log('================================================================');

  let testUserId = null;
  const testEmail = `strict.auth.student_${Date.now()}@unlocktejas.com`;
  let passCount = 0;
  let totalTests = 0;

  const assert = (name, condition, details = '') => {
    totalTests++;
    if (condition) {
      passCount++;
      console.log(`  ✅ PASS [${totalTests}]: ${name}`);
    } else {
      console.error(`  ❌ FAIL [${totalTests}]: ${name} - ${details}`);
      throw new Error(`Test Failed: ${name} -> ${details}`);
    }
  };

  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB Atlas');

    // Fetch test program
    const programA = await Program.findOne({ isActive: true });
    if (!programA) throw new Error('No active program found in MongoDB');
    console.log(`📌 Using Program: "${programA.title}" (slug: ${programA.slug})`);

    // =========================================================================
    // TEST 1: Unauthenticated Direct API Call -> MUST BE 401 UNAUTHORIZED
    // =========================================================================
    console.log('\n--- [TEST 1 & 7] UNAUTHENTICATED API REQUESTS MUST BE REJECTED (401) ---');
    
    let unauthStatusCode = null;
    let unauthError = null;

    const mockUnauthReq = {
      headers: {},
      query: {},
      params: { id: programA.slug },
      path: `/${programA.slug}/download-brochure`
    };
    const mockUnauthRes = {
      status: (code) => { unauthStatusCode = code; return mockUnauthRes; },
      json: (data) => { unauthError = data; return mockUnauthRes; }
    };
    const mockUnauthNext = (err) => {
      if (err) {
        unauthStatusCode = err.statusCode || 401;
        unauthError = err.message;
      }
    };

    await protect(mockUnauthReq, mockUnauthRes, mockUnauthNext);

    assert(
      'Unauthenticated GET /api/v1/programs/:slug/download-brochure returns 401',
      unauthStatusCode === 401,
      `Received status code ${unauthStatusCode}`
    );

    // =========================================================================
    // TEST 2: Static Bypass Elimination (frontend/public/brochure.pdf is absent)
    // =========================================================================
    console.log('\n--- [TEST 2] STATIC PUBLIC FILE BYPASS PREVENTION ---');
    const publicPdfExists = fs.existsSync(path.resolve('../frontend/public/brochure.pdf'));
    assert(
      'Static bypass file frontend/public/brochure.pdf does NOT exist',
      !publicPdfExists,
      'frontend/public/brochure.pdf was found! Must be removed to prevent direct unauthenticated URL bypass.'
    );

    const internalPdfExists = fs.existsSync(path.resolve('./storage/brochures/default_brochure.pdf'));
    assert(
      'Secured default brochure exists in backend/storage/brochures/default_brochure.pdf',
      internalPdfExists,
      'Internal secure file missing'
    );

    // =========================================================================
    // TEST 3: Public API URL Masking (No raw brochure URLs in public GET)
    // =========================================================================
    console.log('\n--- [TEST 3] PUBLIC API RESPONSE URL MASKING ---');
    let publicResData = null;
    const mockPublicReq = { params: { slug: programA.slug }, query: {} };
    const mockPublicRes = {
      status: (code) => mockPublicRes,
      json: (payload) => { publicResData = payload; return mockPublicRes; }
    };
    await programController.getProgramBySlug(mockPublicReq, mockPublicRes, (err) => { if (err) throw err; });

    assert(
      'Public GET /api/v1/programs/:slug does NOT expose raw brochureUrl',
      publicResData?.data?.brochureUrl === undefined,
      `Exposed brochureUrl: ${publicResData?.data?.brochureUrl}`
    );
    assert(
      'Public GET /api/v1/programs/:slug provides hasBrochure flag',
      publicResData?.data?.hasBrochure === true,
      'hasBrochure flag missing'
    );

    // =========================================================================
    // TEST 4: User Registration (Basic Info Only) & Authentication
    // =========================================================================
    console.log('\n--- [TEST 4 & 5] USER REGISTRATION & AUTHENTICATED ACCESS ---');
    const testUser = await User.create({
      name: 'Vikram Aditya',
      email: testEmail,
      phone: '+91 9888877777',
      password: 'Password@123',
      role: 'student'
    });
    testUserId = testUser._id;
    const authToken = generateAccessToken(testUser._id, 'student');
    console.log(`  Created test student: ${testUser.name} (${testUser.email})`);

    // Verify token with protect middleware
    let authReq = {
      headers: { authorization: `Bearer ${authToken}` },
      query: {},
      params: { id: programA.slug },
      path: `/${programA.slug}/download-brochure`,
      method: 'GET'
    };
    let authPassed = false;
    await protect(authReq, {}, (err) => {
      if (!err && authReq.user) authPassed = true;
    });

    assert(
      'JWT Authentication middleware grants access to valid token',
      authPassed && authReq.user?.email === testEmail,
      'Failed to authenticate token'
    );

    // =========================================================================
    // TEST 5: Authenticated Document Stream & Lead Capture
    // =========================================================================
    console.log('\n--- [TEST 5] AUTHENTICATED STREAMING & AUTOMATED LEAD LOGGING ---');
    let streamHeaders = {};
    let streamSentBuffer = null;
    let streamStatusCode = 200;

    const mockStreamRes = {
      status: (code) => { streamStatusCode = code; return mockStreamRes; },
      setHeader: (key, val) => { streamHeaders[key] = val; },
      send: (buf) => { streamSentBuffer = buf; return mockStreamRes; },
      pipe: () => mockStreamRes
    };

    await programController.trackProgramDownload(authReq, mockStreamRes, (err) => { if (err) throw err; });

    assert(
      'Authenticated request sets Content-Type: application/pdf',
      streamHeaders['Content-Type'] === 'application/pdf',
      `Got Content-Type: ${streamHeaders['Content-Type']}`
    );
    assert(
      'Authenticated request sets Content-Disposition with program filename',
      Boolean(streamHeaders['Content-Disposition']?.includes('attachment')),
      `Got Content-Disposition: ${streamHeaders['Content-Disposition']}`
    );

    // Check Lead record in MongoDB
    const leadRecord = await Lead.findOne({ email: testEmail });
    assert(
      'Lead record created in MongoDB Atlas with source "Brochure Download"',
      Boolean(leadRecord && leadRecord.source.includes('Brochure Download')),
      'Lead record missing in database'
    );

    // Check Download tracking record in MongoDB
    const downloadRecord = await Download.findOne({ title: `${programA.title} Brochure` });
    assert(
      'Download model tracked & counter incremented in MongoDB Atlas',
      Boolean(downloadRecord && downloadRecord.downloadCount > 0),
      'Download count not tracked'
    );

    // Check Analytics Event
    const analyticsDoc = await AnalyticsEvent.findOne({ userId: testUserId, event: 'download' });
    assert(
      'AnalyticsEvent "download" logged with student metadata',
      Boolean(analyticsDoc && analyticsDoc.metadata?.programTitle === programA.title),
      'AnalyticsEvent not logged'
    );

    // =========================================================================
    // TEST 6: Program Specificity Test (Program A vs Program B)
    // =========================================================================
    console.log('\n--- [TEST 6] PROGRAM-SPECIFIC FILE ISOLATION ---');
    const programsList = await Program.find({ isActive: true });
    if (programsList.length >= 2) {
      const pB = programsList[1];
      let pBHeaders = {};
      const mockPBReq = {
        user: testUser,
        params: { id: pB.slug },
        path: `/${pB.slug}/download-brochure`,
        method: 'GET'
      };
      const mockPBRes = {
        setHeader: (k, v) => { pBHeaders[k] = v; },
        send: () => {},
        pipe: () => {}
      };
      await programController.trackProgramDownload(mockPBReq, mockPBRes, (err) => { if (err) throw err; });
      assert(
        `Program B (${pB.title}) receives its own dedicated filename`,
        pBHeaders['Content-Disposition']?.includes(pB.title.replace(/[^a-zA-Z0-9]/g, '_')),
        `Got: ${pBHeaders['Content-Disposition']}`
      );
    }

    // Cleanup
    console.log('\n--- [CLEANUP] REMOVING TEST ARTIFACTS ---');
    await User.findByIdAndDelete(testUserId);
    await Lead.deleteMany({ email: testEmail });
    await AnalyticsEvent.deleteMany({ userId: testUserId });
    console.log('✅ Cleaned up temporary test artifacts.');

    await mongoose.disconnect();
    console.log(`\n================================================================`);
    console.log(`🎉 ALL ${totalTests} STRICT AUTHENTICATION TESTS PASSED 100%!`);
    console.log(`================================================================`);
    process.exit(0);

  } catch (err) {
    console.error('❌ Test Suite Failed:', err);
    if (testUserId) {
      await User.findByIdAndDelete(testUserId);
      await Lead.deleteMany({ email: testEmail });
      await AnalyticsEvent.deleteMany({ userId: testUserId });
    }
    await mongoose.disconnect();
    process.exit(1);
  }
}

runStrictAuthBrochureTest();
