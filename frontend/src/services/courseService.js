import api from '../utils/api';
import { sanityService } from './sanityService';

export const courseService = {
  getCourses: async (params) => {
    try {
      const sanityCourses = await sanityService.getCourses();
      if (sanityCourses && sanityCourses.length > 0) {
        return {
          success: true,
          data: {
            courses: sanityCourses,
            data: sanityCourses
          }
        };
      }
    } catch (err) {
      console.warn('[courseService] Sanity fetch error, falling back to Express API:', err.message);
    }
    const response = await api.get('/courses', { params });
    return response.data;
  },

  getCourseBySlug: async (slug) => {
    try {
      const sanityCourses = await sanityService.getCourses();
      const match = sanityCourses?.find(c => c.slug === slug || c.slug?.current === slug);
      if (match) {
        return { success: true, data: match };
      }
    } catch (err) {
      console.warn('[courseService] Sanity fetch error, falling back to Express API:', err.message);
    }
    const response = await api.get(`/courses/slug/${slug}`);
    return response.data;
  },

  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  createCourse: async (courseData) => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  updateCourse: async (id, courseData) => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  },

  deleteCourse: async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },

  toggleStatus: async (id, status) => {
    const response = await api.patch(`/courses/${id}/status`, { status });
    return response.data;
  }
};
