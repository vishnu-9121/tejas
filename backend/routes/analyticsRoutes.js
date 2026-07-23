import express from 'express';
import { 
  getOverview, 
  getAdminAnalytics, 
  getFacultyAnalytics, 
  getManagementAnalytics, 
  trackEvent 
} from '../controllers/analyticsController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Public tracking ingest — no auth required (frontend tracker fires this)
router.post('/track', trackEvent);

// Protected routes
router.use(protect);

// Admin-level analytics
router.get('/overview', authorize('admin', 'super_admin'), getOverview);
router.get('/admin', authorize('admin', 'super_admin'), getAdminAnalytics);

// Faculty analytics
router.get('/faculty', authorize('admin', 'super_admin', 'faculty', 'mentor'), getFacultyAnalytics);

// Management/Board analytics
router.get('/management', authorize('admin', 'super_admin'), getManagementAnalytics);

export { router as analyticsRoutes };
