import api from '../utils/api';

export const studentService = {
  // Get all students with pagination and filters
  getStudents: async (params) => {
    const response = await api.get('/students', { params });
    return response.data;
  },

  // Get single student by ID
  getStudentById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  // Create a new student
  createStudent: async (studentData) => {
    const response = await api.post('/students', studentData);
    return response.data;
  },

  // Update a student
  updateStudent: async (id, studentData) => {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
  },

  // Delete a student
  deleteStudent: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },

  // Add a timeline event to a student
  addTimelineEvent: async (id, eventData) => {
    const response = await api.post(`/students/${id}/timeline`, eventData);
    return response.data;
  }
};
