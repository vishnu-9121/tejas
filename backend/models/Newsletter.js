import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true, // true = subscribed, false = unsubscribed
    }
  },
  {
    timestamps: true,
  }
);

export const Newsletter = mongoose.model('Newsletter', newsletterSchema);
