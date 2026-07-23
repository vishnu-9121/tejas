import api from '../utils/api';

export const admissionService = {
  // Get admissions with pagination and filters
  getAdmissions: async (params) => {
    const response = await api.get('/admissions', { params });
    return response.data;
  },

  // Get admission stats
  getStats: async () => {
    const response = await api.get('/admissions/stats');
    return response.data;
  },

  // Get single admission by ID
  getAdmissionById: async (id) => {
    const response = await api.get(`/admissions/${id}`);
    return response.data;
  },

  // Update admission status
  updateStatus: async (id, status) => {
    const response = await api.put(`/admissions/${id}/status`, { status });
    return response.data;
  },

  // Get my applications (Student perspective)
  getMyApplications: async () => {
    const response = await api.get('/admissions/my-applications');
    return response.data;
  },

  // Submit a new application
  submitApplication: async (applicationData) => {
    const response = await api.post('/admissions', applicationData);
    return response.data;
  }
};
