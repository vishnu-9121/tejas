import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '/api/v1';

// Native browser UUID generator (fallback for environments without uuid npm package)
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'vid_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
};

/**
 * FrontendTracker — Lightweight analytics collector that fires events
 * to the AnalyticsEngine backend. Install once in App.jsx.
 */
class FrontendTracker {
  constructor() {
    this.visitorId = this.getOrCreateVisitorId();
    this.sessionStart = Date.now();
    this.source = this.detectSource();
    this.device = this.detectDevice();
  }

  getOrCreateVisitorId() {
    let id = localStorage.getItem('_ta_vid');
    if (!id) {
      id = generateUUID();
      localStorage.setItem('_ta_vid', id);
    }
    return id;
  }

  detectSource() {
    const ref = document.referrer;
    if (!ref) return 'direct';
    if (ref.includes('google') || ref.includes('bing') || ref.includes('yahoo')) return 'organic';
    if (ref.includes('facebook') || ref.includes('twitter') || ref.includes('linkedin') || ref.includes('instagram')) return 'social';
    if (ref.includes('utm_medium=email')) return 'email';
    if (ref.includes('utm_medium=cpc') || ref.includes('gclid')) return 'paid';
    return 'referral';
  }

  detectDevice() {
    const ua = navigator.userAgent;
    if (/tablet|ipad/i.test(ua)) return 'tablet';
    if (/mobile|android|iphone/i.test(ua)) return 'mobile';
    return 'desktop';
  }

  async send(event, metadata = {}) {
    try {
      await axios.post(`${API}/analytics/track`, {
        event,
        page: window.location.pathname,
        referrer: document.referrer,
        source: this.source,
        device: this.device,
        browser: navigator.userAgent.split(' ').pop(),
        visitorId: this.visitorId,
        sessionDuration: Math.floor((Date.now() - this.sessionStart) / 1000),
        metadata
      });
    } catch (err) {
      // Fail silently — analytics should never block the user
    }
  }

  // Convenience methods
  trackPageView() {
    this.send('page_view');
  }

  trackSessionStart() {
    this.send('session_start');
  }

  trackSearch(searchTerm) {
    this.send('search_query', { searchTerm });
  }

  trackProgramView(programId, programName) {
    this.send('program_view', { programId, programName });
  }

  trackCTAClick(ctaLabel, ctaLocation) {
    this.send('cta_click', { ctaLabel, ctaLocation });
  }

  trackFormSubmit(formName) {
    this.send('form_submit', { formName });
  }

  trackBounce() {
    this.send('bounce');
  }
}

// Singleton instance
export const tracker = new FrontendTracker();
