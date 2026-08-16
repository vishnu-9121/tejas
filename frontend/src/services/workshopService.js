import api from '../utils/api';
import { sanityService } from './sanityService';

export const workshopService = {
  getWorkshops: async (params) => {
    try {
      const response = await api.get('/workshops', { params });
      if (response?.data?.data?.workshops?.length > 0 || (Array.isArray(response?.data?.data) && response?.data?.data?.length > 0)) {
        return response.data;
      }
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
      return response.data;
    } catch (err) {
      console.warn('[workshopService] Express fetch error, trying Sanity CMS:', err.message);
      try {
        const sanityWorkshops = await sanityService.getWorkshops();
        return {
          success: true,
          data: {
            workshops: sanityWorkshops || [],
            data: sanityWorkshops || []
          }
        };
      } catch (sanityErr) {
        return { success: false, data: { workshops: [] } };
      }
    }
  },

  getAdminWorkshops: async (params) => {
    const response = await api.get('/workshops', { params });
    return response.data;
  },

  getWorkshopBySlug: async (slug) => {
    try {
      const response = await api.get(`/workshops/${slug}`);
      if (response?.data?.data) {
        return response.data;
      }
    } catch (err) {
      console.warn('[workshopService] Express fetch by slug error, trying Sanity:', err.message);
    }
    try {
      const sanityWorkshops = await sanityService.getWorkshops();
      const match = sanityWorkshops?.find(w => w.slug === slug || w.slug?.current === slug);
      if (match) {
        return { success: true, data: match };
      }
    } catch (sanityErr) {
      console.warn('[workshopService] Sanity fetch error:', sanityErr.message);
    }
    return { success: false, data: null };
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

export default workshopService;
