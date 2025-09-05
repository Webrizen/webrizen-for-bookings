import mongoose from 'mongoose';

const ParkProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
  },
  description: {
    type: String,
  },
  type: {
    type: String,
    enum: ['full-day', 'half-day'],
    required: true,
  },
  prices: [
    {
      ageGroup: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
});

export default mongoose.models.ParkProduct || mongoose.model('ParkProduct', ParkProductSchema);
