import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String, // Used as main image OR video thumbnail
      required: true,
    },
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      default: 'image',
    },
    videoUrl: {
      type: String, // e.g. YouTube embed link or direct MP4
    },
    album: {
      type: String,
      trim: true,
      default: 'General',
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      enum: ['campus', 'events', 'students', 'alumni'],
      default: 'campus',
    },
    isFeatured: {
      type: Boolean,
      default: false,
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

export const Gallery = mongoose.model('Gallery', gallerySchema);
