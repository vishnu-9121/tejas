import api from '../utils/api';

export const blogService = {
  getBlogs: async (params) => {
    // If we want all blogs for admin, we hit /blogs/admin/all
    // For now we'll assume we pass an admin flag or just hit the admin endpoint if logged in.
    // Actually, it's safer to have getAdminBlogs
    const response = await api.get('/blogs', { params });
    return response.data;
  },

  getAdminBlogs: async (params) => {
    const response = await api.get('/blogs/admin/all', { params });
    return response.data;
  },

  getBlogBySlug: async (slug) => {
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
