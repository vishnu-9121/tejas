import api from "../utils/api";

export const inquiriesService = {
  submitInquiry: async (inquiryData) => {
    const response = await api.post("/inquiries", inquiryData);
    return response.data;
  },

  getInquiries: async (page = 1, limit = 10, status = "") => {
    const response = await api.get(`/inquiries?page=${page}&limit=${limit}&status=${status}`);
    return response.data;
  },

  resolveInquiry: async (id, adminNotes) => {
    const response = await api.patch(`/inquiries/${id}/resolve`, { adminNotes });
    return response.data;
  },
};
