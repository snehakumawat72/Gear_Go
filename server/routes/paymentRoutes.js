import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.post('/create-order', protect, createOrder);
router.post('/verify-payment', verifyPayment);

export default router;

