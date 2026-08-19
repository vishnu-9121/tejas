import express from 'express';
import { subscribe, unsubscribe, getAllSubscribers } from '../controllers/newsletterController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { globalLimiter } from '../middlewares/security.js';

const router = express.Router();

// Public routes
router.post('/', globalLimiter, subscribe);
router.post('/subscribe', globalLimiter, subscribe);
router.post('/unsubscribe', globalLimiter, unsubscribe);

// Admin routes
router.get('/', protect, authorize('super_admin', 'admin', 'operations_manager'), getAllSubscribers);

export { router as newsletterRoutes };
