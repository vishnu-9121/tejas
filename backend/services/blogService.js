import Blog from "../models/Blog.js";
import { AppError } from "../middlewares/errorHandler.js";
import { HTTP_STATUS } from "../constants/index.js";

export const createBlog = async (data, authorId) => {
  const blog = await Blog.create({ ...data, author: authorId });
  return blog;
};

export const getAllBlogs = async (page = 1, limit = 9, search, status) => {
  const query = {};
  if (status) query.status = status;
  
  // Full text search if search term provided
  if (search) {
    query.$text = { $search: search };
  }

  const skip = (page - 1) * limit;
  const total = await Blog.countDocuments(query);
  
  const blogs = await Blog.find(query)
    .populate("author", "firstName lastName")
    .sort(search ? { score: { $meta: "textScore" } } : { createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    blogs,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getBlogBySlug = async (slug) => {
  const blog = await Blog.findOneAndUpdate(
    { slug, status: "Published" },
    { $inc: { views: 1 } },
  ).populate("author", "firstName lastName")
   .populate("relatedBlogs", "title slug coverImage category");

  if (!blog) {
    throw new AppError("Blog not found", HTTP_STATUS.NOT_FOUND);
  }

  return blog;
};

export const getBlogById = async (id) => {
  const blog = await Blog.findById(id)
    .populate("author", "firstName lastName")
    .populate("relatedBlogs", "title slug coverImage category");
  if (!blog) throw new AppError("Blog not found", HTTP_STATUS.NOT_FOUND);
  return blog;
};

export const updateBlog = async (id, data) => {
  if (data.status === 'Published' && !data.publishedAt) {
    data.publishedAt = Date.now();
  }
  const blog = await Blog.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!blog) throw new AppError("Blog not found", HTTP_STATUS.NOT_FOUND);
  return blog;
};

export const deleteBlog = async (id) => {
  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) throw new AppError("Blog not found", HTTP_STATUS.NOT_FOUND);
  return blog;
};
