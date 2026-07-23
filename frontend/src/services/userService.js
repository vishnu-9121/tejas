import api from '../utils/api';

export const userService = {
  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/users/me', data);
    return response.data;
  },

  toggleSaveProgram: async (programId) => {
    const response = await api.post('/users/me/save-program', { programId });
    return response.data;
  },

  toggleBookmarkEvent: async (eventId) => {
    const response = await api.post('/users/me/bookmark-event', { eventId });
    return response.data;
  },

  getUsers: async (params) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  createUser: async (data) => {
    const response = await api.post('/users', data);
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await api.put(`/users/${userId}/role`, { role });
    return response.data;
  }
};
