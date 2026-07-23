import { eventBus, EVENTS } from '../utils/eventBus.js';
import { getIO } from '../utils/socket.js';
import AuditLog from '../models/AuditLog.js';

export const registerAdminListeners = () => {
  console.log('Registering Admin Listeners...');

  const notifyAdmins = async (eventType, payload, message) => {
    try {
      const io = getIO();
      // Emitting to everyone in the 'admin_room' to invalidate react-query caches
      io.to('admin_room').emit('ADMIN_ANALYTICS_UPDATED', {
        type: eventType,
        timestamp: new Date().toISOString(),
        payload,
        message
      });
      console.log(`[Admin Listener] Broadcasted ${eventType} to admin_room`);

      // Write to AuditLog for Activity Timeline
      await AuditLog.create({
        action: eventType,
        details: message || `System triggered ${eventType}`,
        performedBy: payload?.userId || 'SYSTEM',
        ipAddress: 'internal'
      });
    } catch (error) {
      console.error(`[Admin Listener Error] Failed to process ${eventType}:`, error);
    }
  };

  // Bind to new Domain Events
  eventBus.on(EVENTS.APPLICATION_SUBMITTED, (data) => notifyAdmins(EVENTS.APPLICATION_SUBMITTED, data, 'New student application submitted'));
  eventBus.on(EVENTS.STUDENT_CREATED, (data) => notifyAdmins(EVENTS.STUDENT_CREATED, data, 'New student account created'));
  eventBus.on(EVENTS.COURSE_PUBLISHED, (data) => notifyAdmins(EVENTS.COURSE_PUBLISHED, data, 'Course published live'));
  eventBus.on(EVENTS.PAYMENT_COMPLETED, (data) => notifyAdmins(EVENTS.PAYMENT_COMPLETED, data, 'Payment received successfully'));
  eventBus.on(EVENTS.CONTENT_PUBLISHED, (data) => notifyAdmins(EVENTS.CONTENT_PUBLISHED, data, 'CMS Content was published'));
  eventBus.on(EVENTS.EVENT_CREATED, (data) => notifyAdmins(EVENTS.EVENT_CREATED, data, 'New campus event scheduled'));
};
