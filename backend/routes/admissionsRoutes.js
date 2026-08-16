import express from 'express';
import {
  createAdmission,
  getMyAdmissions,
  getAdmissions,
  getAdmissionStats,
  getAdmissionById,
  updateAdmissionStatus,
  exportAdmissionsExcel,
} from '../controllers/admissionsController.js';
import { applyAdmissionValidator } from '../validators/admissionsValidator.js';
import { protect, authorize, optionalAuth } from '../middlewares/auth.js';

const router = express.Router();

// Allow admission submission with optional authentication (prefers logged-in user if token provided)
router.post('/', optionalAuth, applyAdmissionValidator, createAdmission);

// Require authentication for applicant to view their own admissions
router.get('/my-applications', protect, getMyAdmissions);

// Admin Only Routes
router.get('/export/excel', protect, authorize('super_admin', 'admin', 'operations_manager'), exportAdmissionsExcel);
router.get('/stats', protect, authorize('super_admin', 'admin', 'operations_manager'), getAdmissionStats);

router.route('/')
  .get(protect, authorize('super_admin', 'admin', 'operations_manager'), getAdmissions);

router.route('/:id')
  .get(protect, authorize('super_admin', 'admin', 'operations_manager'), getAdmissionById);

router.put('/:id/status', protect, authorize('super_admin', 'admin', 'operations_manager'), updateAdmissionStatus);

export { router as admissionsRoutes };
