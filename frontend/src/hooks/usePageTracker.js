import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { tracker } from '../utils/tracker';

/**
 * usePageTracker — Automatically tracks page views on every route change.
 * Install once in the App or a top-level layout component.
 */
export const usePageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track a new session on mount
    tracker.trackSessionStart();
  }, []);

  useEffect(() => {
    // Track a page view on every navigation
    tracker.trackPageView();
  }, [location.pathname]);
};
