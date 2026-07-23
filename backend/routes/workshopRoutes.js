import express from 'express';
import {
  getWorkshops,
  getWorkshopBySlug,
  getWorkshopById,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  toggleWorkshopStatus
} from '../controllers/workshopController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.route('/')
  .get(getWorkshops)
  .post(protect, authorize('super_admin', 'admin', 'operations_manager'), createWorkshop);

router.route('/:slug')
  .get(getWorkshopBySlug);

router.route('/:id')
  .get(protect, authorize('super_admin', 'admin', 'operations_manager'), getWorkshopById)
  .put(protect, authorize('super_admin', 'admin', 'operations_manager'), updateWorkshop)
  .delete(protect, authorize('super_admin', 'admin'), deleteWorkshop);

router.patch('/:id/status', protect, authorize('admin', 'super_admin'), toggleWorkshopStatus);

export { router as workshopRoutes };
