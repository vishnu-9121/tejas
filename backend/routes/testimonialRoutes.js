import express from 'express';
import { 
  getTestimonials, 
  getAdminTestimonials,
  createTestimonial, 
  submitReview,
  updateTestimonialStatus,
  deleteTestimonial, 
  getTestimonialById, 
  updateTestimonial 
} from '../controllers/testimonialController.js';
import { protect, authorize, optionalAuth } from '../middlewares/auth.js';

const router = express.Router();

router.route('/')
  .get(getTestimonials)
  .post(protect, authorize('super_admin', 'admin', 'operations_manager'), createTestimonial);

// Public / Student review submission
router.post('/submit', optionalAuth, submitReview);

// Admin review moderation list
router.get('/admin', protect, authorize('super_admin', 'admin', 'operations_manager'), getAdminTestimonials);

// Status update (approve/reject)
router.patch('/:id/status', protect, authorize('super_admin', 'admin', 'operations_manager'), updateTestimonialStatus);

router.route('/:id')
  .get(getTestimonialById)
  .put(protect, authorize('super_admin', 'admin', 'operations_manager'), updateTestimonial)
  .delete(protect, authorize('super_admin', 'admin', 'operations_manager'), deleteTestimonial);

export { router as testimonialRoutes };
