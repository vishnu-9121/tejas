import express from 'express';
import { protect, authorize } from '../middlewares/auth.js';
import * as studentController from '../controllers/studentController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Student Self-Service Routes (Scoped strictly to logged-in user via JWT)
router.get('/me', studentController.getMyStudentProfile);
router.put('/me', studentController.updateMyStudentProfile);

// Admin & Operations Manager Management Routes
router.use(authorize('super_admin', 'admin', 'operations_manager'));

router.route('/')
  .get(studentController.getStudents)
  .post(studentController.createStudent);

router.route('/:id')
  .get(studentController.getStudentById)
  .put(studentController.updateStudent)
  .delete(authorize('super_admin', 'admin'), studentController.deleteStudent); // Only higher admins can delete

router.post('/:id/timeline', studentController.addTimelineEvent);

export default router;
