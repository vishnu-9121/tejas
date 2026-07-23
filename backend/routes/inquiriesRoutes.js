import express from 'express';
import { createInquiry, getInquiries, updateInquiry } from '../controllers/inquiriesController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Public route to submit an inquiry from Contact Form
router.post('/', createInquiry);

// Admin only routes for managing inquiries
router.get('/', protect, authorize('admin', 'super_admin'), getInquiries);
router.put('/:id', protect, authorize('admin', 'super_admin'), updateInquiry);

export { router as inquiriesRoutes };
