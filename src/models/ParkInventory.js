import mongoose from 'mongoose';

const ParkInventorySchema = new mongoose.Schema({
  parkProduct: {
    type: mongoose.Schema.ObjectId,
    ref: 'ParkProduct',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  totalTickets: {
    type: Number,
    required: true,
  },
  availableTickets: {
    type: Number,
    required: true,
  },
});

ParkInventorySchema.index({ parkProduct: 1, date: 1 }, { unique: true });

export default mongoose.models.ParkInventory || mongoose.model('ParkInventory', ParkInventorySchema);
