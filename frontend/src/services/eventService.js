import api from '../utils/api';
import { sanityService } from './sanityService';

export const eventService = {
  getEvents: async (params) => {
    try {
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
    } catch (err) {
      console.warn('[eventService] Sanity fetch error, falling back to Express API:', err.message);
    }
    const response = await api.get('/events', { params });
    return response.data;
  },

  getEventBySlug: async (slug) => {
    try {
      const sanityEvents = await sanityService.getEvents();
      const match = sanityEvents?.find(e => e.slug === slug || e.slug?.current === slug);
      if (match) {
        return { success: true, data: match };
      }
    } catch (err) {
      console.warn('[eventService] Sanity fetch error, falling back to Express API:', err.message);
    }
    const response = await api.get(`/events/slug/${slug}`);
    return response.data;
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
