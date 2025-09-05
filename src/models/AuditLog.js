import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  action: {
    type: String,
    required: true,
  },
  details: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
