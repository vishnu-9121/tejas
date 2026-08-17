import mongoose from 'mongoose';
import slugify from 'slugify';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
    },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
    },
    category: {
      type: String,
      required: true,
      default: 'General'
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0
    },
    credits: {
      type: Number,
      default: 3,
    },
    order: {
      type: Number,
      default: 0,
    },
    learningOutcomes: [{
      type: String
    }],
    resources: [{
      title: String,
      url: String,
      type: { type: String, enum: ['pdf', 'video', 'link'], default: 'pdf' }
    }],
    modules: [{
      moduleName: String,
      duration: String,
      topics: [String]
    }],
    curriculum: [{
      moduleName: String,
      topics: [String]
    }],
    prerequisites: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published'
    }
  },
  {
    timestamps: true,
  }
);

courseSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.program && !this.programId) this.programId = this.program;
  if (this.programId && !this.program) this.program = this.programId;
  if (this.modules && (!this.curriculum || this.curriculum.length === 0)) {
    this.curriculum = this.modules;
  } else if (this.curriculum && (!this.modules || this.modules.length === 0)) {
    this.modules = this.curriculum;
  }
  next();
});

courseSchema.index({ program: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ status: 1 });

export const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
export default Course;
