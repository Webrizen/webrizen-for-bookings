import mongoose from 'mongoose';

const RoomTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a room type name'],
  },
  description: {
    type: String,
  },
  images: [
    {
      type: String,
    },
  ],
  price: {
    type: Number,
    required: true,
  },
  amenities: [
    {
      type: String,
    },
  ],
});

export default mongoose.models.RoomType || mongoose.model('RoomType', RoomTypeSchema);
