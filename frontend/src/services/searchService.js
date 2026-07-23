import api from '../utils/api';

export const searchService = {
  search: async (query, category = 'all', limit = 5) => {
    const response = await api.post('/search', { q: query, category, limit });
    return response.data;
  },

  getSuggestions: async () => {
    const response = await api.get('/search/suggestions');
    return response.data;
  }
};
