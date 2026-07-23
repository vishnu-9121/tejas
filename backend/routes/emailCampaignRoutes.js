import express from 'express';
import { protect, authorize } from '../middlewares/auth.js';
import * as emailCampaignController from '../controllers/emailCampaignController.js';

const router = express.Router();
router.use(protect);

router.get('/', authorize('admin', 'super_admin'), emailCampaignController.getCampaigns);
router.post('/', authorize('admin', 'super_admin'), emailCampaignController.createCampaign);
router.post('/:campaignId/broadcast', authorize('admin', 'super_admin'), emailCampaignController.sendCampaignBroadcast);

export default router;
