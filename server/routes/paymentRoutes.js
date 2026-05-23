import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { createPaymentOrder, verifyPayment } from '../controllers/paymentController.js';

const router = Router();

router.post('/create-order', authMiddleware, createPaymentOrder);
router.post('/verify-payment', authMiddleware, verifyPayment);

export default router;
