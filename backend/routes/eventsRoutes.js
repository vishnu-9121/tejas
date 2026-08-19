import express from 'express';
import {
  getEvents,
  getEventBySlug,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleEventStatus,
} from '../controllers/eventsController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/slug/:slug', getEventBySlug);
router.get('/:slug', getEventBySlug);


// Admin only routes
router.post('/', protect, authorize('admin', 'super_admin'), createEvent);
router.route('/:id')
  .get(protect, authorize('admin', 'super_admin'), getEventById)
  .put(protect, authorize('admin', 'super_admin'), updateEvent)
  .delete(protect, authorize('admin', 'super_admin'), deleteEvent);

router.patch('/:id/status', protect, authorize('admin', 'super_admin'), toggleEventStatus);

export { router as eventsRoutes };
