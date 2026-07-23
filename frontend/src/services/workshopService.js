import api from '../utils/api';

export const workshopService = {
  getWorkshops: async (params) => {
    const response = await api.get('/workshops', { params });
    return response.data;
  },

  getWorkshopBySlug: async (slug) => {
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
