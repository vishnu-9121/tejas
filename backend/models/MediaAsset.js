import mongoose from 'mongoose';

const mediaAssetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    originalName: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number, // in bytes
      default: 0,
    },
    dimensions: {
      width: Number,
      height: Number,
    },
    altText: {
      type: String,
      default: '',
    },
    caption: {
      type: String,
      default: '',
    },
    tags: [{
      type: String,
      trim: true,
    }],
    folder: {
      type: String,
      default: 'General',
      index: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    }
  },
  {
    timestamps: true,
  }
);

mediaAssetSchema.index({ name: 'text', altText: 'text', tags: 'text' });

export const MediaAsset = mongoose.model('MediaAsset', mediaAssetSchema);
