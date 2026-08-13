import api from '../utils/api';
import { sanityService } from './sanityService';

export const workshopService = {
  getWorkshops: async (params) => {
    try {
      const sanityWorkshops = await sanityService.getWorkshops();
      if (sanityWorkshops && sanityWorkshops.length > 0) {
        return {
          success: true,
          data: {
            workshops: sanityWorkshops,
            data: sanityWorkshops
          }
        };
      }
    } catch (err) {
      console.warn('[workshopService] Sanity fetch error, falling back to Express API:', err.message);
    }
    const response = await api.get('/workshops', { params });
    return response.data;
  },

  getWorkshopBySlug: async (slug) => {
    try {
      const sanityWorkshops = await sanityService.getWorkshops();
      const match = sanityWorkshops?.find(w => w.slug === slug || w.slug?.current === slug);
      if (match) {
        return { success: true, data: match };
      }
    } catch (err) {
      console.warn('[workshopService] Sanity fetch error, falling back to Express API:', err.message);
    }
    const response = await api.get(`/workshops/${slug}`);
    return response.data;
  },

  getWorkshopById: async (id) => {
    const response = await api.get(`/workshops/${id}`);
    return response.data;
  },

  createWorkshop: async (workshopData) => {
    const response = await api.post('/workshops', workshopData);
    return response.data;
  },

  updateWorkshop: async (id, workshopData) => {
    const response = await api.put(`/workshops/${id}`, workshopData);
    return response.data;
  },

  deleteWorkshop: async (id) => {
    const response = await api.delete(`/workshops/${id}`);
    return response.data;
  },

  toggleStatus: async (id, status) => {
    const response = await api.patch(`/workshops/${id}/status`, { status });
    return response.data;
  }
};
