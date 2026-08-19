import api from '../utils/api';
import { sanityService } from './sanityService';

export const cmsService = {
  /**
   * Fetch CMS Content by Key
   * @param {string} key - e.g. 'homepage', 'about', 'global_faqs', 'site_settings'
   * @param {string} status - 'PUBLISHED' or 'DRAFT'
   */
  getCmsData: async (key, status = 'PUBLISHED') => {
    const lowerKey = String(key).toLowerCase().trim();

    // In DRAFT mode (Admin Panel), always fetch the editable database record directly
    if (status === 'DRAFT') {
      const response = await api.get(`/cms/${lowerKey}?status=DRAFT`);
      return response.data;
    }

    // In PUBLISHED mode (Public Website), fetch from MongoDB CMS with Sanity integration
    try {
      const response = await api.get(`/cms/${lowerKey}?status=PUBLISHED`);
      if (response.data?.success && response.data?.data) {
        const entry = response.data.data;
        const liveData = (entry.publishedData && Object.keys(entry.publishedData).length > 0)
          ? entry.publishedData 
          : entry.data;

        if (liveData && Object.keys(liveData).length > 0) {
          return { success: true, data: { data: liveData, entry } };
        }
      }
    } catch (apiErr) {
      console.warn(`[cmsService] Express CMS API query for '${lowerKey}' failed, checking Sanity:`, apiErr.message);
    }

    // Sanity fallback for static content models
    try {
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
      } else if (lowerKey === 'site_settings' || lowerKey === 'settings') {
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
    } catch (sanityErr) {
      console.warn(`[cmsService] Sanity fetch error for '${lowerKey}':`, sanityErr.message);
    }

    // Final fallback to relative Express endpoint
    const finalRes = await api.get(`/cms/${lowerKey}?status=${status}`);
    return finalRes.data;
  },

  updateCmsData: async (key, data) => {
    const lowerKey = String(key).toLowerCase().trim();
    const response = await api.put(`/cms/${lowerKey}`, { data });
    return response.data;
  },

  publishCmsData: async (key, commitMessage = "Published live update") => {
    const lowerKey = String(key).toLowerCase().trim();
    const response = await api.post(`/cms/${lowerKey}/publish`, { commitMessage });
    return response.data;
  },

  getVersionHistory: async (key) => {
    const lowerKey = String(key).toLowerCase().trim();
    const response = await api.get(`/cms/${lowerKey}/versions`);
    return response.data;
  },

  rollbackCmsData: async (key, versionNumber) => {
    const lowerKey = String(key).toLowerCase().trim();
    const response = await api.post(`/cms/${lowerKey}/rollback`, { versionNumber });
    return response.data;
  },

  // Aliases for uppercase CMS naming
  getCMSData: async function(key, status = 'PUBLISHED') { return this.getCmsData(key, status); },
  updateCMSData: async function(key, data) { return this.updateCmsData(key, data); }
};

export default cmsService;
