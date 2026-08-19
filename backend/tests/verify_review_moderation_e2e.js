import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { Testimonial } from '../models/Testimonial.js';
import * as testimonialService from '../services/testimonialService.js';

async function runReviewModerationE2ETest() {
  console.log('================================================================');
  console.log('🧪 VERIFY REVIEW SUBMISSION & MODERATION WORKFLOW (E2E)');
  console.log('================================================================');

  let testReviewId = null;

  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB Atlas');

    // 1. Submit a user review
    console.log('\n[1] Submitting student review via submitReviewService...');
    const testReviewData = {
      name: 'Priya Narayanan (E2E QA)',
      email: 'priya.e2e@unlocktejas.com',
      role: 'Alumni, Batch 2025',
      program: 'M.Tech Artificial Intelligence',
      content: 'The executive mentorship and hands-on robotics labs completely transformed my career trajectory.',
      rating: 5,
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
    };

    const submittedReview = await testimonialService.submitReviewService(testReviewData);
    testReviewId = submittedReview._id;
    console.log(`✅ Review Created: ID=${submittedReview._id}, Status=${submittedReview.status}`);
    if (submittedReview.status !== 'pending') {
      throw new Error(`Expected submitted review status to be "pending", got "${submittedReview.status}"`);
    }

    // 2. Query public testimonials - must NOT include pending review
    console.log('\n[2] Checking Public Testimonials endpoint...');
    const publicTestimonials = await testimonialService.getTestimonialsService();
    const isPresentInPublic = publicTestimonials.some(t => String(t._id) === String(testReviewId));
    console.log(`  Public Testimonials Count: ${publicTestimonials.length}`);
    console.log(`  Pending review visible in public? ${isPresentInPublic}`);
    if (isPresentInPublic) {
      throw new Error('Pending review should NOT be visible in public testimonials before approval!');
    }
    console.log('✅ PASS: Pending review is hidden from public view.');

    // 3. Query admin testimonials - MUST include pending review
    console.log('\n[3] Checking Admin Testimonials endpoint...');
    const adminTestimonials = await testimonialService.getAllTestimonialsAdminService({ status: 'all' });
    const isPresentInAdmin = adminTestimonials.some(t => String(t._id) === String(testReviewId));
    console.log(`  Admin Testimonials Count: ${adminTestimonials.length}`);
    console.log(`  Pending review visible in admin? ${isPresentInAdmin}`);
    if (!isPresentInAdmin) {
      throw new Error('Pending review MUST be visible in admin moderation list!');
    }
    console.log('✅ PASS: Pending review is visible in admin moderation console.');

    // 4. Admin approves the review
    console.log('\n[4] Admin Approving Review...');
    const approvedReview = await testimonialService.updateTestimonialStatusService(testReviewId, 'approved');
    console.log(`  Updated Review Status: ${approvedReview.status}`);
    if (approvedReview.status !== 'approved') {
      throw new Error(`Expected review status to be "approved", got "${approvedReview.status}"`);
    }
    console.log('✅ PASS: Review status successfully transitioned to approved.');

    // 5. Query public testimonials again - MUST now include approved review
    console.log('\n[5] Re-checking Public Testimonials endpoint after approval...');
    const updatedPublicTestimonials = await testimonialService.getTestimonialsService();
    const isNowPresentInPublic = updatedPublicTestimonials.some(t => String(t._id) === String(testReviewId));
    console.log(`  Approved review visible in public? ${isNowPresentInPublic}`);
    if (!isNowPresentInPublic) {
      throw new Error('Approved review should now be visible in public testimonials!');
    }
    console.log('✅ PASS: Approved review is now live and published on public website.');

    // 6. Cleanup test review
    console.log('\n[6] Cleaning up test review record...');
    await Testimonial.findByIdAndDelete(testReviewId);
    console.log('✅ Test review record cleaned up.');

    await mongoose.disconnect();
    console.log('\n🎉 ALL REVIEW SUBMISSION & MODERATION TESTS PASSED 100%!');
    process.exit(0);

  } catch (err) {
    console.error('❌ E2E Moderation Test Error:', err);
    if (testReviewId) {
      await Testimonial.findByIdAndDelete(testReviewId);
    }
    await mongoose.disconnect();
    process.exit(1);
  }
}

runReviewModerationE2ETest();
