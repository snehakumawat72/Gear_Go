import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const PaymentSchema = new Schema({
  // External payment provider ID
  paymentId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  // Optional order reference (e.g., your internal order number)
  orderId: {
    type: String,
    trim: true
  },

  // Reference to the booking this payment belongs to
  booking: {
    type: Types.ObjectId,
    ref: 'Booking',
    required: true
  },

  // User who made the payment
  customer: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Amount and currency
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR',
    uppercase: true,
    trim: true
  },

  // Payment status lifecycle
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'refunded'],
    default: 'pending'
  },

  // Payment method details (e.g. card, UPI, netbanking)
  method: {
    type: String,
    trim: true
  },

  // Timestamps
  paymentDate: {
    type: Date,
    default: () => new Date()
  },

  // Refund details
  refund: {
    refundId: {
      type: String,
      trim: true
    },
    amount: {
      type: Number,
      default: 0,
      min: 0
    },
    refundedAt: Date
  },

  // Receipt URL or identifier
  receipt: {
    type: String,
    trim: true
  },

  // Arbitrary notes or metadata
  notes: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

export default mongoose.models.Payment || model('Payment', PaymentSchema);
