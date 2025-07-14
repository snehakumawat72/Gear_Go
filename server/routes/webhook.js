import express from 'express';
import crypto from 'crypto';

const router = express.Router();

router.post('/razorpay', express.json({ verify: (req, res, buf) => req.rawBody = buf }), (req, res) => {
  const secret = process.env.WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(req.rawBody)
    .digest('hex');

  if (signature === expectedSignature) {
    console.log('✅ Webhook verified:', req.body.event);

    // You can now handle events like:
    if (req.body.event === 'payment.captured') {
      const payment = req.body.payload.payment.entity;
      console.log('💰 Payment captured:', payment);
    }

    res.status(200).json({ success: true });
  } else {
    console.warn('❌ Invalid webhook signature!');
    res.status(400).send('Invalid signature');
  }
});

export default router;
