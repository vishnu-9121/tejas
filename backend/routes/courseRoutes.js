import express from 'express';
import {
  getCourses,
  getCourseBySlug,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  toggleCourseStatus
} from '../controllers/courseController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/slug/:slug', getCourseBySlug);
router.get('/:id', getCourseById);

// Protected routes (Admin/Faculty)
router.post('/', protect, authorize('super_admin', 'admin', 'operations_manager'), createCourse);
router.put('/:id', protect, authorize('admin', 'super_admin'), updateCourse);
router.delete('/:id', protect, authorize('admin', 'super_admin'), deleteCourse);

router.patch('/:id/status', protect, authorize('admin', 'super_admin', 'operations_manager'), toggleCourseStatus);

export { router as courseRoutes };
