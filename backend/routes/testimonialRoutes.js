import express from 'express';
import { getTestimonials, createTestimonial, deleteTestimonial, getTestimonialById, updateTestimonial } from '../controllers/testimonialController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.route('/')
  .get(getTestimonials)
  .post(protect, authorize('super_admin', 'admin', 'operations_manager'), createTestimonial);

router.route('/:id')
  .get(getTestimonialById)
  .put(protect, authorize('super_admin', 'admin', 'operations_manager'), updateTestimonial)
  .delete(protect, authorize('super_admin', 'admin', 'operations_manager'), deleteTestimonial);

export { router as testimonialRoutes };
