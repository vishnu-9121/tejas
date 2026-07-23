import { eventBus, EVENTS } from '../utils/eventBus.js';
import { getIO } from '../utils/socket.js';
import { logger } from '../utils/logger.js';
import AuditLog from '../models/AuditLog.js';
import { User } from '../models/User.js';

export const registerAdmissionListeners = () => {
  eventBus.on(EVENTS.APPLICATION_APPROVED, async (payload) => {
    const { admissionId, applicantId, programName } = payload;
    logger.info(`[Event] Admission ${admissionId} approved for ${programName}`);

    const io = getIO();
    
    // 1. WebSocket Broadcast to the specific user
    if (applicantId) {
      io.to(`user_${applicantId}`).emit('notification', {
        title: 'Application Approved! 🎉',
        message: `Congratulations! Your application for ${programName} has been approved.`,
        type: 'success',
      });
      // Invalidate student queries
      io.to(`user_${applicantId}`).emit('invalidate_queries', ['student_applications', 'my-profile']);
      
      // Update User lifecycle stage
      await User.findByIdAndUpdate(applicantId, { lifecycleStage: 'admitted' });
    }
    
    // 2. Cross-Domain: Trigger Finance to create an invoice
    eventBus.emit(EVENTS.INVOICE_GENERATED, { applicantId, admissionId, programName, amount: 50000 }); // Mock amount

    // 3. Audit Log
    await AuditLog.create({
      action: EVENTS.APPLICATION_APPROVED,
      details: `Application ${admissionId} approved for ${programName}`,
      performedBy: 'SYSTEM',
      ipAddress: 'internal'
    });
  });

  eventBus.on(EVENTS.APPLICATION_SUBMITTED, async (payload) => {
    const { applicantId, programName, admissionId } = payload;
    logger.info(`[Event] New Admission submitted for ${programName}`);
    
    const io = getIO();
    // Notify admin dashboard to instantly update
    io.to('admin_room').emit('ADMIN_ANALYTICS_UPDATED', {
      type: EVENTS.APPLICATION_SUBMITTED,
      message: `New application received for ${programName}`
    });

    if (applicantId) {
      io.to(`user_${applicantId}`).emit('invalidate_queries', ['student_applications', 'my-profile']);
      
      // Update User lifecycle stage (only if not already higher)
      await User.findOneAndUpdate(
        { _id: applicantId, lifecycleStage: { $in: ['guest', 'lead'] } },
        { lifecycleStage: 'applicant' }
      );
    }

    await AuditLog.create({
      action: EVENTS.APPLICATION_SUBMITTED,
      details: `Application ${admissionId || 'unknown'} submitted for ${programName}`,
      performedBy: applicantId || 'SYSTEM',
      ipAddress: 'internal'
    });
  });
};
