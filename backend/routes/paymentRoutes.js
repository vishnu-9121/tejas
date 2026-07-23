import express from 'express';
import { getMyPayments, createPayment } from '../controllers/paymentController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);
router.get('/my-payments', getMyPayments);
router.post('/', createPayment);

export default router;
