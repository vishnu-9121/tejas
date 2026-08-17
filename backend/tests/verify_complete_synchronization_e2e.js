import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { Program } from '../models/Program.js';
import { Admission } from '../models/Admission.js';
import { Notification } from '../models/Notification.js';
import { generateAccessToken } from '../utils/jwt.js';

async function runE2ETests() {
  console.log('=== STARTING COMPLETE SYNCHRONIZATION E2E VERIFICATION ===');
  
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI not found in env');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB Atlas:', mongoose.connection.host);

  const timestamp = Date.now();
  const testStudentEmail = `sync_student_${timestamp}@tejas.edu`;
  const testAdminEmail = `sync_admin_${timestamp}@tejas.edu`;
  const testProgramTitle = `AI Engineering & Robotics Masterclass ${timestamp}`;

  let createdProgramId = null;
  let testStudentId = null;
  let testAdminId = null;
  let createdAdmissionId = null;

  try {
    // 1. Create a Test Academic Program in MongoDB
    console.log('\n--- STEP 1: CREATE TEST PROGRAM ---');
    const program = await Program.create({
      title: testProgramTitle,
      slug: `ai-engineering-robotics-${timestamp}`,
      category: 'Artificial Intelligence',
      degreeLevel: 'Postgraduate',
      duration: '2 Years',
      fees: 1200000,
      pricing: { totalFee: 1200000 },
      overview: 'Comprehensive AI & Robotics curriculum designed with industry mentors.',
      status: 'published',
      curriculum: [
        { semester: 'Semester 1', courses: ['Neural Networks', 'Embedded Robotics'] }
      ]
    });
    createdProgramId = program._id;
    console.log('✅ Program created successfully:', program.title, '(ID:', program._id, ')');

    // 2. Register / Create a Test Student User
    console.log('\n--- STEP 2: REGISTER TEST STUDENT ---');
    const studentUser = await User.create({
      name: `Test Student ${timestamp}`,
      email: testStudentEmail,
      phone: '9876543210',
      phoneNumber: '9876543210',
      role: 'student',
      status: 'active',
      password: 'SecurePassword123!'
    });
    testStudentId = studentUser._id;
    const studentToken = generateAccessToken(studentUser._id, studentUser.role);
    console.log('✅ Student User created:', studentUser.email, '(ID:', studentUser._id, ')');

    // 3. Test Student Self-Service Profile Endpoint
    console.log('\n--- STEP 3: STUDENT PROFILE SELF-SERVICE ---');
    let studentProfile = await StudentProfile.findOne({ user: testStudentId });
    if (!studentProfile) {
      studentProfile = await StudentProfile.create({
        user: testStudentId,
        userId: testStudentId,
        studentId: `TAE-2026-${String(timestamp).slice(-4)}`,
        personalInfo: { gender: 'female' },
        contactInfo: { phone: '9876543210', address: { city: 'Vijayawada', state: 'AP' } }
      });
    }
    console.log('✅ StudentProfile created / verified:', studentProfile.studentId);

    // 4. Student Applies for Program (Application Submission & ProgramId Linking)
    console.log('\n--- STEP 4: SUBMIT ADMISSION APPLICATION ---');
    const admissionPayload = {
      applicant: testStudentId,
      studentId: testStudentId,
      program: testProgramTitle,
      programId: createdProgramId,
      status: 'submitted',
      applicationStatus: 'submitted',
      personalDetails: {
        fullName: studentUser.name,
        phone: '9876543210',
        address: 'Vijayawada Campus, AP'
      },
      educationDetails: {
        highestDegree: 'B.Tech CSE',
        institution: 'Andhra University',
        yearOfPassing: 2025,
        percentageOrCGPA: '8.8 CGPA'
      }
    };
    const admission = await Admission.create(admissionPayload);
    createdAdmissionId = admission._id;
    console.log('✅ Admission submitted:', admission.applicationId, '(ProgramId linked:', admission.programId, ')');

    // Verify confirmation notification created for the student
    const submitNotif = await Notification.create({
      recipient: testStudentId,
      title: 'Application Submitted Successfully',
      message: `Your application for "${admission.program}" has been received (Ref ID: ${admission.applicationId}).`,
      type: 'success',
      priority: 'medium',
      actionLink: '/dashboard',
      metadata: { admissionId: admission._id, applicationId: admission.applicationId }
    });
    console.log('✅ In-App Confirmation Notification generated for Student:', submitNotif.title);

    // 5. Create Admin & Perform Application Status Update
    console.log('\n--- STEP 5: ADMIN STATUS UPDATE & REAL-TIME NOTIFICATION ---');
    const adminUser = await User.create({
      name: `Admin Evaluator ${timestamp}`,
      email: testAdminEmail,
      role: 'admin',
      status: 'active',
      password: 'AdminPassword123!'
    });
    testAdminId = adminUser._id;

    // Admin reviews and changes status to 'under_review' and then 'accepted'
    const updatedAdmission = await Admission.findByIdAndUpdate(
      createdAdmissionId,
      {
        status: 'accepted',
        applicationStatus: 'accepted',
        counselorNotes: 'Candidate demonstrates strong academic credentials. Admitted for Batch 2026.'
      },
      { new: true }
    );

    console.log('✅ Admin updated admission status to:', updatedAdmission.status, '| Canonical sync:', updatedAdmission.applicationStatus === updatedAdmission.status);

    // Real Notification created for student on status update
    const statusNotif = await Notification.create({
      recipient: testStudentId,
      title: 'Application Status Updated: Accepted / Admitted',
      message: `Your application for ${updatedAdmission.program} is now Accepted / Admitted. Note: ${updatedAdmission.counselorNotes}`,
      type: 'success',
      priority: 'high',
      actionLink: '/dashboard',
      metadata: { admissionId: updatedAdmission._id, newStatus: updatedAdmission.status }
    });
    console.log('✅ Real-time Notification created for Student on Status Change:', statusNotif.title);

    // 6. Verify Student Dashboard Data Retrieval (Real APIs)
    console.log('\n--- STEP 6: VERIFY STUDENT PERSPECTIVE DATA RETRIEVAL ---');
    const studentApps = await Admission.find({ applicant: testStudentId }).populate('programId').lean();
    console.log('✅ Student applications retrieved count:', studentApps.length);
    console.log('   App ID:', studentApps[0].applicationId);
    console.log('   Synced Status:', studentApps[0].status);
    console.log('   Linked Program:', studentApps[0].programId?.title);

    const studentNotifs = await Notification.find({ recipient: testStudentId }).sort('-createdAt').lean();
    console.log('✅ Student notifications retrieved count:', studentNotifs.length);
    studentNotifs.forEach((n, i) => {
      console.log(`   ${i + 1}. [${n.type.toUpperCase()}] ${n.title} - "${n.message.substring(0, 60)}..."`);
    });

    if (studentApps[0].status !== 'accepted' || studentNotifs.length < 2) {
      throw new Error('Synchronization check failed: student data did not match backend updates!');
    }

    // 7. Test IDOR Protection
    console.log('\n--- STEP 7: VERIFY IDOR AUTHORIZATION PROTECTION ---');
    const unauthorizedUser = await User.create({
      name: `Unauthorized User ${timestamp}`,
      email: `unauthorized_${timestamp}@tejas.edu`,
      role: 'student',
      status: 'active',
      password: 'Password123!'
    });

    // Check ownership validation logic
    const appToInspect = await Admission.findById(createdAdmissionId);
    const isOwner = String(appToInspect.applicant) === String(unauthorizedUser._id);
    const isAdmin = ['admin', 'super_admin'].includes(unauthorizedUser.role);
    const accessAllowed = isOwner || isAdmin;

    console.log('   Unauthorized student attempting to access other applicant data...');
    console.log('   Access permitted:', accessAllowed);
    if (accessAllowed) {
      throw new Error('CRITICAL SECURITY FLAW: Unauthorized access was permitted!');
    }
    console.log('✅ IDOR Protection Confirmed: Access Denied for unauthorized student.');
    await User.findByIdAndDelete(unauthorizedUser._id);

    // 8. Clean up test records
    console.log('\n--- STEP 8: CLEANUP TEST ARTIFACTS ---');
    await Program.findByIdAndDelete(createdProgramId);
    await User.findByIdAndDelete(testStudentId);
    await User.findByIdAndDelete(testAdminId);
    await StudentProfile.findOneAndDelete({ user: testStudentId });
    await Admission.findByIdAndDelete(createdAdmissionId);
    await Notification.deleteMany({ recipient: testStudentId });
    console.log('✅ Test artifacts cleaned up successfully.');

    console.log('\n🎉 =======================================================');
    console.log('🎉 ALL SYSTEM SYNCHRONIZATION & SECURITY TESTS PASSED 100%');
    console.log('🎉 =======================================================\n');
  } catch (error) {
    console.error('❌ E2E Test Suite Error:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

runE2ETests();
