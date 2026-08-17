import express from 'express';
import {
  getFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  toggleFeatureFaculty
} from '../controllers/facultyController.js';
import { protect, restrictTo } from '../middlewares/auth.js';

const router = express.Router();

// Public
router.get('/', getFaculty);
router.get('/:id', getFacultyById);

// Admin Only
router.use(protect);
router.use(restrictTo('admin', 'super_admin'));

router.post('/', createFaculty);
router.put('/:id', updateFaculty);
router.delete('/:id', deleteFaculty);
router.patch('/:id/feature', toggleFeatureFaculty);

export { router as facultyRoutes };
export default router;
