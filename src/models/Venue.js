import mongoose from 'mongoose';

const VenueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a venue name'],
  },
  description: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  images: [
    {
      type: String,
    },
  ],
  capacity: {
    type: Number,
  },
  slots: [
    {
      startTime: String,
      endTime: String,
    },
  ],
  basePrice: {
    type: Number,
    required: true,
  },
  addons: [
    {
      name: String,
      price: Number,
    },
  ],
});

export default mongoose.models.Venue || mongoose.model('Venue', VenueSchema);
