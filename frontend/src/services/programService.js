import api from '../utils/api';
import { sanityService } from './sanityService';

export const programService = {
  // Public user facing programs list (combines / fallbacks smoothly)
  getPrograms: async (params = {}) => {
    try {
      const response = await api.get('/programs', { params });
      if (response?.data?.data?.programs?.length > 0) {
        return response.data;
      }
      
      const sanityPrograms = await sanityService.getPrograms();
      if (sanityPrograms && sanityPrograms.length > 0) {
        return {
          success: true,
          data: {
            programs: sanityPrograms,
            data: sanityPrograms,
            pagination: {
              total: sanityPrograms.length,
              page: 1,
              pages: 1
            }
          }
        };
      }
      return response.data;
    } catch (err) {
      console.warn('[programService] Express fetch error, trying Sanity CMS:', err.message);
      try {
        const sanityPrograms = await sanityService.getPrograms();
        return {
          success: true,
          data: {
            programs: sanityPrograms || [],
            data: sanityPrograms || [],
            pagination: {
              total: sanityPrograms?.length || 0,
              page: 1,
              pages: 1
            }
          }
        };
      } catch (sanityErr) {
        return { success: false, data: { programs: [] } };
      }
    }
  },

  // Admin dedicated programs fetcher
  getAdminPrograms: async (params) => {
    const response = await api.get('/programs', { params });
    return response.data;
  },

  getProgramBySlug: async (slug) => {
    try {
      const response = await api.get(`/programs/${slug}`);
      if (response?.data?.data) {
        return response.data;
      }
    } catch (err) {
      console.warn('[programService] Backend fetch by slug error, trying Sanity:', err.message);
    }

    try {
      const sanityPrograms = await sanityService.getPrograms();
      const match = sanityPrograms?.find(p => p.slug === slug || p.slug?.current === slug);
      if (match) {
        return { success: true, data: match };
      }
    } catch (sanityErr) {
      console.warn('[programService] Sanity fetch error:', sanityErr.message);
    }

    return { success: false, data: null };
  },

  getProgramById: async (id) => {
    const response = await api.get(`/programs/id/${id}`);
    return response.data;
  },

  createProgram: async (programData) => {
    const response = await api.post('/programs', programData);
    return response.data;
  },

  updateProgram: async (id, programData) => {
    const response = await api.put(`/programs/${id}`, programData);
    return response.data;
  },

  deleteProgram: async (id) => {
    const response = await api.delete(`/programs/${id}`);
    return response.data;
  },

  toggleArchive: async (id) => {
    const response = await api.patch(`/programs/${id}/archive`);
    return response.data;
  },

  toggleFeature: async (id) => {
    const response = await api.patch(`/programs/${id}/feature`);
    return response.data;
  },

  downloadBrochure: async ({ programId, slug, programTitle, downloadType = 'brochure' } = {}) => {
    const target = slug || programId || 'default';
    const response = await api.get(`/programs/${target}/download-${downloadType}`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf'
      }
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeTitle = (programTitle || 'Program').replace(/[^a-zA-Z0-9]/g, '_');
    link.download = `${safeTitle}_${downloadType === 'curriculum' ? 'Curriculum' : 'Brochure'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return {
      success: true,
      downloaded: true
    };
  }
};

export default programService;
