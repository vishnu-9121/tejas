import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error', 'action_required'],
    default: 'info'
  },
  channels: [{
    type: String,
    enum: ['in-app', 'email', 'push', 'whatsapp']
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  actionLink: {
    type: String, // e.g. /dashboard/applications/123
    default: null
  },
  // Optionally store the raw event payload that generated this
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, { timestamps: true });

export const Notification = mongoose.model('Notification', NotificationSchema);
