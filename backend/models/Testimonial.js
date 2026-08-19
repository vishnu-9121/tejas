import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      required: true, // e.g. "Student", "Alumni, Batch 2024"
      trim: true,
    },
    program: {
      type: String,
      trim: true,
      default: '',
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    imageUrl: {
      type: String, // Optional headshot
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

export const Testimonial = mongoose.model('Testimonial', testimonialSchema);
