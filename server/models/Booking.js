import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const BookingSchema = new Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  // Customer reference
  customer: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Vehicle or Gear reference using dynamic ref
  onModel: {
    type: String,
    required: true,
    enum: ['Car', 'Gear']
  },
  vehicle: {
  type: Types.ObjectId,
  required: true,
  refPath: 'onModel'
},


  // Booking period
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },

  pickupLocation: {
    type: String,
    trim: true
  },

  // Financials
  dailyRate: {
    type: Number,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },

  // Statuses
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

  // Payment reference
  payment: {
    type: Types.ObjectId,
    ref: 'Payment'
  },

  // Optional refund details
  refundAmount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

export default mongoose.models.Booking || model('Booking', BookingSchema);
