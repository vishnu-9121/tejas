import mongoose from "mongoose";
import slugify from "slugify";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true, // Markdown or HTML string
    },
    excerpt: {
      type: String,
      maxlength: 300,
    },
    category: {
      type: String,
      required: true,
      default: 'General'
    },
    coverImage: {
      type: String, // Cloudinary URL
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    relatedBlogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      }
    ],
    readingTime: {
      type: Number,
      default: 5,
    },
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      keywords: { type: String },
    },
    status: {
      type: String,
      enum: ["Draft", "Published", "Archived"],
      default: "Draft",
    },
    views: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Create text index for search
blogSchema.index({ title: "text", content: "text", tags: "text" });
blogSchema.index({ category: 1 });
blogSchema.index({ status: 1 });

blogSchema.pre('save', function (next) {
  if (!this.isModified('title')) {
    return next();
  }
  this.slug = slugify(this.title, { lower: true, strict: true });
  next();
});

export default mongoose.model("Blog", blogSchema);
