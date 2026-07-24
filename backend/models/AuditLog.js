import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.Mixed,
    },
    user: {
      type: mongoose.Schema.Types.Mixed,
    },
    performedBy: { 
      type: String 
    },
    action: {
      type: String,
      required: true,
    },
    module: {
      type: String,
      default: 'system',
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
    previousData: {
      type: mongoose.Schema.Types.Mixed,
    },
    updatedData: {
      type: mongoose.Schema.Types.Mixed,
    },
    details: {
      type: String,
      default: '',
    },
    IP: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    browser: {
      type: String,
      default: 'Unknown',
    },
    device: {
      type: String,
      default: 'Desktop',
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
      type: mongoose.Schema.Types.Mixed
    }
  },
  {
    timestamps: true,
  }
);

auditLogSchema.pre('save', function (next) {
  if (this.user && !this.userId) this.userId = this.user;
  if (this.userId && !this.user) this.user = this.userId;
  if (this.ipAddress && !this.IP) this.IP = this.ipAddress;
  if (this.IP && !this.ipAddress) this.ipAddress = this.IP;
  if (this.entityType && !this.module) this.module = this.entityType;
  if (this.module && !this.entityType) this.entityType = this.module;
  next();
});

auditLogSchema.index({ category: 1, createdAt: -1 });
auditLogSchema.index({ eventType: 1, createdAt: -1 });
auditLogSchema.index({ userId: 1 });

export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
