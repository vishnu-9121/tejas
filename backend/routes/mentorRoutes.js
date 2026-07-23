import express from 'express';
import {
  getMentors,
  getMentorById,
  createMentor,
  updateMentor,
  deleteMentor,
  toggleMentorFeature
} from '../controllers/mentorController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.route('/')
  .get(getMentors)
  .post(protect, authorize('admin', 'super_admin'), createMentor);

router.route('/:id')
  .get(getMentorById)
  .put(protect, authorize('admin', 'super_admin'), updateMentor)
  .delete(protect, authorize('super_admin'), deleteMentor);

router.patch('/:id/feature', protect, authorize('admin', 'super_admin'), toggleMentorFeature);

export { router as mentorRoutes };
