import mongoose from 'mongoose';

const seoPageSchema = new mongoose.Schema(
  {
    pageKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    route: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    h1: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    canonical: {
      type: String,
      default: '',
      trim: true,
    },
    robots: {
      type: String,
      default: 'index, follow',
      trim: true,
    },
    ogTitle: {
      type: String,
      default: '',
      trim: true,
    },
    ogDescription: {
      type: String,
      default: '',
      trim: true,
    },
    ogImage: {
      type: String,
      default: 'https://unlocktejas.com/logo.png',
      trim: true,
    },
    keywords: {
      type: [String],
      default: [],
    },
    schemaJson: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    priority: {
      type: Number,
      default: 0.8,
      min: 0.1,
      max: 1.0,
    },
    changefreq: {
      type: String,
      enum: ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'],
      default: 'weekly',
    },
  },
  {
    timestamps: true,
  }
);

export const SEOPage = mongoose.models.SEOPage || mongoose.model('SEOPage', seoPageSchema);
export default SEOPage;
