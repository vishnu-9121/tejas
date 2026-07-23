import api from '../utils/api';

export const cmsService = {
  // Pass ?status=DRAFT if fetching in admin, defaults to PUBLISHED in backend
  getCmsData: async (key, status = 'PUBLISHED') => {
    const response = await api.get(`/cms/${key}?status=${status}`);
    return response.data;
  },

  updateCmsData: async (key, data) => {
    const response = await api.put(`/cms/${key}`, { data });
    return response.data;
  },

  publishCmsData: async (key, commitMessage = "Published changes") => {
    const response = await api.post(`/cms/${key}/publish`, { commitMessage });
    return response.data;
  },

  getVersionHistory: async (key) => {
    const response = await api.get(`/cms/${key}/versions`);
    return response.data;
  },

  rollbackCmsData: async (key, versionNumber) => {
    const response = await api.post(`/cms/${key}/rollback`, { versionNumber });
    return response.data;
  },

  // Aliases for components that use capitalized CMS
  getCMSData: async function(key, status = 'PUBLISHED') { return this.getCmsData(key, status); },
  updateCMSData: async function(key, data) { return this.updateCmsData(key, data); }
};
