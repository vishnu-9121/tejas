import api from '../utils/api';
import { sanityService } from './sanityService';

export const programService = {
  getPrograms: async (params) => {
    try {
      const sanityPrograms = await sanityService.getPrograms();
      if (sanityPrograms && sanityPrograms.length > 0) {
        return {
          success: true,
          data: {
            programs: sanityPrograms,
            data: sanityPrograms,
            pagination: {
              total: sanityPrograms.length,
              page: 1,
              pages: 1
            }
          }
        };
      }
    } catch (err) {
      console.warn('[programService] Sanity fetch error, falling back to Express API:', err.message);
    }
    const response = await api.get('/programs', { params });
    return response.data;
  },

  getProgramBySlug: async (slug) => {
    try {
      const sanityPrograms = await sanityService.getPrograms();
      const match = sanityPrograms?.find(p => p.slug === slug || p.slug?.current === slug);
      if (match) {
        return { success: true, data: match };
      }
    } catch (err) {
      console.warn('[programService] Sanity fetch error, falling back to Express API:', err.message);
    }
    const response = await api.get(`/programs/${slug}`);
    return response.data;
  },

  getProgramById: async (id) => {
    const response = await api.get(`/programs/id/${id}`);
    return response.data;
  },

  createProgram: async (programData) => {
    const response = await api.post('/programs', programData);
    return response.data;
  },

  updateProgram: async (id, programData) => {
    const response = await api.put(`/programs/${id}`, programData);
    return response.data;
  },

  deleteProgram: async (id) => {
    const response = await api.delete(`/programs/${id}`);
    return response.data;
  },

  toggleArchive: async (id) => {
    const response = await api.patch(`/programs/${id}/archive`);
    return response.data;
  },

  toggleFeature: async (id) => {
    const response = await api.patch(`/programs/${id}/feature`);
    return response.data;
  }
};
