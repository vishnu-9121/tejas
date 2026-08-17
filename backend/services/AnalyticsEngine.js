import { AnalyticsEvent } from '../models/AnalyticsEvent.js';
import { Admission } from '../models/Admission.js';
import { User } from '../models/User.js';
import { Program } from '../models/Program.js';
import { Course } from '../models/Course.js';
import { Inquiry } from '../models/Inquiry.js';
import { Event } from '../models/Event.js';
import Blog from '../models/Blog.js';

/**
 * AnalyticsEngine — The single source of truth for all platform metrics.
 * Every dashboard (Admin, Faculty, Management) calls into this service.
 */
export const AnalyticsEngine = {

  // ──────────────────────────────────────────────
  // 1. VISITOR & TRAFFIC ANALYTICS
  // ──────────────────────────────────────────────

  async getTrafficMetrics(dateRange = 30) {
    const since = new Date();
    since.setDate(since.getDate() - dateRange);

    const [
      totalVisitors,
      uniqueVisitors,
      pageViews,
      bounces,
      sessions
    ] = await Promise.all([
      AnalyticsEvent.countDocuments({ event: 'page_view', createdAt: { $gte: since } }),
      AnalyticsEvent.distinct('visitorId', { event: 'page_view', createdAt: { $gte: since } }).then(r => r.length),
      AnalyticsEvent.countDocuments({ event: 'page_view', createdAt: { $gte: since } }),
      AnalyticsEvent.countDocuments({ event: 'bounce', createdAt: { $gte: since } }),
      AnalyticsEvent.countDocuments({ event: 'session_start', createdAt: { $gte: since } })
    ]);

    const bounceRate = sessions > 0 ? ((bounces / sessions) * 100).toFixed(1) : 0;

    return { totalVisitors, uniqueVisitors, pageViews, bounceRate, sessions };
  },

  async getTrafficSources(dateRange = 30) {
    const since = new Date();
    since.setDate(since.getDate() - dateRange);

    const sources = await AnalyticsEvent.aggregate([
      { $match: { event: 'session_start', createdAt: { $gte: since } } },
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return sources.map(s => ({ source: s._id, count: s.count }));
  },

  async getPopularPages(dateRange = 30, limit = 10) {
    const since = new Date();
    since.setDate(since.getDate() - dateRange);

    const pages = await AnalyticsEvent.aggregate([
      { $match: { event: 'page_view', createdAt: { $gte: since } } },
      { $group: { _id: '$page', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: limit }
    ]);

    return pages.map(p => ({ page: p._id, views: p.views }));
  },

  async getSearchAnalytics(dateRange = 30, limit = 20) {
    const since = new Date();
    since.setDate(since.getDate() - dateRange);

    const searches = await AnalyticsEvent.aggregate([
      { $match: { event: 'search_query', createdAt: { $gte: since } } },
      { $group: { _id: '$metadata.searchTerm', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]);

    return searches.map(s => ({ term: s._id, count: s.count }));
  },

  // ──────────────────────────────────────────────
  // 2. ADMISSIONS & CONVERSION FUNNEL
  // ──────────────────────────────────────────────

  async getAdmissionsFunnel() {
    const [
      totalInquiries,
      totalApplications,
      underReview,
      accepted,
      enrolled
    ] = await Promise.all([
      Inquiry.countDocuments(),
      Admission.countDocuments(),
      Admission.countDocuments({ status: { $in: ['Pending', 'Under Review', 'pending', 'under_review', 'submitted', 'interview_scheduled'] } }),
      Admission.countDocuments({ status: { $in: ['Accepted', 'accepted', 'approved'] } }),
      Admission.countDocuments({ status: { $in: ['Enrolled', 'enrolled'] } })
    ]);

    const conversionRate = totalInquiries > 0
      ? ((totalApplications / totalInquiries) * 100).toFixed(1)
      : (totalApplications > 0 ? 100 : 0);

    return {
      leads: totalInquiries,
      applications: totalApplications,
      underReview,
      accepted,
      enrolled,
      conversionRate
    };
  },

  async getAdmissionsTrend(months = 6) {
    const pipeline = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      pipeline.push(
        Admission.countDocuments({ createdAt: { $gte: start, $lte: end } })
          .then(count => ({
            month: start.toLocaleString('default', { month: 'short' }),
            count
          }))
      );
    }

    return Promise.all(pipeline);
  },

  // ──────────────────────────────────────────────
  // 3. GROWTH METRICS
  // ──────────────────────────────────────────────

  async getGrowthMetrics() {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalStudents,
      studentsThisMonth,
      studentsLastMonth,
      totalFaculty,
      totalPrograms,
      totalCourses,
      totalEvents,
      totalBlogs
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'student', createdAt: { $gte: thisMonth } }),
      User.countDocuments({ role: 'student', createdAt: { $gte: lastMonth, $lt: thisMonth } }),
      User.countDocuments({ role: { $in: ['faculty', 'mentor'] } }),
      Program.countDocuments(),
      Course.countDocuments(),
      Event.countDocuments(),
      Blog.countDocuments()
    ]);

    const studentGrowth = studentsLastMonth > 0
      ? (((studentsThisMonth - studentsLastMonth) / studentsLastMonth) * 100).toFixed(1)
      : studentsThisMonth > 0 ? 100 : 0;

    return {
      totalStudents,
      studentsThisMonth,
      studentGrowth: `${studentGrowth}%`,
      totalFaculty,
      totalPrograms,
      totalCourses,
      totalEvents,
      totalBlogs
    };
  },

  // ──────────────────────────────────────────────
  // 4. REVENUE ANALYTICS
  // ──────────────────────────────────────────────

  async getRevenueMetrics() {
    const [enrolledAdmissions, acceptedAdmissions, totalAdmissions] = await Promise.all([
      Admission.find({ status: { $in: ['enrolled', 'Enrolled'] } }).populate('programId', 'fees pricing.totalFee').lean(),
      Admission.find({ status: { $in: ['accepted', 'Accepted', 'approved'] } }).populate('programId', 'fees pricing.totalFee').lean(),
      Admission.countDocuments()
    ]);

    const calculateSum = (list) => list.reduce((acc, curr) => {
      const fee = curr.programId?.pricing?.totalFee || curr.programId?.fees || 150000;
      return acc + (Number(fee) || 0);
    }, 0);

    const estimatedRevenue = calculateSum(enrolledAdmissions);
    const projectedRevenue = estimatedRevenue + calculateSum(acceptedAdmissions);

    return {
      estimatedRevenue,
      projectedRevenue,
      enrolledStudents: enrolledAdmissions.length,
      acceptedStudents: acceptedAdmissions.length,
      totalAdmissions
    };
  },

  // ──────────────────────────────────────────────
  // 5. POPULAR PROGRAMS
  // ──────────────────────────────────────────────

  async getPopularPrograms(limit = 5) {
    const programs = await Admission.aggregate([
      { 
        $group: { 
          _id: { $ifNull: ['$program', '$programName'] }, 
          applications: { $sum: 1 } 
        } 
      },
      { $match: { _id: { $ne: null } } },
      { $sort: { applications: -1 } },
      { $limit: limit }
    ]);

    return programs.map(p => ({ name: p._id, applications: p.applications }));
  },

  // ──────────────────────────────────────────────
  // 6. COMPOSITE DASHBOARD PAYLOADS
  // ──────────────────────────────────────────────

  /**
   * Admin Dashboard — everything
   */
  async getAdminDashboard() {
    const [
      traffic,
      trafficSources,
      popularPages,
      searchAnalytics,
      admissionsFunnel,
      admissionsTrend,
      growth,
      revenue,
      popularPrograms
    ] = await Promise.all([
      this.getTrafficMetrics(),
      this.getTrafficSources(),
      this.getPopularPages(),
      this.getSearchAnalytics(),
      this.getAdmissionsFunnel(),
      this.getAdmissionsTrend(),
      this.getGrowthMetrics(),
      this.getRevenueMetrics(),
      this.getPopularPrograms()
    ]);

    return {
      traffic,
      trafficSources,
      popularPages,
      searchAnalytics,
      admissionsFunnel,
      admissionsTrend,
      growth,
      revenue,
      popularPrograms,
      systemHealth: {
        status: 'Operational',
        uptime: process.uptime(),
        memoryUsageMB: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)
      }
    };
  },

  /**
   * Faculty Dashboard — academic-focused subset
   */
  async getFacultyDashboard() {
    const [growth, popularPrograms] = await Promise.all([
      this.getGrowthMetrics(),
      this.getPopularPrograms(10)
    ]);

    return {
      totalStudents: growth.totalStudents,
      totalPrograms: growth.totalPrograms,
      totalCourses: growth.totalCourses,
      popularPrograms
    };
  },

  /**
   * Management Dashboard — revenue + strategic KPIs
   */
  async getManagementDashboard() {
    const [
      revenue,
      admissionsFunnel,
      admissionsTrend,
      growth,
      traffic
    ] = await Promise.all([
      this.getRevenueMetrics(),
      this.getAdmissionsFunnel(),
      this.getAdmissionsTrend(12),
      this.getGrowthMetrics(),
      this.getTrafficMetrics()
    ]);

    return {
      revenue,
      admissionsFunnel,
      admissionsTrend,
      growth,
      traffic
    };
  },

  // ──────────────────────────────────────────────
  // 7. EVENT TRACKING INGEST
  // ──────────────────────────────────────────────

  async track(eventData) {
    try {
      await AnalyticsEvent.create(eventData);
    } catch (error) {
      console.error('[AnalyticsEngine] Track error:', error.message);
    }
  }
};
