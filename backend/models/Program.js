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
      trim: true,
      default: 'Undergraduate',
    },
    degreeLevel: {
      type: String,
      enum: ['Undergraduate', 'Postgraduate', 'Executive', 'Diploma', 'Certification', 'Master', 'Bachelor', 'Doctorate', 'Engineering', 'Management', 'Data Science', 'Other'],
      default: 'Undergraduate',
    },
    shortDescription: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    overview: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      default: '1 Year',
    },
    fees: {
      type: Number,
      default: 0,
    },
    pricing: {
      currency: { type: String, default: 'INR' },
      totalFee: { type: Number, default: 0 },
      installmentAvailable: { type: Boolean, default: true },
    },
    eligibility: {
      type: String,
      default: 'Open to all eligible candidates based on academic criteria.',
    },
    mode: {
      type: String,
      enum: ['On-Campus', 'Online', 'Hybrid', 'Distance Learning'],
      default: 'On-Campus',
    },
    intake: {
      type: Number,
      default: 60,
    },
    posterImage: {
      type: String,
      default: '',
    },
    poster: {
      type: String,
      default: '',
    },
    featuredImage: {
      type: String,
      default: '',
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    bannerUrl: {
      type: String,
      default: '',
    },
    brochure: {
      type: String,
      default: '',
    },
    brochureUrl: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    galleryImages: [{ type: String }],
    order: {
      type: Number,
      default: 0,
    },
    curriculum: [
      {
        semester: { type: String },
        courses: [{ type: String }],
        description: { type: String, default: '' },
      },
    ],
    highlights: [{ type: String }],
    learningOutcomes: [{ type: String }],
    outcomes: [{ type: String }],
    careerOpportunities: [{ type: String }],
    skills: [{ type: String }],
    toolsLearned: [{ type: String }],
    placementStats: {
      highestPackage: { type: String, default: '' },
      averagePackage: { type: String, default: '' },
      placementRate: { type: String, default: '' },
      topRecruiters: [{ type: String }]
    },
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
    facultyMapping: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
    ],
    mentorMapping: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MentorProfile',
      }
    ],
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      keywords: { type: String, default: '' },
      canonicalUrl: { type: String, default: '' },
      ogTitle: { type: String, default: '' },
      ogDescription: { type: String, default: '' },
      ogImage: { type: String, default: '' }
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Archived', 'draft', 'published', 'archived'],
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
  
  // Normalize poster and thumbnail images
  const primaryImage = this.posterImage || this.poster || this.featuredImage || this.thumbnailUrl || '';
  if (primaryImage) {
    if (!this.posterImage) this.posterImage = primaryImage;
    if (!this.poster) this.poster = primaryImage;
    if (!this.featuredImage) this.featuredImage = primaryImage;
    if (!this.thumbnailUrl) this.thumbnailUrl = primaryImage;
  }
  
  // Normalize brochure
  const primaryBrochure = this.brochureUrl || this.brochure || '';
  if (primaryBrochure) {
    this.brochureUrl = primaryBrochure;
    this.brochure = primaryBrochure;
  }

  // Normalize outcomes and learningOutcomes
  if (this.outcomes && this.outcomes.length > 0 && (!this.learningOutcomes || this.learningOutcomes.length === 0)) {
    this.learningOutcomes = this.outcomes;
  } else if (this.learningOutcomes && this.learningOutcomes.length > 0 && (!this.outcomes || this.outcomes.length === 0)) {
    this.outcomes = this.learningOutcomes;
  }

  // Normalize pricing
  if (this.fees && (!this.pricing || !this.pricing.totalFee)) {
    this.pricing = { currency: 'INR', totalFee: this.fees, installmentAvailable: true };
  } else if (this.pricing?.totalFee && !this.fees) {
    this.fees = this.pricing.totalFee;
  }

  // Normalize status and isActive
  const normalizedStatus = (this.status || 'Published').toLowerCase();
  this.isActive = normalizedStatus === 'published';
  this.status = normalizedStatus === 'published' ? 'Published' : (normalizedStatus === 'draft' ? 'Draft' : 'Archived');

  next();
});

programSchema.index({ category: 1 });
programSchema.index({ isActive: 1 });
programSchema.index({ isFeatured: 1 });
programSchema.index({ order: 1 });

export const Program = mongoose.models.Program || mongoose.model('Program', programSchema);
export default Program;
