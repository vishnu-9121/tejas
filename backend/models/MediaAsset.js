import mongoose from 'mongoose';

const mediaAssetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
    },
    dimensions: {
      width: Number,
      height: Number,
    },
    altText: {
      type: String,
      default: '',
    },
    folder: {
      type: String,
      default: '/',
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  },
  {
    timestamps: true,
  }
);

export const MediaAsset = mongoose.model('MediaAsset', mediaAssetSchema);
