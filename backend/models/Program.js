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
    eligibility: {
      type: String,
      required: true,
    },
    intake: {
      type: Number,
      required: true,
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
    thumbnailUrl: { type: String },
    bannerUrl: { type: String },
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

// Create program slug from the title before saving
programSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

programSchema.index({ category: 1 });
programSchema.index({ isActive: 1 });
programSchema.index({ isFeatured: 1 });

export const Program = mongoose.model('Program', programSchema);
