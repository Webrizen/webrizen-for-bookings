import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
    productType: {
        type: String,
        required: true,
        enum: ['Venue', 'RoomType', 'ParkProduct'],
    },
    product: {
        type: mongoose.Schema.ObjectId,
        required: true,
        refPath: 'items.productType',
    },
    quantity: {
        type: Number,
        default: 1
    },
    price: {
        type: Number,
        required: true,
    },
    // Venue specific
    eventDate: Date,
    slot: { startTime: String, endTime: String },
    // Room specific
    checkInDate: Date,
    checkOutDate: Date,
    // Park specific
    visitDate: Date,
    ageGroup: String,
});


const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [OrderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  razorpayOrderId: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
