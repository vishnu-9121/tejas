import express from 'express';
import {
  getAllSEOPages,
  getSEOPageByKey,
  updateSEOPage,
  generateDynamicSitemap,
  getRobotsTxt
} from '../controllers/seoController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Public SEO Endpoints
router.get('/', getAllSEOPages);
router.get('/sitemap.xml', generateDynamicSitemap);
router.get('/robots.txt', getRobotsTxt);
router.get('/:pageKey', getSEOPageByKey);

// Protected Admin Endpoints
router.put('/:pageKey', protect, authorize('admin', 'super_admin'), updateSEOPage);

export { router as seoRoutes };
export default router;
