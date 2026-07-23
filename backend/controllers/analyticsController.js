import { AnalyticsEngine } from '../services/AnalyticsEngine.js';
import { sendResponse } from '../helpers/responseFormatter.js';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * GET /api/v1/analytics/overview
 * Legacy overview endpoint — now powered by AnalyticsEngine
 */
export const getOverview = async (req, res, next) => {
  try {
    const dashboard = await AnalyticsEngine.getAdminDashboard();

    // Shape the response to maintain backward compatibility with
    // existing Command Center widgets while adding new deep metrics
    sendResponse(res, HTTP_STATUS.OK, 'Analytics overview retrieved', {
      kpis: {
        totalAdmissions: dashboard.admissionsFunnel.applications,
        admissionsToday: dashboard.growth.studentsThisMonth,
        pendingApplications: dashboard.admissionsFunnel.underReview,
        revenue: dashboard.revenue.estimatedRevenue,
        projectedRevenue: dashboard.revenue.projectedRevenue,
        students: dashboard.growth.totalStudents,
        studentGrowth: dashboard.growth.studentGrowth,
        programs: dashboard.growth.totalPrograms,
        courses: dashboard.growth.totalCourses,
        events: dashboard.growth.totalEvents,
        blogs: dashboard.growth.totalBlogs,
        faculty: dashboard.growth.totalFaculty,
        websiteVisitors: dashboard.traffic.totalVisitors || 0,
        uniqueVisitors: dashboard.traffic.uniqueVisitors || 0,
        bounceRate: dashboard.traffic.bounceRate,
        conversionRate: dashboard.admissionsFunnel.conversionRate,
        inquiries: dashboard.admissionsFunnel.leads
      },
      admissionsFunnel: dashboard.admissionsFunnel,
      admissionsTrend: dashboard.admissionsTrend,
      trafficSources: dashboard.trafficSources,
      popularPages: dashboard.popularPages,
      searchAnalytics: dashboard.searchAnalytics,
      popularPrograms: dashboard.popularPrograms,
      systemHealth: dashboard.systemHealth
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/analytics/admin
 * Full admin analytics dashboard
 */
export const getAdminAnalytics = async (req, res, next) => {
  try {
    const data = await AnalyticsEngine.getAdminDashboard();
    sendResponse(res, HTTP_STATUS.OK, 'Admin analytics retrieved', data);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/analytics/faculty
 * Faculty-focused analytics
 */
export const getFacultyAnalytics = async (req, res, next) => {
  try {
    const data = await AnalyticsEngine.getFacultyDashboard();
    sendResponse(res, HTTP_STATUS.OK, 'Faculty analytics retrieved', data);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/analytics/management
 * Management/Board-level strategic analytics
 */
export const getManagementAnalytics = async (req, res, next) => {
  try {
    const data = await AnalyticsEngine.getManagementDashboard();
    sendResponse(res, HTTP_STATUS.OK, 'Management analytics retrieved', data);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/analytics/track
 * Public endpoint for the frontend tracker to ingest events
 */
export const trackEvent = async (req, res, next) => {
  try {
    const { event, page, referrer, source, device, browser, country, metadata, visitorId, sessionDuration } = req.body;

    await AnalyticsEngine.track({
      event,
      page,
      referrer,
      source,
      device,
      browser,
      country,
      metadata,
      visitorId,
      sessionDuration,
      userId: req.user?.id || null
    });

    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
};
