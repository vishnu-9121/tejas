import api from '../utils/api';

export const galleryService = {
  getGallery: async (params) => {
    const response = await api.get('/gallery', { params });
    return response.data;
  },

  getGalleryById: async (id) => {
    const response = await api.get(`/gallery/${id}`);
    return response.data;
  },

  addGalleryImage: async (data) => {
    const response = await api.post('/gallery', data);
    return response.data;
  },

  updateGalleryImage: async (id, data) => {
    const response = await api.put(`/gallery/${id}`, data);
    return response.data;
  },

  deleteGalleryImage: async (id) => {
    const response = await api.delete(`/gallery/${id}`);
    return response.data;
  }
};
