import express from 'express';
import { getGallery, addGalleryImage, deleteGalleryImage, getGalleryById, updateGalleryImage } from '../controllers/galleryController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.route('/')
  .get(getGallery)
  .post(protect, authorize('super_admin', 'admin', 'operations_manager'), addGalleryImage);

router.route('/:id')
  .get(getGalleryById)
  .put(protect, authorize('super_admin', 'admin', 'operations_manager'), updateGalleryImage)
  .delete(protect, authorize('super_admin', 'admin', 'operations_manager'), deleteGalleryImage);

export { router as galleryRoutes };
