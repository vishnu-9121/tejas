import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      default: '',
    },
    program: {
      type: String,
      default: 'General Inquiry',
    },
    source: {
      type: String,
      default: 'Website Form',
    },
    campaign: {
      type: String,
      default: 'Organic',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'proposal', 'converted', 'lost'],
      default: 'new',
      index: true,
    },
    assignedStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    leadScore: {
      type: Number,
      default: 10,
    },
    followUpDate: {
      type: Date,
    },
    notes: [{
      authorName: String,
      text: String,
      createdAt: { type: Date, default: Date.now }
    }],
    timeline: [{
      action: String,
      description: String,
      timestamp: { type: Date, default: Date.now }
    }]
  },
  {
    timestamps: true,
  }
);

leadSchema.index({ name: 'text', email: 'text', program: 'text' });

export const Lead = mongoose.model('Lead', leadSchema);
