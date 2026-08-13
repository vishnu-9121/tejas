import api from '../utils/api';
import { sanityService } from './sanityService';

export const blogService = {
  getBlogs: async (params) => {
    try {
      const sanityBlogs = await sanityService.getBlogs();
      if (sanityBlogs && sanityBlogs.length > 0) {
        return {
          success: true,
          data: {
            blogs: sanityBlogs,
            data: sanityBlogs
          }
        };
      }
    } catch (err) {
      console.warn('[blogService] Sanity fetch error, falling back to Express API:', err.message);
    }
    const response = await api.get('/blogs', { params });
    return response.data;
  },

  getAdminBlogs: async (params) => {
    const response = await api.get('/blogs/admin/all', { params });
    return response.data;
  },

  getBlogBySlug: async (slug) => {
    try {
      const sanityBlogs = await sanityService.getBlogs();
      const match = sanityBlogs?.find(b => b.slug === slug || b.slug?.current === slug);
      if (match) {
        return { success: true, data: match };
      }
    } catch (err) {
      console.warn('[blogService] Sanity fetch error, falling back to Express API:', err.message);
    }
    const response = await api.get(`/blogs/slug/${slug}`);
    return response.data;
  },

  getBlogById: async (id) => {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },

  createBlog: async (data) => {
    const response = await api.post('/blogs', data);
    return response.data;
  },

  updateBlog: async (id, data) => {
    const response = await api.put(`/blogs/${id}`, data);
    return response.data;
  },

  deleteBlog: async (id) => {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  }
};
