import express from 'express';
import { getMyNotifications, markAsRead, markAllAsRead } from '../controllers/notificationController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect); // All notification routes require authentication

router.route('/')
  .get(getMyNotifications);

router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);

export default router;
