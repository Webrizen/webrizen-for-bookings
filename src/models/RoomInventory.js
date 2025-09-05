import mongoose from 'mongoose';

const RoomInventorySchema = new mongoose.Schema({
  roomType: {
    type: mongoose.Schema.ObjectId,
    ref: 'RoomType',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  totalRooms: {
    type: Number,
    required: true,
  },
  availableRooms: {
    type: Number,
    required: true,
  },
});

RoomInventorySchema.index({ roomType: 1, date: 1 }, { unique: true });

export default mongoose.models.RoomInventory || mongoose.model('RoomInventory', RoomInventorySchema);
