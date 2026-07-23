import { Notification } from '../models/Notification.js';
import AuditLog from '../models/AuditLog.js';
import { getIO } from '../utils/socket.js';

export const NotificationService = {
  /**
   * Dispatches a notification to the specified user across multiple channels
   */
  async dispatch({ recipientId, title, message, type = 'info', channels = ['in-app'], actionLink = null, metadata = null }) {
    try {
      // 1. In-App Notification (Database)
      if (channels.includes('in-app')) {
        const notification = await Notification.create({
          recipient: recipientId,
          title,
          message,
          type,
          channels,
          actionLink,
          metadata
        });

        // 2. Real-time WebSocket Push
        const io = getIO();
        if (io) {
          io.to(recipientId.toString()).emit('NEW_NOTIFICATION', notification);
        }
      }

      // 3. Email Notification (Mock implementation for now)
      if (channels.includes('email')) {
        console.log(`[EMAIL DISPATCH] To UserID: ${recipientId} | Subject: ${title} | Body: ${message}`);
        // TODO: Integrate AWS SES or SendGrid here
      }

      // 4. WhatsApp / Push (Future proofing)
      if (channels.includes('whatsapp')) {
        console.log(`[WHATSAPP DISPATCH] To UserID: ${recipientId} | Msg: ${message}`);
      }

    } catch (error) {
      console.error('[NotificationService] Failed to dispatch notification:', error);
    }
  },

  /**
   * System Activity / Audit Log recorder
   * Records every single business action to the Activity Timeline
   */
  async recordActivity({ action, performedBy, entityType, entityId, details, severity = 'info', metadata = null }) {
    try {
      const log = await AuditLog.create({
        action,
        performedBy,
        entityType,
        entityId,
        details,
        severity,
        metadata
      });

      // Stream it to the Admin Command Center instantly
      if (io) {
        io.to('admin_room').emit('NEW_ACTIVITY_LOG', log);
      }
    } catch (error) {
      console.error('[NotificationService] Failed to record activity:', error);
    }
  }
};
