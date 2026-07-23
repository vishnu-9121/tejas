import api from '../utils/api';

export const analyticsService = {
  // Legacy overview — backward compatible
  getOverview: async () => {
    const response = await api.get('/analytics/overview');
    return response.data;
  },

  // Full admin analytics
  getAdminAnalytics: async () => {
    const response = await api.get('/analytics/admin');
    return response.data;
  },

  // Faculty analytics
  getFacultyAnalytics: async () => {
    const response = await api.get('/analytics/faculty');
    return response.data;
  },

  // Management / Board analytics
  getManagementAnalytics: async () => {
    const response = await api.get('/analytics/management');
    return response.data;
  }
};
