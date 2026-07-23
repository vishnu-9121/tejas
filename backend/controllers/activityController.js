import AuditLog from '../models/AuditLog.js';

/**
 * GET /api/v1/activity
 * Centralized log reader supporting Category filters:
 * - 'activity' -> Activity Timeline
 * - 'audit'    -> Audit Logs
 * - 'system'   -> System Logs
 * - 'security' -> Security Logs
 */
export const getGlobalActivity = async (req, res) => {
  try {
    const { 
      category, 
      eventType, 
      severity, 
      status, 
      search, 
      page = 1, 
      limit = 50 
    } = req.query;

    const filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (eventType && eventType !== 'all') {
      filter.eventType = eventType;
    }

    if (severity && severity !== 'all') {
      filter.severity = severity;
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { action: regex },
        { performedBy: regex },
        { details: regex },
        { entityType: regex },
        { ipAddress: regex }
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .sort('-createdAt')
        .skip(skip)
        .limit(limitNum)
        .lean(),
      AuditLog.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/v1/activity/stats
 * Provides log counts by category and severity for the Admin Command Center
 */
export const getActivityStats = async (req, res) => {
  try {
    const [activityCount, auditCount, systemCount, securityCount, criticalCount] = await Promise.all([
      AuditLog.countDocuments({ category: 'activity' }),
      AuditLog.countDocuments({ category: 'audit' }),
      AuditLog.countDocuments({ category: 'system' }),
      AuditLog.countDocuments({ category: 'security' }),
      AuditLog.countDocuments({ severity: 'critical' })
    ]);

    res.status(200).json({
      success: true,
      data: {
        activityCount,
        auditCount,
        systemCount,
        securityCount,
        criticalCount,
        total: activityCount + auditCount + systemCount + securityCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
