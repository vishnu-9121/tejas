import api from '../utils/api';
import { sanityService } from './sanityService';

export const testimonialService = {
  getTestimonials: async (params) => {
    try {
      const response = await api.get('/testimonials', { params });
      if (response?.data?.data?.testimonials?.length > 0 || (Array.isArray(response?.data?.data) && response?.data?.data?.length > 0)) {
        return response.data;
      }
      const sanityTestimonials = await sanityService.getTestimonials();
      if (sanityTestimonials && sanityTestimonials.length > 0) {
        return {
          success: true,
          data: {
            testimonials: sanityTestimonials,
            data: sanityTestimonials
          }
        };
      }
      return response.data;
    } catch (err) {
      console.warn('[testimonialService] Express fetch error, trying Sanity CMS:', err.message);
      try {
        const sanityTestimonials = await sanityService.getTestimonials();
        return {
          success: true,
          data: {
            testimonials: sanityTestimonials || [],
            data: sanityTestimonials || []
          }
        };
      } catch (sanityErr) {
        return { success: false, data: { testimonials: [] } };
      }
    }
  },

  getAdminTestimonials: async (params) => {
    const response = await api.get('/testimonials/admin', { params });
    return response.data;
  },

  getTestimonialById: async (id) => {
    const response = await api.get(`/testimonials/${id}`);
    return response.data;
  },

  submitReview: async (data) => {
    const response = await api.post('/testimonials/submit', data);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/testimonials/${id}/status`, { status });
    return response.data;
  },

  createTestimonial: async (data) => {
    const response = await api.post('/testimonials', data);
    return response.data;
  },

  updateTestimonial: async (id, data) => {
    const response = await api.put(`/testimonials/${id}`, data);
    return response.data;
  },

  deleteTestimonial: async (id) => {
    const response = await api.delete(`/testimonials/${id}`);
    return response.data;
  }
};

export default testimonialService;
