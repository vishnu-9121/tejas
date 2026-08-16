import api from '../utils/api';
import { sanityService } from './sanityService';

export const eventService = {
  getEvents: async (params) => {
    try {
      const response = await api.get('/events', { params });
      if (response?.data?.data?.events?.length > 0 || (Array.isArray(response?.data?.data) && response?.data?.data?.length > 0)) {
        return response.data;
      }
      const sanityEvents = await sanityService.getEvents();
      if (sanityEvents && sanityEvents.length > 0) {
        return {
          success: true,
          data: {
            events: sanityEvents,
            data: sanityEvents
          }
        };
      }
      return response.data;
    } catch (err) {
      console.warn('[eventService] Express fetch error, trying Sanity CMS:', err.message);
      try {
        const sanityEvents = await sanityService.getEvents();
        return {
          success: true,
          data: {
            events: sanityEvents || [],
            data: sanityEvents || []
          }
        };
      } catch (sanityErr) {
        return { success: false, data: { events: [] } };
      }
    }
  },

  getAdminEvents: async (params) => {
    const response = await api.get('/events', { params });
    return response.data;
  },

  getEventBySlug: async (slug) => {
    try {
      const response = await api.get(`/events/slug/${slug}`);
      if (response?.data?.data) {
        return response.data;
      }
    } catch (err) {
      console.warn('[eventService] Express fetch by slug error, trying Sanity:', err.message);
    }
    try {
      const sanityEvents = await sanityService.getEvents();
      const match = sanityEvents?.find(e => e.slug === slug || e.slug?.current === slug);
      if (match) {
        return { success: true, data: match };
      }
    } catch (sanityErr) {
      console.warn('[eventService] Sanity fetch error:', sanityErr.message);
    }
    return { success: false, data: null };
  },

  getEventById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  toggleStatus: async (id) => {
    const response = await api.patch(`/events/${id}/status`);
    return response.data;
  }
};

export default eventService;
