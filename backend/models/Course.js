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

    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
    },
    credits: {
      type: Number,
      default: 3,
    },
    prerequisites: {
      type: String,
      default: ''
    },
    curriculum: [{
      moduleName: String,
      topics: [String]
    }],
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    }
  },
  {
    timestamps: true,
  }
);

courseSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

courseSchema.index({ category: 1 });
courseSchema.index({ status: 1 });
courseSchema.index({ level: 1 });

export const Course = mongoose.model('Course', courseSchema);
