import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
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
    price: { // price per unit
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


const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [CartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Cart || mongoose.model('Cart', CartSchema);
