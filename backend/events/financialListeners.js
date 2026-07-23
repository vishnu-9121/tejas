import { eventBus, EVENTS } from '../utils/eventBus.js';
import { getIO } from '../utils/socket.js';
import { logger } from '../utils/logger.js';
import AuditLog from '../models/AuditLog.js';
import { User } from '../models/User.js';

export const registerFinancialListeners = () => {
  eventBus.on(EVENTS.INVOICE_GENERATED, async (payload) => {
    const { applicantId, admissionId, programName, amount } = payload;
    logger.info(`[Event] Invoice generated for admission ${admissionId}`);
    
    // In a real system, we'd save an Invoice document here.
    
    const io = getIO();
    if (applicantId) {
      io.to(`user_${applicantId}`).emit('notification', {
        title: 'Invoice Generated',
        message: `An invoice of $${amount} has been generated for ${programName}.`,
        type: 'info',
      });
      // Invalidate student financials
      io.to(`user_${applicantId}`).emit('invalidate_queries', ['student_invoices']);
    }

    await AuditLog.create({
      action: EVENTS.INVOICE_GENERATED,
      details: `Invoice generated for admission ${admissionId} (${programName})`,
      performedBy: 'SYSTEM',
      ipAddress: 'internal'
    });
  });

  eventBus.on(EVENTS.PAYMENT_COMPLETED, async (payload) => {
    const { applicantId, amount, invoiceId } = payload;
    const io = getIO();
    
    if (applicantId) {
      io.to(`user_${applicantId}`).emit('notification', {
        title: 'Payment Successful',
        message: `We received your payment of $${amount}. Thank you!`,
        type: 'success',
      });
      io.to(`user_${applicantId}`).emit('invalidate_queries', ['student_invoices', 'student_courses', 'my-profile']);
      
      // Update User lifecycle stage to active_learner
      await User.findOneAndUpdate(
        { _id: applicantId, lifecycleStage: { $in: ['admitted', 'applicant'] } },
        { lifecycleStage: 'active_learner' }
      );
    }

    // Update Admin Revenue KPI instantly
    io.to('admin_room').emit('ADMIN_ANALYTICS_UPDATED', {
      type: EVENTS.PAYMENT_COMPLETED,
      message: `New payment received: $${amount}`
    });

    await AuditLog.create({
      action: EVENTS.PAYMENT_COMPLETED,
      details: `Payment of $${amount} received for invoice ${invoiceId}`,
      performedBy: applicantId || 'SYSTEM',
      ipAddress: 'internal'
    });
  });
};
