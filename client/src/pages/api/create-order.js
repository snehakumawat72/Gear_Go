import Razorpay from 'razorpay';
import dbConnect from '../../lib/mongodb';
import Booking from '../../models/Booking';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await dbConnect();
      
      const { bookingId, amount, currency = 'INR' } = req.body;
      
      // Get booking details
      const booking = await Booking.findOne({ bookingId });
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      const receipt = `booking_${bookingId}_${Date.now()}`;
      
      const order = await razorpay.orders.create({
        amount: amount * 100, // Convert to paise
        currency,
        receipt,
        notes: {
          bookingId,
          vehicleModel: booking.vehicleModel,
          customerName: booking.customerDetails.name,
        },
      });

      res.status(200).json(order);
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}