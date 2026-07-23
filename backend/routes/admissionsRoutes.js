import express from 'express';
import {
  createAdmission,
  getMyAdmissions,
  getAdmissions,
  getAdmissionStats,
  getAdmissionById,
  updateAdmissionStatus,
} from '../controllers/admissionsController.js';
import { applyAdmissionValidator } from '../validators/admissionsValidator.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Require authentication for all admission routes
router.use(protect);

router.post('/', applyAdmissionValidator, createAdmission);
router.get('/my-applications', getMyAdmissions);

// Admin Only Routes
router.use(authorize('super_admin', 'admin', 'operations_manager'));

router.get('/stats', getAdmissionStats);

router.route('/')
  .get(getAdmissions);

router.route('/:id')
  .get(getAdmissionById);

router.put('/:id/status', updateAdmissionStatus);

export { router as admissionsRoutes };
