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
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  channels: [{
    type: String,
    enum: ['in-app', 'email', 'push', 'whatsapp']
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  readStatus: {
    type: Boolean,
    default: false
  },
  actionLink: {
    type: String,
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, { timestamps: true });

NotificationSchema.pre('save', function (next) {
  if (this.isRead !== undefined && this.readStatus !== this.isRead) {
    this.readStatus = this.isRead;
  } else if (this.readStatus !== undefined && this.isRead !== this.readStatus) {
    this.isRead = this.readStatus;
  }
  next();
});

NotificationSchema.index({ recipient: 1, isRead: 1 });
NotificationSchema.index({ priority: 1 });
NotificationSchema.index({ createdAt: -1 });

export const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
export default Notification;
