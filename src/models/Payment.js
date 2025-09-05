import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order',
    required: true,
  },
  razorpayPaymentId: {
    type: String,
    required: true,
  },
  razorpayOrderId: {
    type: String,
    required: true,
  },
  razorpaySignature: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
