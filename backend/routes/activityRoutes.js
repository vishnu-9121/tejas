import express from 'express';
import { getGlobalActivity, getActivityStats } from '../controllers/activityController.js';
import { protect, restrictTo } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('admin', 'super_admin'));

router.get('/', getGlobalActivity);
router.get('/stats', getActivityStats);

export default router;
