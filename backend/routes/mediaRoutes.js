import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect, authorize } from '../middlewares/auth.js';
import * as mediaController from '../controllers/mediaController.js';

const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `media-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ storage });

const router = express.Router();
router.use(protect);

router.post('/upload', upload.array('files', 10), mediaController.uploadMedia);
router.get('/', mediaController.getMediaAssets);
router.get('/stats', mediaController.getMediaStorageStats);
router.put('/:id', authorize('admin', 'super_admin'), mediaController.updateMediaMetadata);
router.post('/delete-bulk', authorize('admin', 'super_admin'), mediaController.deleteMediaBulk);

export default router;
