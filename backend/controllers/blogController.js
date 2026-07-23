import * as blogService from '../services/blogService.js';
import { sendResponse } from '../helpers/responseFormatter.js';
import { HTTP_STATUS } from '../constants/index.js';

export const getBlogs = async (req, res, next) => {
  try {
    const { page, limit, search, status } = req.query;
    // Admins can see all statuses, public users only see published
    const userRole = req.user?.role;
    const finalStatus = (userRole === 'admin' || userRole === 'super_admin') ? status : 'Published';
    
    const data = await blogService.getAllBlogs(page, limit, search, finalStatus);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await blogService.getBlogBySlug(req.params.slug);
    sendResponse(res, HTTP_STATUS.OK, 'Blog fetched successfully', blog);
  } catch (error) {
    next(error);
  }
};

export const getBlogById = async (req, res, next) => {
  try {
    const blog = await blogService.getBlogById(req.params.id);
    sendResponse(res, HTTP_STATUS.OK, 'Blog fetched successfully', blog);
  } catch (error) {
    next(error);
  }
};

export const createBlog = async (req, res, next) => {
  try {
    const blog = await blogService.createBlog(req.body, req.user._id);
    sendResponse(res, HTTP_STATUS.CREATED, 'Blog created successfully', blog);
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const blog = await blogService.updateBlog(req.params.id, req.body);
    sendResponse(res, HTTP_STATUS.OK, 'Blog updated successfully', blog);
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    await blogService.deleteBlog(req.params.id);
    sendResponse(res, HTTP_STATUS.OK, 'Blog deleted successfully', null);
  } catch (error) {
    next(error);
  }
};
