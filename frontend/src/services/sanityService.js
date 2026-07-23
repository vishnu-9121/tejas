import api from '@/utils/api';
import { 
  GROQ_PAGE_BY_SLUG_QUERY, 
  GROQ_PROGRAMS_QUERY, 
  GROQ_SITE_SETTINGS_QUERY,
  GROQ_THEME_SETTINGS_QUERY 
} from './groqQueries';

const SANITY_PROJECT_ID = import.meta.env.VITE_SANITY_PROJECT_ID || '6nl927hv';
const SANITY_DATASET = import.meta.env.VITE_SANITY_DATASET || 'production';
const SANITY_API_VERSION = import.meta.env.VITE_SANITY_API_VERSION || '2023-01-01';
const SANITY_API_TOKEN = import.meta.env.VITE_SANITY_API_TOKEN;

export const sanityService = {
  /**
   * Execute GROQ Query against Sanity API Gateway
   */
  fetchGroq: async (query, params = {}) => {
    if (SANITY_PROJECT_ID) {
      try {
        let encodedQuery = encodeURIComponent(query);
        for (const [key, val] of Object.entries(params)) {
          encodedQuery = encodedQuery.replace(`$${key}`, `"${val}"`);
        }
        const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodedQuery}`;
        
        const headers = {};
        if (SANITY_API_TOKEN) {
          headers['Authorization'] = `Bearer ${SANITY_API_TOKEN}`;
        }

        const response = await fetch(url, { headers });
        const json = await response.json();
        if (json.result) return json.result;
      } catch (err) {
        console.warn('[SanityService] Sanity fetch error, falling back to database API:', err.message);
      }
    }
    return null;
  },

  /**
   * Fetch Theme Settings (Sanity GROQ + DB Fallback)
   */
  getThemeSettings: async () => {
    const sanityRes = await sanityService.fetchGroq(GROQ_THEME_SETTINGS_QUERY);
    if (sanityRes) return sanityRes;

    return {
      primaryColor: '#0f172a',
      secondaryColor: '#d97706',
      accentColor: '#f59e0b',
      borderRadius: '0.75rem',
      fontFamily: 'Inter, sans-serif'
    };
  },

  /**
   * Fetch Page by Slug (Sanity GROQ + DB Fallback)
   */
  getPageBySlug: async (slug) => {
    const sanityRes = await sanityService.fetchGroq(GROQ_PAGE_BY_SLUG_QUERY, { slug });
    if (sanityRes) return sanityRes;

    // Fallback to Enterprise DB CMS Endpoint
    try {
      const dbRes = await api.get(`/cms/pages/${slug}`);
      const pageData = dbRes.data?.data;
      if (pageData) {
        return {
          title: pageData.pageMeta?.title || slug,
          slug,
          seo: pageData.pageMeta?.seo,
          pageBuilder: pageData.blocks || []
        };
      }
    } catch (e) {
      // Fallback
    }
    return null;
  },

  /**
   * Fetch Programs Catalog (Sanity GROQ + DB Fallback)
   */
  getPrograms: async () => {
    const sanityRes = await sanityService.fetchGroq(GROQ_PROGRAMS_QUERY);
    if (sanityRes && sanityRes.length > 0) return sanityRes;

    const dbRes = await api.get('/programs');
    return dbRes.data?.data?.programs || dbRes.data?.data || [];
  },

  /**
   * Fetch Site Settings (Sanity GROQ + DB Fallback)
   */
  getSiteSettings: async () => {
    const sanityRes = await sanityService.fetchGroq(GROQ_SITE_SETTINGS_QUERY);
    if (sanityRes) return sanityRes;

    const dbRes = await api.get('/cms/site_settings');
    return dbRes.data?.data || {};
  }
};
