import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    issueDate: {
      type: Date,
      default: Date.now
    },
    expiryDate: {
      type: Date,
      default: null
    },
    verificationCode: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    certificateUrl: {
      type: String, // Cloudinary or PDF URL
      required: true
    },
    gradeOrGPA: {
      type: String,
      default: 'Passed'
    },
    status: {
      type: String,
      enum: ['active', 'revoked', 'expired'],
      default: 'active',
      index: true
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

certificateSchema.index({ student: 1, program: 1 });

export const Certificate = mongoose.model('Certificate', certificateSchema);
