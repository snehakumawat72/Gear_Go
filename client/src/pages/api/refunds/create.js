import Razorpay from 'razorpay';
import dbConnect from '../../../lib/mongodb';
import Payment from '../../../models/Payment';
import Booking from '../../../models/Booking';
import { sendRefundNotification } from '../../../lib/email';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await dbConnect();
      
      const { bookingId, refundAmount, reason } = req.body;
      
      // Get booking and payment details
      const booking = await Booking.findOne({ bookingId });
      const payment = await Payment.findOne({ bookingId });
      
      if (!booking || !payment) {
        return res.status(404).json({ error: 'Booking or payment not found' });
      }

      // Create refund
      const refund = await razorpay.payments.refund(payment.paymentId, {
        amount: refundAmount * 100, // Convert to paise
        speed: 'normal',
        notes: {
          reason,
          bookingId,
        },
      });

      // Update payment record
      await Payment.findByIdAndUpdate(payment._id, {
        status: 'refunded',
        refundId: refund.id,
        refundAmount,
      });

      // Update booking status
      await Booking.findOneAndUpdate(
        { bookingId },
        { 
          status: 'cancelled',
          paymentStatus: 'refunded',
          cancellationReason: reason,
          refundAmount,
        }
      );

      // Send refund notification
      await sendRefundNotification(booking, refund);

      res.status(200).json({ success: true, refund });
    } catch (error) {
      console.error('Refund error:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}