import express from 'express';
import { protect, authorize } from '../middlewares/auth.js';
import * as backupController from '../controllers/backupController.js';

const router = express.Router();
router.use(protect);

router.post('/generate', authorize('super_admin'), backupController.createSystemBackup);
router.get('/download', authorize('super_admin'), backupController.downloadBackupFile);

export default router;
