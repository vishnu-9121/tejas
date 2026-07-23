import express from 'express';
import {
  getBlogs,
  getBlogBySlug,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.get('/', getBlogs);
router.get('/slug/:slug', getBlogBySlug);

// Admin only routes
router.get('/admin/all', protect, authorize('admin', 'super_admin'), getBlogs);
router.post('/', protect, authorize('admin', 'super_admin'), createBlog);
router.route('/:id')
  .get(protect, authorize('admin', 'super_admin'), getBlogById)
  .put(protect, authorize('admin', 'super_admin'), updateBlog)
  .delete(protect, authorize('admin', 'super_admin'), deleteBlog);

export { router as blogRoutes };
