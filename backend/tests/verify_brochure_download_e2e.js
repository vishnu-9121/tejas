import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Program } from '../models/Program.js';
import { Lead } from '../models/Lead.js';
import { Download } from '../models/Download.js';
import { AnalyticsEvent } from '../models/AnalyticsEvent.js';
import * as programController from '../controllers/programController.js';

async function runBrochureDownloadE2ETest() {
  console.log('================================================================');
  console.log('🧪 VERIFY PROGRAM BROCHURE / CURRICULUM DOWNLOAD & LEAD CAPTURE (E2E)');
  console.log('================================================================');

  let testUserId = null;
  let testLeadEmail = `lead.brochure.test_${Date.now()}@unlocktejas.com`;
  let testProgramId = null;

  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB Atlas');

    // 1. Create a test user (Lead)
    console.log('\n[1] Creating test student user...');
    const testUser = await User.create({
      name: 'Aditi Rao',
      email: testLeadEmail,
      phone: '+91 9123456789',
      password: 'Password@123',
      role: 'student'
    });
    testUserId = testUser._id;
    console.log(`✅ Student User Created: ID=${testUser._id}, Email=${testUser.email}`);

    // 2. Fetch or create a test Program
    console.log('\n[2] Fetching target Program for brochure download...');
    let program = await Program.findOne({ isActive: true });
    if (!program) {
      program = await Program.create({
        title: 'M.Tech in Autonomous Systems & Robotics',
        slug: 'mtech-in-autonomous-systems-and-robotics',
        category: 'Postgraduate',
        brochureUrl: '/brochure.pdf',
        curriculumUrl: '/brochure.pdf',
        isActive: true
      });
      testProgramId = program._id;
    }
    console.log(`✅ Target Program: "${program.title}" (Brochure URL: ${program.brochureUrl})`);

    // 3. Simulate Authenticated Download Controller Call
    console.log('\n[3] Simulating Authenticated Brochure Download Request...');
    
    // Mock req & res
    let responseStatusCode = null;
    let responseData = null;

    const mockReq = {
      user: testUser,
      params: { id: String(program._id) },
      body: {
        programId: String(program._id),
        programTitle: program.title,
        downloadType: 'brochure',
        fileUrl: program.brochureUrl
      }
    };

    const mockRes = {
      status: function (code) {
        responseStatusCode = code;
        return this;
      },
      json: function (payload) {
        responseData = payload;
        return this;
      }
    };

    const mockNext = (err) => {
      if (err) throw err;
    };

    await programController.trackProgramDownload(mockReq, mockRes, mockNext);

    console.log(`  Response Status Code: ${responseStatusCode}`);
    console.log(`  Response Payload:`, JSON.stringify(responseData, null, 2));

    if (responseStatusCode !== 200 || !responseData?.success || !responseData?.fileUrl) {
      throw new Error('Expected successful brochure download response with fileUrl');
    }
    console.log('✅ PASS: Brochure download request succeeded with valid fileUrl.');

    // 4. Verify Lead Capture in MongoDB
    console.log('\n[4] Verifying Lead Capture record in MongoDB...');
    const capturedLead = await Lead.findOne({ email: testLeadEmail });
    if (!capturedLead) {
      throw new Error(`Lead not found in MongoDB for email: ${testLeadEmail}`);
    }
    console.log(`  Captured Lead: Name="${capturedLead.name}", Program="${capturedLead.program}", Source="${capturedLead.source}"`);
    if (!capturedLead.source.includes('Brochure Download')) {
      throw new Error(`Expected source to contain "Brochure Download", got "${capturedLead.source}"`);
    }
    console.log('✅ PASS: Lead record successfully created and synchronized with CRM.');

    // 5. Verify Download collection tracking
    console.log('\n[5] Verifying Download collection counter...');
    const downloadDoc = await Download.findOne({ title: `${program.title} Brochure` });
    if (!downloadDoc || downloadDoc.downloadCount < 1) {
      throw new Error('Download tracking count was not incremented');
    }
    console.log(`  Download Document Count: ${downloadDoc.downloadCount}`);
    console.log('✅ PASS: Download model successfully tracked.');

    // 6. Verify Analytics Event
    console.log('\n[6] Verifying Analytics Event...');
    const analyticsEvent = await AnalyticsEvent.findOne({
      userId: testUserId,
      event: 'download'
    });
    if (!analyticsEvent) {
      throw new Error('AnalyticsEvent was not recorded for brochure download');
    }
    console.log(`  Analytics Event: Type="${analyticsEvent.event}", Program="${analyticsEvent.metadata?.programTitle}"`);
    console.log('✅ PASS: Analytics Event recorded.');

    // 7. Cleanup test data
    console.log('\n[7] Cleaning up test data...');
    await User.findByIdAndDelete(testUserId);
    await Lead.deleteMany({ email: testLeadEmail });
    await AnalyticsEvent.deleteMany({ userId: testUserId });
    if (testProgramId) {
      await Program.findByIdAndDelete(testProgramId);
    }
    console.log('✅ Test artifacts cleaned up.');

    await mongoose.disconnect();
    console.log('\n🎉 ALL BROCHURE DOWNLOAD & LEAD CAPTURE TESTS PASSED 100%!');
    process.exit(0);

  } catch (err) {
    console.error('❌ Brochure Download E2E Test Error:', err);
    if (testUserId) {
      await User.findByIdAndDelete(testUserId);
      await Lead.deleteMany({ email: testLeadEmail });
      await AnalyticsEvent.deleteMany({ userId: testUserId });
    }
    if (testProgramId) {
      await Program.findByIdAndDelete(testProgramId);
    }
    await mongoose.disconnect();
    process.exit(1);
  }
}

runBrochureDownloadE2ETest();
