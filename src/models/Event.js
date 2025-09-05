import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  venue: {
    type: mongoose.Schema.ObjectId,
    ref: 'Venue',
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  slot: {
    startTime: String,
    endTime: String,
  },
  addons: [
    {
      name: String,
      price: Number,
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['booked', 'cancelled'],
    default: 'booked',
  },
});

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
