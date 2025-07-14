import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  paymentId: { type: String, required: true, unique: true },
  orderId: { type: String, required: true },
  bookingId: { type: String, required: true },
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { 
    type: String, 
    enum: ['pending', 'success', 'failed', 'refunded'], 
    default: 'pending' 
  },
  method: { type: String }, // card, upi, netbanking
  paymentDate: { type: Date, default: Date.now },
  refundId: { type: String },
  refundAmount: { type: Number, default: 0 },
  receipt: { type: String },
  notes: { type: Object },
}, {
  timestamps: true
});

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);