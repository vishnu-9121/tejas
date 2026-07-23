import api from '../utils/api';

export const courseService = {
  getCourses: async (params) => {
    const response = await api.get('/courses', { params });
    return response.data;
  },

  getCourseBySlug: async (slug) => {
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
