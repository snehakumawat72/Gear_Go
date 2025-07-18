import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  vehicleId: { type: String, required: true },
  vehicleModel: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  pickupLocation: { type: String, required: true },
  dailyRate: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  customerDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  paymentId: { type: String },
  orderId: { type: String },
  signature: { type: String },
  cancellationReason: { type: String },
  refundAmount: { type: Number, default: 0 },
  
  // Legacy fields for backward compatibility
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
  gear: { type: mongoose.Schema.Types.ObjectId, ref: 'Gear' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pickupDate: { type: Date },
  returnDate: { type: Date },
  price: { type: Number },
}, {
  timestamps: true
});

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
