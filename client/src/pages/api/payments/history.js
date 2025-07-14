import dbConnect from '../../../lib/mongodb';
import Payment from '../../../models/Payment';
import Booking from '../../../models/Booking';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await dbConnect();
      
      const { userId, page = 1, limit = 10 } = req.query;
      
      const payments = await Payment.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      // Get booking details for each payment
      const paymentHistory = await Promise.all(
        payments.map(async (payment) => {
          const booking = await Booking.findOne({ bookingId: payment.bookingId });
          return {
            ...payment.toObject(),
            booking: booking ? {
              vehicleModel: booking.vehicleModel,
              startDate: booking.startDate,
              endDate: booking.endDate,
              pickupLocation: booking.pickupLocation,
            } : null,
          };
        })
      );

      const total = await Payment.countDocuments({ userId });
      
      res.status(200).json({
        payments: paymentHistory,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      });
    } catch (error) {
      console.error('Payment history error:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}