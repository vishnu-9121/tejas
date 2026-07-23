import api from '../utils/api';

export const facultyService = {
  getFaculty: async (params) => {
    const response = await api.get('/faculty', { params });
    return response.data;
  },

  getFacultyById: async (id) => {
    const response = await api.get(`/faculty/${id}`);
    return response.data;
  },

  createFaculty: async (facultyData) => {
    const response = await api.post('/faculty', facultyData);
    return response.data;
  },

  updateFaculty: async (id, facultyData) => {
    const response = await api.put(`/faculty/${id}`, facultyData);
    return response.data;
  },

  deleteFaculty: async (id) => {
    const response = await api.delete(`/faculty/${id}`);
    return response.data;
  },

  toggleFeature: async (id) => {
    const response = await api.patch(`/faculty/${id}/feature`);
    return response.data;
  }
};
