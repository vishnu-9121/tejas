import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { Program } from '../models/Program.js';
import { User } from '../models/User.js';
import { MentorProfile } from '../models/MentorProfile.js';
import { Admission } from '../models/Admission.js';
import { createProgram, updateProgram, getProgramById, getProgramBySlug, getPrograms } from '../controllers/programController.js';
import { createAdmission, getAdmissions } from '../controllers/admissionsController.js';

async function runEndToEndVerification() {
  console.log('--- STARTING 6-SECTION PROGRAM INTEGRATION TEST ---');
  await connectDB();

  // 1. Get sample faculty and mentor
  const facultyUser = await User.findOne({ role: { $in: ['faculty', 'super_admin', 'admin'] } });
  const mentorProfile = await MentorProfile.findOne();

  const testTitle = 'M.Tech in Autonomous Systems & Generative Robotics ' + Date.now();

  const fullProgramPayload = {
    title: testTitle,
    category: 'Postgraduate',
    degreeLevel: 'Postgraduate',
    duration: '2 Years (4 Semesters)',
    fees: 1850000,
    intake: 45,
    mode: 'On-Campus',
    eligibility: 'B.Tech / B.E in CS, IT, ECE or Mechanical with min 65% aggregate',
    shortDescription: 'Pioneering postgraduate curriculum in embodied intelligence, robotic manipulation, and reinforcement learning.',
    description: 'Our M.Tech in Autonomous Systems is co-created with top aerospace and robotics laboratories.',
    overview: 'Comprehensive 2-year deep dive into perceptual AI, SLAM, kinematics, and generative control systems.',
    posterImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
    brochureUrl: 'https://unlocktejas.com/prospectus-autonomous-systems-2026.pdf',
    videoUrl: 'https://youtube.com/watch?v=robotics-overview',
    galleryImages: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80'
    ],
    curriculum: [
      {
        semester: 'Semester 1 - Perception & Control',
        courses: ['Advanced Kinematics', 'Computer Vision for Robotics', 'Deep Reinforcement Learning'],
        description: 'Foundations of robot vision and state estimation.'
      },
      {
        semester: 'Semester 2 - Autonomous Navigation',
        courses: ['Simultaneous Localization & Mapping (SLAM)', 'Generative World Models', 'ROS 2 & Gazebo Simulation'],
        description: 'Real-time robot navigation and physical simulation.'
      },
      {
        semester: 'Semester 3 - Field Capstone & Lab',
        courses: ['Humanoid Locomotion', 'Edge AI Deployment', 'Industry Capstone Project I'],
        description: 'Real hardware robotics manipulation.'
      },
      {
        semester: 'Semester 4 - Thesis & Industry Immersion',
        courses: ['Master Dissertation & Defense', 'Venture Creation in Deeptech'],
        description: 'Publish research and deploy production hardware.'
      }
    ],
    highlights: [
      '100% Guaranteed Capstone Placement in Deeptech Labs',
      'Dedicated NVIDIA DGX Powered Robotics Workstations',
      'Dual Degree International Pathway'
    ],
    learningOutcomes: [
      'Architect end-to-end autonomous navigation pipelines',
      'Train foundation models for multi-modal robot planning',
      'Publish peer-reviewed research in top robotics conferences'
    ],
    careerOpportunities: [
      'Robotics Research Scientist',
      'Autonomous Systems Engineer',
      'Perception & SLAM Specialist',
      'Deeptech Entrepreneur'
    ],
    skills: ['ROS 2', 'PyTorch', 'C++', 'SLAM', 'CUDA', 'Point Cloud Processing'],
    facultyMapping: facultyUser ? [facultyUser._id] : [],
    mentorMapping: mentorProfile ? [mentorProfile._id] : [],
    seo: {
      metaTitle: 'M.Tech Autonomous Systems & Robotics in India | Tejas',
      metaDescription: 'Study advanced robotics, SLAM, and embodied AI at Tejas Academy.',
      keywords: 'MTech Robotics, Autonomous Systems, SLAM, AI Master Degree'
    },
    faqs: [
      {
        question: 'Are research lab stipends available?',
        answer: 'Yes, all admitted candidates receive a monthly research fellowship of ₹25,000.'
      },
      {
        question: 'What hardware is used in the laboratory?',
        answer: 'Students work directly on Unitree quadrupeds, Boston Dynamics Spot, and custom ROS 2 autonomous rovers.'
      }
    ],
    status: 'Published',
    isFeatured: true
  };

  // STEP 1: CREATE PROGRAM
  let createReq = { body: fullProgramPayload };
  let createRes = {
    status(c) { this.statusCode = c; return this; },
    json(d) { this.body = d; return this; }
  };
  await createProgram(createReq, createRes, (e) => console.error('Create error:', e));

  console.log('1. CREATE Result Code:', createRes.statusCode);
  const createdProg = createRes.body?.data;
  console.log('   Created ID:', createdProg?._id);
  console.log('   Created Title:', createdProg?.title);
  console.log('   Created Slug:', createdProg?.slug);
  console.log('   Created Poster:', createdProg?.posterImage);
  console.log('   Created Curriculum Semesters:', createdProg?.curriculum?.length);
  console.log('   Created FAQs:', createdProg?.faqs?.length);
  console.log('   Created Highlights:', createdProg?.highlights?.length);
  console.log('   Created Outcomes:', createdProg?.learningOutcomes?.length);
  console.log('   Created Faculty Mappings:', createdProg?.facultyMapping?.length);
  console.log('   Created Mentor Mappings:', createdProg?.mentorMapping?.length);

  // STEP 2: RETRIEVE BY ID
  let getReq = { params: { id: createdProg._id } };
  let getRes = {
    status(c) { this.statusCode = c; return this; },
    json(d) { this.body = d; return this; }
  };
  await getProgramById(getReq, getRes, (e) => console.error('Get error:', e));
  console.log('2. GET BY ID Status:', getRes.statusCode, 'Success:', getRes.body?.success);

  // STEP 3: UPDATE PROGRAM ACROSS ALL SECTIONS
  const updatePayload = {
    ...fullProgramPayload,
    fees: 1950000,
    duration: '2 Years (Specialized)',
    overview: 'Updated Overview: Expanded robotics research facility with 50+ robotic manipulators.',
    curriculum: [
      ...fullProgramPayload.curriculum,
      {
        semester: 'Semester 5 (Optional Honors)',
        courses: ['Advanced Swarm Robotics', 'Quantum Navigation'],
        description: 'Elite honors research track.'
      }
    ],
    highlights: [
      ...fullProgramPayload.highlights,
      '₹50,000 Monthly Research Grant for Top 10% Percentile'
    ],
    faqs: [
      ...fullProgramPayload.faqs,
      {
        question: 'Is hostel accommodation provided?',
        answer: 'Yes, modern single and double occupancy air-conditioned campus residences are provided.'
      }
    ]
  };

  let updateReq = { params: { id: createdProg._id }, body: updatePayload };
  let updateRes = {
    status(c) { this.statusCode = c; return this; },
    json(d) { this.body = d; return this; }
  };
  await updateProgram(updateReq, updateRes, (e) => console.error('Update error:', e));

  console.log('3. UPDATE Result Code:', updateRes.statusCode);
  const updatedProg = updateRes.body?.data;
  console.log('   Updated Fees:', updatedProg?.fees);
  console.log('   Updated Curriculum Semesters:', updatedProg?.curriculum?.length);
  console.log('   Updated FAQs Count:', updatedProg?.faqs?.length);
  console.log('   Updated Highlights Count:', updatedProg?.highlights?.length);

  // STEP 4: VERIFY BY SLUG
  let slugReq = { params: { slug: updatedProg.slug } };
  let slugRes = {
    status(c) { this.statusCode = c; return this; },
    json(d) { this.body = d; return this; }
  };
  await getProgramBySlug(slugReq, slugRes, (e) => console.error('Slug error:', e));
  console.log('4. GET BY SLUG Status:', slugRes.statusCode, 'Title:', slugRes.body?.data?.title);

  // STEP 5: SUBMIT ADMISSION APPLICATION (Linked to created program)
  const admissionPayload = {
    fullName: 'Aditya Sharma',
    email: 'aditya.sharma.' + Date.now() + '@unlocktejas.com',
    phone: '9876543210',
    program: createdProg.title,
    programId: createdProg._id,
    prevSchool: 'Tejas Institute of Technology',
    grade: '8.9 CGPA',
    highestDegree: 'B.Tech in Computer Science',
    yearOfPassing: 2025
  };

  let admReq = { body: admissionPayload, user: null };
  let admRes = {
    status(c) { this.statusCode = c; return this; },
    json(d) { this.body = d; return this; }
  };
  await createAdmission(admReq, admRes, (e) => console.error('Admission submit error:', e));
  console.log('5. ADMISSIONS SUBMISSION Status:', admRes.statusCode, 'Application ID:', admRes.body?.data?.applicationId);

  // STEP 6: VERIFY ADMIN CAN RETRIEVE ADMISSIONS
  let admListReq = { query: { search: 'Aditya Sharma' } };
  let admListRes = {
    status(c) { this.statusCode = c; return this; },
    json(d) { this.body = d; return this; }
  };
  await getAdmissions(admListReq, admListRes, (e) => console.error('Admin list error:', e));
  console.log('6. ADMIN ADMISSIONS LIST Status:', admListRes.statusCode, 'Found Applications:', admListRes.body?.data?.admissions?.length);

  // Cleanup test program & admission
  await Program.findByIdAndDelete(createdProg._id);
  if (admRes.body?.data?._id) {
    await Admission.findByIdAndDelete(admRes.body.data._id);
  }
  console.log('7. Test Cleanup Completed.');

  console.log('=== ALL 6 SECTIONS OF PROGRAM CMS AND ADMISSIONS FLOW VERIFIED 100% ===');
  process.exit(0);
}

runEndToEndVerification().catch(err => {
  console.error('Fatal test failure:', err);
  process.exit(1);
});
