import express from 'express';
import {
  getPrograms,
  getProgramBySlug,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
  toggleArchiveProgram,
  toggleFeatureProgram
} from '../controllers/programController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { cacheMiddleware, clearCache } from '../middlewares/cache.js';

const router = express.Router();

// Public routes
router.get('/', cacheMiddleware(300), getPrograms);
router.route('/id/:id')
  .get(protect, authorize('super_admin', 'admin', 'operations_manager'), getProgramById);

router.route('/:slug')
  .get(cacheMiddleware(300), getProgramBySlug);

// Helper to clear program cache
const clearProgramCache = (req, res, next) => {
  clearCache('/api/v1/programs');
  next();
};

// Admin only routes
router.post('/', protect, authorize('admin', 'super_admin'), clearProgramCache, createProgram);
router.route('/:id')
  .put(protect, authorize('admin', 'super_admin'), clearProgramCache, updateProgram)
  .delete(protect, authorize('admin', 'super_admin'), clearProgramCache, deleteProgram);

router.patch('/:id/archive', protect, authorize('admin', 'super_admin', 'operations_manager'), clearProgramCache, toggleArchiveProgram);
router.patch('/:id/feature', protect, authorize('admin', 'super_admin', 'operations_manager'), clearProgramCache, toggleFeatureProgram);

export { router as programRoutes };
