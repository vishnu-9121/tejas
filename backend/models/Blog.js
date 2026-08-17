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
    excerpt: {
      type: String,
      maxlength: 300,
    },
    content: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
      default: 'General'
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      keywords: { type: String },
    },
    published: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["Draft", "Published", "Archived"],
      default: "Published",
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
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
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

blogSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 160);
  }
  if (this.published === true && this.status !== 'Published') {
    this.status = 'Published';
  } else if (this.status === 'Published' && this.published !== true) {
    this.published = true;
  }
  next();
});

blogSchema.index({ title: "text", content: "text", tags: "text" });
blogSchema.index({ category: 1 });
blogSchema.index({ status: 1 });
blogSchema.index({ publishedAt: -1 });

export const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
export default Blog;
