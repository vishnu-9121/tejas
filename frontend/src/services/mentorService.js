import api from '../utils/api';
import { sanityService } from './sanityService';

export const mentorService = {
  getMentors: async (params) => {
    try {
      const response = await api.get('/mentors', { params });
      if (response?.data?.data?.mentors?.length > 0 || (Array.isArray(response?.data?.data) && response?.data?.data?.length > 0)) {
        return response.data;
      }
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
      return response.data;
    } catch (err) {
      console.warn('[mentorService] Express fetch error, trying Sanity CMS:', err.message);
      try {
        const sanityMentors = await sanityService.getMentors();
        return {
          success: true,
          data: {
            mentors: sanityMentors || [],
            data: sanityMentors || []
          }
        };
      } catch (sanityErr) {
        return { success: false, data: { mentors: [] } };
      }
    }
  },

  getAdminMentors: async (params) => {
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

export default mentorService;
