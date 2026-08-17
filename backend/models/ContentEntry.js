import mongoose from 'mongoose';

const contentEntrySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true, // e.g., 'homepage', 'about', 'navigation', 'footer', 'campus', 'careers', 'global_faqs', 'legal', 'notifications', 'quick_connect', 'seo', 'site_settings', 'social_proof', 'global_exit_intent'
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      default: '',
    },
    type: {
      type: String,
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
      type: mongoose.Schema.Types.Mixed, // The currently live published data
      default: {},
    },
    publishedVersionNumber: {
      type: Number,
      default: 0,
    },
    currentVersionNumber: {
      type: Number,
      default: 1,
    },
    versions: [
      {
        versionNumber: { type: Number, required: true },
        data: { type: mongoose.Schema.Types.Mixed },
        commitMessage: { type: String, default: 'Published update' },
        publishedAt: { type: Date, default: Date.now },
        publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
      }
    ],
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

export const ContentEntry = mongoose.models.ContentEntry || mongoose.model('ContentEntry', contentEntrySchema);
export default ContentEntry;
