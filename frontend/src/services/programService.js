import api from '../utils/api';

export const programService = {
  getPrograms: async (params) => {
    const response = await api.get('/programs', { params });
    return response.data;
  },

  getProgramBySlug: async (slug) => {
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
