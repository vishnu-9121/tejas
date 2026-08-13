import api from '../utils/api';
import { sanityService } from './sanityService';

export const mentorService = {
  getMentors: async (params) => {
    try {
      const sanityMentors = await sanityService.getMentors();
      if (sanityMentors && sanityMentors.length > 0) {
        return {
          success: true,
          data: {
            mentors: sanityMentors,
            data: sanityMentors
          }
        };
      }
    } catch (err) {
      console.warn('[mentorService] Sanity fetch error, falling back to Express API:', err.message);
    }
    const response = await api.get('/mentors', { params });
    return response.data;
  },

  getMentorById: async (id) => {
    const response = await api.get(`/mentors/${id}`);
    return response.data;
  },

  createMentor: async (mentorData) => {
    const response = await api.post('/mentors', mentorData);
    return response.data;
  },

  updateMentor: async (id, mentorData) => {
    const response = await api.put(`/mentors/${id}`, mentorData);
    return response.data;
  },

  deleteMentor: async (id) => {
    const response = await api.delete(`/mentors/${id}`);
    return response.data;
  },

  toggleFeature: async (id) => {
    const response = await api.patch(`/mentors/${id}/feature`);
    return response.data;
  }
};
