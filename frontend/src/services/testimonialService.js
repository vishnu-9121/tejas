import api from '../utils/api';
import { sanityService } from './sanityService';

export const testimonialService = {
  getTestimonials: async (params) => {
    try {
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
    } catch (err) {
      console.warn('[testimonialService] Sanity fetch error, falling back to Express API:', err.message);
    }
    const response = await api.get('/testimonials', { params });
    return response.data;
  },

  getTestimonialById: async (id) => {
    const response = await api.get(`/testimonials/${id}`);
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
