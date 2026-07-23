import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.Mixed, // ObjectId or String (e.g. 'SYSTEM')
    },
    performedBy: { 
      type: String 
    },
    action: {
      type: String, // e.g. 'USER_LOGIN', 'CMS_PAGE_UPDATED', 'ROLE_CHANGED'
      required: true,
    },
    category: {
      type: String,
      enum: ['activity', 'audit', 'system', 'security'],
      default: 'audit',
      index: true
    },
    eventType: {
      type: String,
      enum: [
        'user_login', 'user_logout', 'cms_change', 'admin_change', 
        'student_change', 'faculty_change', 'role_change', 
        'permission_change', 'database_change', 'other'
      ],
      default: 'other',
      index: true
    },
    entityType: {
      type: String, 
    },
    entityId: {
      type: mongoose.Schema.Types.Mixed,
    },
    details: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    status: {
      type: String,
      enum: ['success', 'failure'],
      default: 'success'
    },
    severity: {
      type: String,
      enum: ['info', 'warning', 'critical'],
      default: 'info'
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed // Full payload / changes diff
    }
  },
  {
    timestamps: true,
  }
);

auditLogSchema.index({ category: 1, createdAt: -1 });
auditLogSchema.index({ eventType: 1, createdAt: -1 });

export default mongoose.model('AuditLog', auditLogSchema);
