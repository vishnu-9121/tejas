import express from 'express';
import { 
  getPages, 
  getPublicPageBySlug, 
  createPage, 
  saveDraft, 
  publishPage, 
  rollbackPage, 
  getSettings, 
  updateSettings 
} from '../controllers/cmsController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes (For the frontend renderer)
router.get('/pages/:slug/public', getPublicPageBySlug);
router.get('/settings/public', getSettings); // Public access to theme/nav settings

// Protected Admin Routes
router.use(protect);
router.use(restrictTo('admin', 'super_admin'));

// Global Settings
router.route('/settings')
  .get(getSettings)
  .put(updateSettings);

// Page Management
router.route('/pages')
  .get(getPages)
  .post(createPage);

// Versioning and Publishing
router.put('/pages/:id/draft', saveDraft);
router.post('/pages/:id/publish', publishPage);
router.post('/pages/:id/rollback', rollbackPage);

export default router;
