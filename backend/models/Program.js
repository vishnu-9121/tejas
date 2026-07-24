import mongoose from 'mongoose';
import slugify from 'slugify';

const programSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a program title'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify a program category'],
      enum: ['Undergraduate', 'Postgraduate', 'Executive', 'Certification'],
    },
    shortDescription: {
      type: String,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    duration: {
      type: String,
      required: true,
    },
    fees: {
      type: Number,
      required: true,
    },
    pricing: {
      currency: { type: String, default: 'INR' },
      totalFee: { type: Number },
      installmentAvailable: { type: Boolean, default: true },
    },
    eligibility: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      enum: ['On-Campus', 'Online', 'Hybrid', 'Distance Learning'],
      default: 'On-Campus',
    },
    intake: {
      type: Number,
      required: true,
    },
    featuredImage: {
      type: String,
    },
    thumbnailUrl: {
      type: String,
    },
    bannerUrl: {
      type: String,
    },
    brochure: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
    curriculum: [
      {
        semester: { type: String },
        courses: [{ type: String }],
      },
    ],
    overview: { type: String },
    learningOutcomes: [{ type: String }],
    faqs: [
      {
        question: { type: String },
        answer: { type: String }
      }
    ],
    isFeatured: {
      type: Boolean,
      default: false
    },
    mentorMapping: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MentorProfile',
      }
    ],
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      keywords: { type: String },
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Archived'],
      default: 'Published',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

programSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (!this.shortDescription && this.description) {
    this.shortDescription = this.description.substring(0, 160);
  }
  if (this.featuredImage && !this.thumbnailUrl) {
    this.thumbnailUrl = this.featuredImage;
  } else if (this.thumbnailUrl && !this.featuredImage) {
    this.featuredImage = this.thumbnailUrl;
  }
  if (this.fees && (!this.pricing || !this.pricing.totalFee)) {
    this.pricing = { currency: 'INR', totalFee: this.fees, installmentAvailable: true };
  }
  next();
});

programSchema.index({ category: 1 });
programSchema.index({ slug: 1 });
programSchema.index({ isActive: 1 });
programSchema.index({ isFeatured: 1 });
programSchema.index({ order: 1 });

export const Program = mongoose.models.Program || mongoose.model('Program', programSchema);
export default Program;
