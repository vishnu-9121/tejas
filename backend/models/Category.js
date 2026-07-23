import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },
    targetType: {
      type: String,
      enum: ['program', 'course', 'blog', 'event', 'general'],
      default: 'general',
      index: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: null
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const Category = mongoose.model('Category', categorySchema);
