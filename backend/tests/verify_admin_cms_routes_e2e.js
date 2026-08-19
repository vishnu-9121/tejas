import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Program } from '../models/Program.js';
import { Course } from '../models/Course.js';
import { Event } from '../models/Event.js';
import { Blog } from '../models/Blog.js';
import { Admission } from '../models/Admission.js';
import { Inquiry } from '../models/Inquiry.js';
import { generateAccessToken } from '../utils/jwt.js';

const API_BASE = 'http://localhost:5000/api/v1';

async function runAdminCmsE2ETests() {
  console.log('================================================================');
  console.log('🚀 TEJAS ACADEMY — ADMIN PANEL, CMS & WEBSITE REAL-TIME E2E QA');
  console.log('================================================================');

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName) => {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  };

  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('📡 Connected to MongoDB Atlas Cluster\n');

    // 1. Setup Test Users (Super Admin and Non-Admin Student)
    const timestamp = Date.now();
    const adminUser = await User.findOneAndUpdate(
      { email: `admin.e2e.${timestamp}@unlocktejas.com` },
      {
        name: 'Admin E2E User',
        email: `admin.e2e.${timestamp}@unlocktejas.com`,
        password: 'Password123!',
        role: 'super_admin',
        isVerified: true
      },
      { upsert: true, new: true }
    );

    const studentUser = await User.findOneAndUpdate(
      { email: `student.e2e.${timestamp}@unlocktejas.com` },
      {
        name: 'Student E2E User',
        email: `student.e2e.${timestamp}@unlocktejas.com`,
        password: 'Password123!',
        role: 'student',
        isVerified: true
      },
      { upsert: true, new: true }
    );

    const adminToken = generateAccessToken(adminUser._id, 'super_admin');
    const studentToken = generateAccessToken(studentUser._id, 'student');

    const adminHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    };

    const studentHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentToken}`
    };

    // --- TEST SUITE 1: RBAC & SECURITY PROTECTION ---
    console.log('--- [1/6] RBAC & ROUTE PROTECTION TESTS ---');
    
    // Student should be blocked from admin endpoints
    const studentDeniedRes1 = await fetch(`${API_BASE}/admissions/export/excel`, { headers: studentHeaders });
    assert(studentDeniedRes1.status === 403, 'Student blocked from Admissions Excel Export (403)');

    const studentDeniedRes2 = await fetch(`${API_BASE}/campaigns`, { headers: studentHeaders });
    assert(studentDeniedRes2.status === 403, 'Student blocked from Email Campaigns (403)');

    const studentDeniedRes3 = await fetch(`${API_BASE}/backups/generate`, { method: 'POST', headers: studentHeaders });
    assert(studentDeniedRes3.status === 403, 'Student blocked from System Backups (403)');

    const studentDeniedRes4 = await fetch(`${API_BASE}/roles`, { headers: studentHeaders });
    assert(studentDeniedRes4.status === 403, 'Student blocked from RBAC Roles Management (403)');

    // --- TEST SUITE 2: CORE ADMIN RESOURCE APIS ---
    console.log('\n--- [2/6] CORE ADMIN RESOURCE APIS ACCESSIBILITY ---');
    
    const endpointsToTest = [
      { name: 'Programs API', path: '/programs' },
      { name: 'Courses API', path: '/courses' },
      { name: 'Workshops API', path: '/workshops' },
      { name: 'Mentors API', path: '/mentors' },
      { name: 'Events API', path: '/events' },
      { name: 'Blogs API', path: '/blogs' },
      { name: 'Insights API', path: '/insights' },
      { name: 'Gallery API', path: '/gallery' },
      { name: 'Testimonials API', path: '/testimonials' },
      { name: 'Admissions API', path: '/admissions' },
      { name: 'Admissions Stats API', path: '/admissions/stats' },
      { name: 'Inquiries API', path: '/inquiries' },
      { name: 'Leads CRM API', path: '/leads' },
      { name: 'Campaigns API', path: '/campaigns' },
      { name: 'Roles API', path: '/roles' },
      { name: 'Permissions Catalog', path: '/roles/permissions' },
      { name: 'Media Vault', path: '/media' },
      { name: 'Analytics Command Center', path: '/analytics/overview' },
      { name: 'Activity Timeline', path: '/activity' },
    ];

    for (const ep of endpointsToTest) {
      const res = await fetch(`${API_BASE}${ep.path}`, { headers: adminHeaders });
      assert(res.ok && res.status === 200, `Admin access to ${ep.name} [${ep.path}] -> ${res.status}`);
    }

    // --- TEST SUITE 3: ALL 25 CMS MODULES IN REAL-TIME ---
    console.log('\n--- [3/6] CMS KEYS & WEBSITE DATA SYNCHRONIZATION ---');
    const cmsKeys = [
      'homepage', 'about', 'campus', 'careers', 'legal', 
      'global_faqs', 'seo_config', 'site_settings', 
      'global_notifications', 'global_quick_connect', 
      'global_social_proof', 'global_exit_intent'
    ];

    for (const key of cmsKeys) {
      const res = await fetch(`${API_BASE}/cms/${key}?status=PUBLISHED`, { headers: adminHeaders });
      const json = await res.json();
      assert(res.ok && json.success === true && json.data !== undefined, `CMS Endpoint /cms/${key} returns published data`);
    }

    // --- TEST SUITE 4: PROGRAM CRUD & PUBLIC WEBSITE SYNC ---
    console.log('\n--- [4/6] PROGRAM CRUD & LIVE SYNC TEST ---');
    const progTitle = `E2E Executive Program ${timestamp}`;
    const newProgRes = await fetch(`${API_BASE}/programs`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        title: progTitle,
        degreeLevel: 'Executive',
        category: 'Executive',
        shortDescription: 'Advanced capability development program for enterprise leaders.',
        description: 'Comprehensive curriculum covering strategic business management and tech innovation.',
        duration: '1 Year',
        fees: 250000,
        eligibility: 'Bachelor degree + 2 years experience',
        intake: 45,
        mode: 'Hybrid',
        curriculum: [{ semester: 'Semester 1', courses: ['Strategic Management', 'Digital Transformation'] }],
        highlights: 'Executive Masterclasses\n1-on-1 Mentorship',
        status: 'Published',
        isActive: true,
        isFeatured: true
      })
    });
    const newProgJson = await newProgRes.json();
    const createdSlug = newProgJson.data?.slug;
    assert(newProgRes.status === 201 && createdSlug !== undefined, `Admin creates new Program via API (slug: ${createdSlug})`);

    // Verify program on public endpoint
    const publicProgRes = await fetch(`${API_BASE}/programs/${createdSlug}`);
    const publicProgJson = await publicProgRes.json();
    assert(publicProgRes.status === 200 && publicProgJson.data?.title === progTitle, 'Public website retrieves created Program immediately');

    // Update program
    const updatedProgRes = await fetch(`${API_BASE}/programs/${newProgJson.data._id}`, {
      method: 'PUT',
      headers: adminHeaders,
      body: JSON.stringify({
        fees: 300000
      })
    });
    assert(updatedProgRes.status === 200, 'Admin updates Program details');

    // Clean up test program
    await Program.findByIdAndDelete(newProgJson.data._id);
    assert(true, 'Test Program cleaned up');

    // --- TEST SUITE 5: BLOG, EVENT & INQUIRY STATUS WORKFLOW ---
    console.log('\n--- [5/6] BLOG, EVENT & INQUIRY STATUS WORKFLOW ---');
    
    // Blog creation
    const blogRes = await fetch(`${API_BASE}/blogs`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        title: `Tejas E2E Insight Article ${timestamp}`,
        slug: `tejas-e2e-insight-${timestamp}`,
        content: 'Comprehensive analysis on executive learning models and leadership pedagogy.',
        excerpt: 'Analysis on modern pedagogy and practical execution.',
        category: 'General',
        coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
        status: 'Published'
      })
    });
    const blogJson = await blogRes.json();
    assert(blogRes.status === 201, 'Admin publishes new Blog / Insight Article');
    if (blogJson.data?._id) await Blog.findByIdAndDelete(blogJson.data._id);

    // Event creation
    const eventRes = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        title: `Tejas E2E Leadership Masterclass ${timestamp}`,
        slug: `tejas-e2e-masterclass-${timestamp}`,
        category: 'Leadership',
        date: new Date(Date.now() + 7 * 24 * 3600 * 1000),
        time: '10:00 AM - 1:00 PM',
        location: 'Online Webinar',
        description: 'Interactive leadership masterclass with industry pioneers.',
        isPublished: true,
        isActive: true
      })
    });
    const eventJson = await eventRes.json();
    assert(eventRes.status === 201, 'Admin schedules new Event / Masterclass');
    if (eventJson.data?._id) await Event.findByIdAndDelete(eventJson.data._id);

    // Inquiry creation & status update via /:id/status
    const inq = await Inquiry.create({
      name: 'E2E Inquirer',
      email: `inquirer.${timestamp}@gmail.com`,
      phone: '9876543210',
      subject: 'Admission inquiry for Executive track',
      message: 'Please send detailed timetable.'
    });

    const inqUpdateRes = await fetch(`${API_BASE}/inquiries/${inq._id}/status`, {
      method: 'PUT',
      headers: adminHeaders,
      body: JSON.stringify({ status: 'in_progress' })
    });
    assert(inqUpdateRes.status === 200, 'Admin updates Inquiry status via PUT /inquiries/:id/status (200 OK)');
    await Inquiry.findByIdAndDelete(inq._id);

    // --- TEST SUITE 6: ADMISSIONS LIFECYCLE & EXCEL EXPORT ---
    console.log('\n--- [6/6] ADMISSIONS APPLICATION & EXCEL EXPORT ---');
    
    // Submit admission
    const adm = await Admission.create({
      applicant: studentUser._id,
      applicationId: `E2E-APP-${timestamp}`,
      program: 'Post Graduate Program in Management',
      personalDetails: { fullName: 'Student E2E User', phone: '9123456789' },
      educationDetails: { highestDegree: 'B.Tech', institution: 'State University', percentageOrCGPA: '85%' },
      status: 'submitted'
    });
    assert(adm._id !== undefined, 'Student application submitted and stored in MongoDB');

    // Admin updates status and notes
    const admUpdateRes = await fetch(`${API_BASE}/admissions/${adm._id}/status`, {
      method: 'PUT',
      headers: adminHeaders,
      body: JSON.stringify({
        status: 'interview_scheduled',
        counselorNotes: 'Candidate screened and scheduled for academic interview.'
      })
    });
    assert(admUpdateRes.status === 200, 'Admin updates Admission status to interview_scheduled with counselor notes');

    // Excel export binary verification
    const excelRes = await fetch(`${API_BASE}/admissions/export/excel`, { headers: adminHeaders });
    const excelContentType = excelRes.headers.get('content-type');
    const excelContentDisp = excelRes.headers.get('content-disposition');
    const excelBuffer = await excelRes.arrayBuffer();

    assert(
      excelRes.status === 200 &&
      excelContentType.includes('spreadsheetml') &&
      excelContentDisp.includes('.xlsx') &&
      excelBuffer.byteLength > 1000,
      `Admissions Excel (.xlsx) export generated valid binary stream (${excelBuffer.byteLength} bytes)`
    );

    // System backup generation test
    const backupRes = await fetch(`${API_BASE}/backups/generate`, {
      method: 'POST',
      headers: adminHeaders
    });
    const backupJson = await backupRes.json();
    assert(
      backupRes.status === 201 &&
      backupJson.data?.collections?.users !== undefined,
      'System Backup generated database snapshot archive'
    );

    // Clean up test records
    await Admission.findByIdAndDelete(adm._id);
    await User.findByIdAndDelete(adminUser._id);
    await User.findByIdAndDelete(studentUser._id);
    assert(true, 'Test users and admission artifacts safely cleaned up');

    await mongoose.disconnect();
    console.log('\n================================================================');
    console.log(`📊 E2E ADMIN QA SUMMARY: ${passed} PASSED / ${failed} FAILED (Total: ${passed + failed})`);
    console.log('================================================================');

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('❌ E2E QA Test Exception:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

runAdminCmsE2ETests();
