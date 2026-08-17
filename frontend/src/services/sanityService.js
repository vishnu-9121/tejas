import api from '@/utils/api';
import { 
  GROQ_SITE_SETTINGS_QUERY,
  GROQ_HOMEPAGE_QUERY,
  GROQ_HERO_SLIDER_QUERY,
  GROQ_COLLABORATIONS_QUERY,
  GROQ_EXCELLENCE_FACTOR_QUERY,
  GROQ_FREE_PROGRAMS_QUERY,
  GROQ_INSTITUTION_SERVICES_QUERY,
  GROQ_RECOGNITIONS_QUERY,
  GROQ_PROGRAMS_QUERY, 
  GROQ_MENTORS_QUERY,
  GROQ_FAQS_QUERY,
  GROQ_POPUP_MODALS_QUERY,
  GROQ_ABOUT_PAGE_QUERY,
  GROQ_CONTACT_PAGE_QUERY,
  GROQ_NAVIGATION_QUERY,
  GROQ_FOOTER_QUERY,
  GROQ_GALLERY_QUERY,
  GROQ_TESTIMONIALS_QUERY,
  GROQ_EVENTS_QUERY,
  GROQ_BLOGS_QUERY,
  GROQ_COURSES_QUERY,
  GROQ_WORKSHOPS_QUERY
} from './groqQueries';

const SANITY_PROJECT_ID = import.meta.env.VITE_SANITY_PROJECT_ID || '6nl927hv';
const SANITY_DATASET = import.meta.env.VITE_SANITY_DATASET || 'production';
const SANITY_API_VERSION = import.meta.env.VITE_SANITY_API_VERSION || '2023-01-01';
const SANITY_API_TOKEN = import.meta.env.VITE_SANITY_API_TOKEN;

export const sanityService = {
  fetchGroq: async (query, params = {}) => {
    if (SANITY_PROJECT_ID) {
      try {
        let encodedQuery = encodeURIComponent(query);
        for (const [key, val] of Object.entries(params)) {
          encodedQuery = encodedQuery.replace(`$${key}`, `"${val}"`);
        }
        // Use live api.sanity.io endpoint with cache-busting timestamp & no-store policy for instant updates
        const timestamp = new Date().getTime();
        const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodedQuery}&_t=${timestamp}`;
        
        const headers = {};
        if (SANITY_API_TOKEN) {
          headers['Authorization'] = `Bearer ${SANITY_API_TOKEN}`;
        }

        const response = await fetch(url, { 
          headers, 
          cache: 'no-store'
        });
        const json = await response.json();
        if (json.result) return json.result;
      } catch (err) {
        console.warn('[SanityService] Direct Sanity fetch error, falling back to Express API:', err.message);
      }
    }
    return null;
  },

  getSiteSettings: async () => {
    const sanityRes = await sanityService.fetchGroq(GROQ_SITE_SETTINGS_QUERY);
    if (sanityRes) return sanityRes;

    const dbRes = await api.get('/cms/site_settings');
    return dbRes.data?.data || {};
  },

  getHeroSlides: async () => {
    const sanityRes = await sanityService.fetchGroq(GROQ_HERO_SLIDER_QUERY);
    if (sanityRes && sanityRes.length > 0) return sanityRes;

    try {
      const dbRes = await api.get('/cms/hero_slider');
      if (dbRes.data?.data && Array.isArray(dbRes.data.data)) return dbRes.data.data;
    } catch {
      // Graceful empty fallback
    }
    return [];
  },

  getCollaborations: async () => {
    const sanityRes = await sanityService.fetchGroq(GROQ_COLLABORATIONS_QUERY);
    if (sanityRes && sanityRes.length > 0) return sanityRes;

    try {
      const dbRes = await api.get('/cms/collaborations');
      if (dbRes.data?.data && Array.isArray(dbRes.data.data)) return dbRes.data.data;
    } catch {
      // Graceful empty fallback
    }
    return [];
  },

  getExcellenceFactorSteps: async () => {
    const sanityRes = await sanityService.fetchGroq(GROQ_EXCELLENCE_FACTOR_QUERY);
    if (sanityRes && sanityRes.length > 0) return sanityRes;

    try {
      const dbRes = await api.get('/cms/excellence_factor');
      if (dbRes.data?.data && Array.isArray(dbRes.data.data)) return dbRes.data.data;
    } catch {
      // Graceful empty fallback
    }
    return [];
  },

  getFreePrograms: async () => {
    const sanityRes = await sanityService.fetchGroq(GROQ_FREE_PROGRAMS_QUERY);
    if (sanityRes && sanityRes.length > 0) return sanityRes;

    try {
      const dbRes = await api.get('/cms/free_programs');
      if (dbRes.data?.data && Array.isArray(dbRes.data.data)) return dbRes.data.data;
    } catch {
      // Graceful empty fallback
    }
    return [];
  },

  getInstitutionServices: async () => {
    const sanityRes = await sanityService.fetchGroq(GROQ_INSTITUTION_SERVICES_QUERY);
    if (sanityRes && sanityRes.length > 0) return sanityRes;

    try {
      const dbRes = await api.get('/cms/institution_services');
      if (dbRes.data?.data && Array.isArray(dbRes.data.data)) return dbRes.data.data;
    } catch {
      // Graceful empty fallback
    }
    return [];
  },

  getRecognitions: async () => {
    const sanityRes = await sanityService.fetchGroq(GROQ_RECOGNITIONS_QUERY);
    if (sanityRes && sanityRes.length > 0) return sanityRes;

    try {
      const dbRes = await api.get('/cms/recognitions');
      if (dbRes.data?.data && Array.isArray(dbRes.data.data)) return dbRes.data.data;
    } catch {
      // Graceful empty fallback
    }
    return [];
  },

  getHomepage: async () => {
    const sanityRes = await sanityService.fetchGroq(GROQ_HOMEPAGE_QUERY);
    if (sanityRes) return sanityRes;

    const dbRes = await api.get('/cms/homepage');
    return dbRes.data?.data || null;
  },

  getAboutPage: async () => {
    const sanityRes = await sanityService.fetchGroq(GROQ_ABOUT_PAGE_QUERY);
    if (sanityRes) return sanityRes;

    const dbRes = await api.get('/cms/about');
    return dbRes.data?.data || null;
  },

  getContactPage: async () => {
    const sanityRes = await sanityService.fetchGroq(GROQ_CONTACT_PAGE_QUERY);
    if (sanityRes) return sanityRes;

    const dbRes = await api.get('/cms/contact');
    return dbRes.data?.data || null;
  },

  getNavigation: async () => {
    const sanityRes = await sanityService.fetchGroq(GROQ_NAVIGATION_QUERY);
    if (sanityRes) return sanityRes;

    const dbRes = await api.get('/cms/navigation');
    return dbRes.data?.data || null;
  },

  getFooter: async () => {
    const sanityRes = await sanityService.fetchGroq(GROQ_FOOTER_QUERY);
    if (sanityRes) return sanityRes;

    const dbRes = await api.get('/cms/footer');
    return dbRes.data?.data || null;
  },

  getGallery: async () => {
    const sanityRes = await sanityService.fetchGroq(GROQ_GALLERY_QUERY);
    if (sanityRes && sanityRes.length > 0) return sanityRes;

    const dbRes = await api.get('/gallery');
    return dbRes.data?.data || [];
  },

  getTestimonials: async () => {
    const sanityRes = await sanityService.fetchGroq(GROQ_TESTIMONIALS_QUERY);
    if (sanityRes && sanityRes.length > 0) return sanityRes;

    const dbRes = await api.get('/testimonials');
    return dbRes.data?.data || [];
  },

  getEvents: async () => {
    const sanityRes = await sanityService.fetchGroq(GROQ_EVENTS_QUERY);
    if (sanityRes && sanityRes.length > 0) return sanityRes;

    const dbRes = await api.get('/events');
    return dbRes.data?.data || [];
  },

  getBlogs: async () => {
    const sanityRes = await sanityService.fetchGroq(GROQ_BLOGS_QUERY);
    if (sanityRes && sanityRes.length > 0) return sanityRes;

    const dbRes = await api.get('/blogs');
    return dbRes.data?.data || [];
  },

  getPrograms: async () => {
    const sanityRes = await sanityService.fetchGroq(GROQ_PROGRAMS_QUERY);
    if (sanityRes && sanityRes.length > 0) return sanityRes;

    const dbRes = await api.get('/programs');
    return dbRes.data?.data?.programs || dbRes.data?.data || [];
  },

  getMentors: async () => {
    const sanityRes = await sanityService.fetchGroq(GROQ_MENTORS_QUERY);
    if (sanityRes && sanityRes.length > 0) return sanityRes;

    const dbRes = await api.get('/faculty');
    return dbRes.data?.data || [];
  },

  getFaqs: async () => {
    const sanityRes = await sanityService.fetchGroq(GROQ_FAQS_QUERY);
    if (sanityRes && sanityRes.length > 0) return sanityRes;

    const dbRes = await api.get('/cms/global_faqs');
    return dbRes.data?.data || [];
  },

  getPopupModals: async () => {
    const sanityRes = await sanityService.fetchGroq(GROQ_POPUP_MODALS_QUERY);
    if (sanityRes && sanityRes.length > 0) return sanityRes;

    const dbRes = await api.get('/cms/popup_modals');
    return dbRes.data?.data || [];
  },

  getCourses: async () => {
    const sanityRes = await sanityService.fetchGroq(GROQ_COURSES_QUERY);
    if (sanityRes && sanityRes.length > 0) return sanityRes;

    const dbRes = await api.get('/courses');
    return dbRes.data?.data || [];
  },

  getWorkshops: async () => {
    const sanityRes = await sanityService.fetchGroq(GROQ_WORKSHOPS_QUERY);
    if (sanityRes && sanityRes.length > 0) return sanityRes;

    const dbRes = await api.get('/workshops');
    return dbRes.data?.data || [];
  }
};

