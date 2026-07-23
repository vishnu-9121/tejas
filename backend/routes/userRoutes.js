import express from 'express';
import { protect, authorize } from '../middlewares/auth.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();

router.use(protect); // All routes require auth

router.get('/me', userController.getMe);
router.put('/me', userController.updateProfile);
router.post('/me/save-program', userController.toggleSaveProgram);
router.post('/me/bookmark-event', userController.toggleBookmarkEvent);

// Admin user & role management routes
router.get('/', authorize('admin', 'super_admin'), userController.getAllUsers);
router.put('/:userId/role', authorize('admin', 'super_admin'), userController.updateUserRole);

export default router;
