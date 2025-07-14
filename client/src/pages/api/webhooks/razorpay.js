import crypto from 'crypto';
import dbConnect from '../../../lib/mongodb';
import Payment from '../../../models/Payment';
import Booking from '../../../models/Booking';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await dbConnect();
      
      const { body } = req;
      const signature = req.headers['x-razorpay-signature'];
      
      // Verify webhook signature
      const expectedSignature = crypto
        .createHmac('sha256', process.env.WEBHOOK_SECRET)
        .update(JSON.stringify(body))
        .digest('hex');

      if (signature !== expectedSignature) {
        return res.status(400).json({ error: 'Invalid signature' });
      }

      const { event, payload } = body;

      switch (event) {
        case 'payment.captured':
          await handlePaymentCaptured(payload.payment.entity);
          break;
        case 'payment.failed':
          await handlePaymentFailed(payload.payment.entity);
          break;
        case 'refund.processed':
          await handleRefundProcessed(payload.refund.entity);
          break;
        default:
          console.log(`Unhandled event: ${event}`);
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

async function handlePaymentCaptured(payment) {
  await Payment.findOneAndUpdate(
    { paymentId: payment.id },
    { 
      status: 'success',
      method: payment.method,
    }
  );
}

async function handlePaymentFailed(payment) {
  await Payment.findOneAndUpdate(
    { paymentId: payment.id },
    { status: 'failed' }
  );
}

async function handleRefundProcessed(refund) {
  await Payment.findOneAndUpdate(
    { refundId: refund.id },
    { status: 'refunded' }
  );
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};