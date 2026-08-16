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

  // Update admission status and notes
  updateStatus: async (id, payload) => {
    const data = typeof payload === 'string' ? { status: payload } : payload;
    const response = await api.put(`/admissions/${id}/status`, data);
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
  },

  // Download Excel Export directly from backend
  downloadExcelExport: async (params = {}) => {
    const response = await api.get('/admissions/export/excel', {
      params,
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tejas_admissions_${new Date().toISOString().split('T')[0]}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }
};
