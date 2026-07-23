import express from 'express';
import { getMyCertificates, verifyCertificate, createCertificate } from '../controllers/certificateController.js';
import { protect, restrictTo } from '../middlewares/auth.js';

const router = express.Router();

router.get('/verify/:code', verifyCertificate); // Public verification

router.use(protect);
router.get('/my-certificates', getMyCertificates);
router.post('/', restrictTo('admin', 'super_admin'), createCertificate);

export default router;
