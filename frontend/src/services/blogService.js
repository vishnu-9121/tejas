import api from '../utils/api';
import { sanityService } from './sanityService';

export const blogService = {
  getBlogs: async (params) => {
    try {
      const response = await api.get('/blogs', { params });
      if (response?.data?.data?.blogs?.length > 0 || (Array.isArray(response?.data?.data) && response?.data?.data?.length > 0)) {
        return response.data;
      }
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
      return response.data;
    } catch (err) {
      console.warn('[blogService] Express fetch error, trying Sanity CMS:', err.message);
      try {
        const sanityBlogs = await sanityService.getBlogs();
        return {
          success: true,
          data: {
            blogs: sanityBlogs || [],
            data: sanityBlogs || []
          }
        };
      } catch (sanityErr) {
        return { success: false, data: { blogs: [] } };
      }
    }
  },

  getAdminBlogs: async (params) => {
    const response = await api.get('/blogs/admin/all', { params });
    return response.data;
  },

  getBlogBySlug: async (slug) => {
    try {
      const response = await api.get(`/blogs/slug/${slug}`);
      if (response?.data?.data) {
        return response.data;
      }
    } catch (err) {
      console.warn('[blogService] Express fetch by slug error, trying Sanity:', err.message);
    }
    try {
      const sanityBlogs = await sanityService.getBlogs();
      const match = sanityBlogs?.find(b => b.slug === slug || b.slug?.current === slug);
      if (match) {
        return { success: true, data: match };
      }
    } catch (sanityErr) {
      console.warn('[blogService] Sanity fetch error:', sanityErr.message);
    }
    return { success: false, data: null };
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

export default blogService;
