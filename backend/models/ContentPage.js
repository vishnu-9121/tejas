import mongoose from 'mongoose';

const ContentPageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true // E.g., 'home', 'about', 'admissions'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  // SEO Metadata at Page Level
  seo: {
    metaTitle: String,
    metaDescription: String,
    ogImage: String,
    keywords: [String],
    schemaMarkup: mongoose.Schema.Types.Mixed
  },
  // Pointers to the active versions
  publishedVersion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ContentVersion',
    default: null
  },
  draftVersion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ContentVersion',
    default: null
  },
  // For scheduled publishing
  scheduledPublishAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

export const ContentPage = mongoose.model('ContentPage', ContentPageSchema);
