import AuditLog from '../models/AuditLog.js';
import { getIO } from '../utils/socket.js';

/**
 * EnterpriseAuditService — Centralized logging engine for security, administrative,
 * CMS, role, student, faculty, and database operations.
 */
export const EnterpriseAuditService = {

  async log({
    user = null,
    performedBy = 'SYSTEM',
    action,
    category = 'audit',
    eventType = 'other',
    entityType = '',
    entityId = null,
    details = '',
    ipAddress = '',
    userAgent = '',
    status = 'success',
    severity = 'info',
    metadata = null
  }) {
    try {
      const logEntry = await AuditLog.create({
        user: user?.id || user?._id || user || 'SYSTEM',
        performedBy: performedBy || user?.name || user?.email || 'SYSTEM',
        action,
        category,
        eventType,
        entityType,
        entityId,
        details,
        ipAddress,
        userAgent,
        status,
        severity,
        metadata
      });

      // Stream to WebSocket real-time subscribers (Admin Command Center & Security Logs View)
      const io = getIO();
      if (io) {
        io.to('admin_room').emit('NEW_AUDIT_LOG', logEntry);
      }

      return logEntry;
    } catch (error) {
      console.error('[EnterpriseAuditService] Log error:', error.message);
    }
  },

  // Helper method: Extract IP and UserAgent from Express request
  getReqMetadata(req) {
    if (!req) return { ipAddress: '', userAgent: '' };
    const ipAddress = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.ip || '';
    const userAgent = req.headers['user-agent'] || '';
    return { ipAddress, userAgent };
  },

  // 1. User Login
  async logLogin(user, req, success = true, failureReason = '') {
    const { ipAddress, userAgent } = this.getReqMetadata(req);
    return this.log({
      user: user?._id || user?.id,
      performedBy: user?.name || user?.email || 'Unknown User',
      action: success ? 'USER_LOGIN_SUCCESS' : 'USER_LOGIN_FAILED',
      category: 'security',
      eventType: 'user_login',
      entityType: 'User',
      entityId: user?._id || user?.id,
      details: success ? `User logged in successfully` : `Login failed: ${failureReason}`,
      status: success ? 'success' : 'failure',
      severity: success ? 'info' : 'warning',
      ipAddress,
      userAgent,
      metadata: { email: user?.email }
    });
  },

  // 2. User Logout
  async logLogout(user, req) {
    const { ipAddress, userAgent } = this.getReqMetadata(req);
    return this.log({
      user: user?._id || user?.id,
      performedBy: user?.name || user?.email || 'User',
      action: 'USER_LOGOUT',
      category: 'security',
      eventType: 'user_logout',
      entityType: 'User',
      entityId: user?._id || user?.id,
      details: `User logged out`,
      ipAddress,
      userAgent
    });
  },

  // 3. CMS Changes
  async logCMSChange(user, action, pageSlug, metadata = {}, req) {
    const { ipAddress, userAgent } = this.getReqMetadata(req);
    return this.log({
      user: user?._id || user?.id,
      performedBy: user?.name || 'CMS Editor',
      action: `CMS_${action.toUpperCase()}`,
      category: 'audit',
      eventType: 'cms_change',
      entityType: 'ContentPage',
      entityId: pageSlug,
      details: `CMS page '${pageSlug}' was ${action}`,
      ipAddress,
      userAgent,
      metadata
    });
  },

  // 4. Admin Changes
  async logAdminChange(user, action, details, metadata = {}, req) {
    const { ipAddress, userAgent } = this.getReqMetadata(req);
    return this.log({
      user: user?._id || user?.id,
      performedBy: user?.name || 'Admin',
      action: `ADMIN_${action.toUpperCase()}`,
      category: 'audit',
      eventType: 'admin_change',
      details,
      ipAddress,
      userAgent,
      metadata
    });
  },

  // 5. Student Changes
  async logStudentChange(user, studentId, action, details, req) {
    const { ipAddress, userAgent } = this.getReqMetadata(req);
    return this.log({
      user: user?._id || user?.id,
      performedBy: user?.name || 'Staff',
      action: `STUDENT_${action.toUpperCase()}`,
      category: 'activity',
      eventType: 'student_change',
      entityType: 'Student',
      entityId: studentId,
      details,
      ipAddress,
      userAgent
    });
  },

  // 6. Faculty Changes
  async logFacultyChange(user, facultyId, action, details, req) {
    const { ipAddress, userAgent } = this.getReqMetadata(req);
    return this.log({
      user: user?._id || user?.id,
      performedBy: user?.name || 'Staff',
      action: `FACULTY_${action.toUpperCase()}`,
      category: 'activity',
      eventType: 'faculty_change',
      entityType: 'Faculty',
      entityId: facultyId,
      details,
      ipAddress,
      userAgent
    });
  },

  // 7. Role Changes
  async logRoleChange(user, targetUser, oldRole, newRole, req) {
    const { ipAddress, userAgent } = this.getReqMetadata(req);
    return this.log({
      user: user?._id || user?.id,
      performedBy: user?.name || 'Admin',
      action: 'ROLE_UPDATED',
      category: 'security',
      eventType: 'role_change',
      entityType: 'User',
      entityId: targetUser._id || targetUser.id,
      details: `Role for ${targetUser.name || targetUser.email} changed from '${oldRole}' to '${newRole}'`,
      severity: 'warning',
      ipAddress,
      userAgent,
      metadata: { targetUserId: targetUser._id, oldRole, newRole }
    });
  },

  // 8. Database / System Changes
  async logDatabaseChange(user, action, collection, entityId, details, req) {
    const { ipAddress, userAgent } = this.getReqMetadata(req);
    return this.log({
      user: user?._id || user?.id || 'SYSTEM',
      performedBy: user?.name || 'SYSTEM',
      action: `DB_${action.toUpperCase()}`,
      category: 'system',
      eventType: 'database_change',
      entityType: collection,
      entityId,
      details,
      ipAddress,
      userAgent
    });
  }
};
