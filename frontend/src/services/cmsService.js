import api from '../utils/api';
import { sanityService } from './sanityService';

export const cmsService = {
  // Direct delegation to Sanity GROQ query fetcher with Express MongoDB fallback
  getCmsData: async (key, status = 'PUBLISHED') => {
    try {
      if (key === 'about') {
        const data = await sanityService.getAboutPage();
        if (data) return { success: true, data: { data: { overview: data, timeline: data.timeline || [] } } };
      } else if (key === 'homepage') {
        const data = await sanityService.getHomepage();
        if (data) return { success: true, data: { data } };
      } else if (key === 'contact') {
        const data = await sanityService.getContactPage();
        if (data) return { success: true, data: { data } };
      } else if (key === 'navigation') {
        const data = await sanityService.getNavigation();
        if (data) return { success: true, data: { data } };
      } else if (key === 'footer') {
        const data = await sanityService.getFooter();
        if (data) return { success: true, data: { data } };
      } else if (key === 'site_settings') {
        const data = await sanityService.getSiteSettings();
        if (data) return { success: true, data: { data } };
      } else if (key === 'global_faqs') {
        const data = await sanityService.getFaqs();
        if (data) return { success: true, data: { data } };
      } else if (key === 'global_exit_intent') {
        const data = await sanityService.getPopupModals();
        if (data) return { success: true, data: { data } };
      }
    } catch (err) {
      console.warn('[cmsService] Sanity resolution failed, trying Express DB:', err.message);
    }

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
