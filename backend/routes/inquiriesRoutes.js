import express from 'express';
import {
  createInquiry,
  getInquiries,
  updateInquiry,
} from '../controllers/inquiriesController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Public route for inquiries / contact submissions
router.post('/', createInquiry);
router.post('/contact', createInquiry);

// Protected admin routes
router.get('/', protect, authorize('super_admin', 'admin', 'operations_manager'), getInquiries);
router.put('/:id', protect, authorize('super_admin', 'admin', 'operations_manager'), updateInquiry);
router.put('/:id/status', protect, authorize('super_admin', 'admin', 'operations_manager'), updateInquiry);

export { router as inquiriesRoutes };

