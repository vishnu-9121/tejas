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
  }
};
