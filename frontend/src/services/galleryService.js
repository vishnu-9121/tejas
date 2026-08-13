import api from '../utils/api';
import { sanityService } from './sanityService';

export const galleryService = {
  getGallery: async (params) => {
    try {
      const sanityGallery = await sanityService.getGallery();
      if (sanityGallery && sanityGallery.length > 0) {
        return {
          success: true,
          data: {
            gallery: sanityGallery,
            data: sanityGallery
          }
        };
      }
    } catch (err) {
      console.warn('[galleryService] Sanity fetch error, falling back to Express API:', err.message);
    }
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
