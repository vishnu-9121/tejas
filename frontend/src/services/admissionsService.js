import api from "../utils/api";

export const admissionsService = {
  submitApplication: async (applicationData) => {
    const response = await api.post("/admissions/apply", applicationData);
    return response.data;
  },

  getApplications: async (page = 1, limit = 10, status = "") => {
    const response = await api.get(`/admissions?page=${page}&limit=${limit}&status=${status}`);
    return response.data;
  },

  updateStatus: async (id, status, reviewerComments) => {
    const response = await api.patch(`/admissions/${id}/status`, { status, reviewerComments });
    return response.data;
  },
};
