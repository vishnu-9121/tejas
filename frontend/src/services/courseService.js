import api from '../utils/api';
import { sanityService } from './sanityService';

export const courseService = {
  getCourses: async (params) => {
    try {
      const response = await api.get('/courses', { params });
      if (response?.data?.data?.courses?.length > 0 || (Array.isArray(response?.data?.data) && response?.data?.data?.length > 0)) {
        return response.data;
      }
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
      return response.data;
    } catch (err) {
      console.warn('[courseService] Express fetch error, trying Sanity CMS:', err.message);
      try {
        const sanityCourses = await sanityService.getCourses();
        return {
          success: true,
          data: {
            courses: sanityCourses || [],
            data: sanityCourses || []
          }
        };
      } catch (sanityErr) {
        return { success: false, data: { courses: [] } };
      }
    }
  },

  getAdminCourses: async (params) => {
    const response = await api.get('/courses', { params });
    return response.data;
  },

  getCourseBySlug: async (slug) => {
    try {
      const response = await api.get(`/courses/slug/${slug}`);
      if (response?.data?.data) {
        return response.data;
      }
    } catch (err) {
      console.warn('[courseService] Express fetch by slug error, trying Sanity:', err.message);
    }
    try {
      const sanityCourses = await sanityService.getCourses();
      const match = sanityCourses?.find(c => c.slug === slug || c.slug?.current === slug);
      if (match) {
        return { success: true, data: match };
      }
    } catch (sanityErr) {
      console.warn('[courseService] Sanity fetch error:', sanityErr.message);
    }
    return { success: false, data: null };
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

export default courseService;
