import crypto from 'crypto';
import dbConnect from '../../lib/mongodb';
import Payment from '../../models/Payment';
import Booking from '../../models/Booking';
import { sendPaymentConfirmation } from '../../lib/email';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await dbConnect();
      
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

      // Verify signature
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature === razorpay_signature) {
        // Update booking status
        const booking = await Booking.findOneAndUpdate(
          { bookingId },
          { 
            paymentStatus: 'paid',
            status: 'confirmed',
            paymentId: razorpay_payment_id
          },
          { new: true }
        );

        // Save payment record
        const payment = new Payment({
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          bookingId,
          userId: booking.userId,
          amount: booking.totalAmount,
          status: 'success',
          receipt: `booking_${bookingId}_${Date.now()}`,
        });
        await payment.save();

        // Send confirmation email
        await sendPaymentConfirmation(booking);

        res.status(200).json({ success: true, booking });
      } else {
        res.status(400).json({ error: 'Payment verification failed' });
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}