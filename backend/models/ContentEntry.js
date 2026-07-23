import mongoose from 'mongoose';

const contentEntrySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true, // e.g., 'homepage', 'footer', 'about_page'
    },
    title: {
      type: String,
      required: true, // e.g., 'Homepage Settings'
    },
    type: {
      type: String,
      enum: ['PAGE', 'GLOBAL_COMPONENT', 'POPUP', 'SEO'],
      default: 'PAGE',
    },
    status: {
      type: String,
      enum: ['DRAFT', 'IN_REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED'],
      default: 'DRAFT',
    },
    data: {
      type: mongoose.Schema.Types.Mixed, // The working draft data
      default: {},
    },
    publishedData: {
      type: mongoose.Schema.Types.Mixed, // The currently live data
      default: {},
    },
    publishedVersionNumber: {
      type: Number,
      default: 0,
    },
    currentVersionNumber: {
      type: Number,
      default: 1, // Increments every time a new version is created
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    scheduledPublishAt: {
      type: Date,
      default: null,
    }
  },
  {
    timestamps: true,
  }
);

export const ContentEntry = mongoose.model('ContentEntry', contentEntrySchema);
