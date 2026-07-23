import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import { upload } from '../middlewares/upload.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Only admins can upload files
router.post('/', protect, authorize('admin', 'super_admin'), upload.single('image'), uploadImage);

export { router as uploadRoutes };
