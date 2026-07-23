import mongoose from 'mongoose';

const emailCampaignSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
    targetSegment: {
      type: String,
      enum: ['all', 'students', 'faculty', 'subscribers', 'leads', 'custom'],
      default: 'all',
    },
    customEmails: [{
      type: String,
      trim: true,
    }],
    scheduledAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'sending', 'sent', 'failed'],
      default: 'draft',
      index: true,
    },
    sentCount: {
      type: Number,
      default: 0,
    },
    failedCount: {
      type: Number,
      default: 0,
    },
    deliveryLogs: [{
      email: String,
      status: { type: String, enum: ['sent', 'failed'] },
      error: String,
      timestamp: { type: Date, default: Date.now }
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  },
  {
    timestamps: true,
  }
);

export const EmailCampaign = mongoose.model('EmailCampaign', emailCampaignSchema);
