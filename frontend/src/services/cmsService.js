import api from '../utils/api';
import { sanityService } from './sanityService';

export const cmsService = {
  // Complete delegation to Sanity GROQ query fetchers with Express MongoDB fallback
  getCmsData: async (key, status = 'PUBLISHED') => {
    try {
      const lowerKey = String(key).toLowerCase();

      if (lowerKey === 'about') {
        const data = await sanityService.getAboutPage();
        if (data) return { success: true, data: { data: { overview: data, timeline: data.timeline || [] } } };
      } else if (lowerKey === 'homepage') {
        const data = await sanityService.getHomepage();
        if (data) return { success: true, data: { data } };
      } else if (lowerKey === 'contact') {
        const data = await sanityService.getContactPage();
        if (data) return { success: true, data: { data } };
      } else if (lowerKey === 'navigation') {
        const data = await sanityService.getNavigation();
        if (data) return { success: true, data: { data } };
      } else if (lowerKey === 'footer') {
        const data = await sanityService.getFooter();
        if (data) return { success: true, data: { data } };
      } else if (lowerKey === 'site_settings') {
        const data = await sanityService.getSiteSettings();
        if (data) return { success: true, data: { data } };
      } else if (lowerKey === 'global_faqs' || lowerKey === 'faqs' || lowerKey === 'faq') {
        const data = await sanityService.getFaqs();
        if (data) return { success: true, data: { data } };
      } else if (lowerKey === 'global_exit_intent' || lowerKey === 'popup_modals' || lowerKey === 'popups') {
        const data = await sanityService.getPopupModals();
        if (data) return { success: true, data: { data } };
      } else if (lowerKey === 'programs' || lowerKey === 'academics') {
        const data = await sanityService.getPrograms();
        if (data) return { success: true, data: { data: { programs: data } } };
      } else if (lowerKey === 'events') {
        const data = await sanityService.getEvents();
        if (data) return { success: true, data: { data } };
      } else if (lowerKey === 'blogs' || lowerKey === 'blog' || lowerKey === 'news') {
        const data = await sanityService.getBlogs();
        if (data) return { success: true, data: { data } };
      } else if (lowerKey === 'gallery' || lowerKey === 'campus') {
        const data = await sanityService.getGallery();
        if (data) return { success: true, data: { data } };
      } else if (lowerKey === 'testimonials') {
        const data = await sanityService.getTestimonials();
        if (data) return { success: true, data: { data } };
      } else if (lowerKey === 'faculty' || lowerKey === 'mentors' || lowerKey === 'team') {
        const data = await sanityService.getMentors();
        if (data) return { success: true, data: { data } };
      } else if (lowerKey === 'collaborations' || lowerKey === 'recruiters' || lowerKey === 'partners') {
        const data = await sanityService.getCollaborations();
        if (data) return { success: true, data: { data } };
      } else if (lowerKey === 'recognitions' || lowerKey === 'awards') {
        const data = await sanityService.getRecognitions();
        if (data) return { success: true, data: { data } };
      } else if (lowerKey === 'free_programs' || lowerKey === 'workshops') {
        const data = await sanityService.getFreePrograms();
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
