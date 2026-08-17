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

// Public Routes (For frontend public access)
router.get('/pages/:slug/public', getPublicPageBySlug);
router.get('/settings/public', getSettings);
router.get('/settings', getSettings);

// Public / Authenticated key-based CMS queries
router.get('/:key', getCmsDataByKey);
router.get('/:key/versions', getCmsVersionsByKey);

// Protected Admin Routes for key-based CMS & page builder
router.use(protect);
router.use(restrictTo('admin', 'super_admin'));

// Key-based CMS management
router.put('/:key', updateCmsDataByKey);
router.post('/:key/publish', publishCmsDataByKey);
router.post('/:key/rollback', rollbackCmsDataByKey);

// Global Settings
router.route('/settings')
  .put(updateSettings);

// Page Management
router.route('/pages')
  .get(getPages)
  .post(createPage);

// Versioning and Publishing (Custom pages)
router.put('/pages/:id/draft', saveDraft);
router.post('/pages/:id/publish', publishPage);
router.post('/pages/:id/rollback', rollbackPage);

export { router as cmsRoutes };
export default router;
