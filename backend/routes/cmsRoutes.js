import express from 'express';
import { 
  getCmsDataByKey,
  updateCmsDataByKey,
  publishCmsDataByKey,
  getCmsVersionsByKey,
  rollbackCmsDataByKey,
  getPages, 
  getPublicPageBySlug, 
  createPage, 
  saveDraft, 
  publishPage, 
  rollbackPage, 
  getSettings, 
  updateSettings 
} from '../controllers/cmsController.js';
import { protect, restrictTo } from '../middlewares/auth.js';

const router = express.Router();

// Public Routes
router.get('/pages/:slug/public', getPublicPageBySlug);
router.get('/settings/public', getSettings);
router.get('/settings', getSettings);
router.get('/pages', getPages);
router.get('/:key', getCmsDataByKey);

// Protected Admin Routes for key-based CMS & page builder
router.get('/:key/versions', protect, restrictTo('admin', 'super_admin'), getCmsVersionsByKey);
router.put('/settings', protect, restrictTo('admin', 'super_admin'), updateSettings);
router.post('/pages', protect, restrictTo('admin', 'super_admin'), createPage);
router.put('/pages/:id/draft', protect, restrictTo('admin', 'super_admin'), saveDraft);
router.post('/pages/:id/publish', protect, restrictTo('admin', 'super_admin'), publishPage);
router.post('/pages/:id/rollback', protect, restrictTo('admin', 'super_admin'), rollbackPage);
router.put('/:key', protect, restrictTo('admin', 'super_admin'), updateCmsDataByKey);
router.post('/:key/publish', protect, restrictTo('admin', 'super_admin'), publishCmsDataByKey);
router.post('/:key/rollback', protect, restrictTo('admin', 'super_admin'), rollbackCmsDataByKey);

export { router as cmsRoutes };
export default router;
