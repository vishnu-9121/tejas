import { eventBus } from '../utils/eventBus.js';
import { NotificationService } from './NotificationService.js';
import { User } from '../models/User.js';

export function setupNotificationSubscribers() {
  
  // ---------------------------------------------------------
  // 1. Admission Events
  // ---------------------------------------------------------
  eventBus.on('ApplicationSubmitted', async (application) => {
    // Notify the student
    await NotificationService.dispatch({
      recipientId: application.student,
      title: 'Application Received',
      message: 'We have received your application. It is currently under review.',
      type: 'success',
      channels: ['in-app', 'email']
    });

    // Notify all admissions admins
    const admins = await User.find({ role: 'admin' });
    admins.forEach(admin => {
      NotificationService.dispatch({
        recipientId: admin._id,
        title: 'New Application Submitted',
        message: `A new application has been submitted for ${application.program}.`,
        type: 'info',
        channels: ['in-app'],
        actionLink: `/admin/admissions`
      });
    });

    // Record Activity
    NotificationService.recordActivity({
      action: 'ApplicationSubmitted',
      performedBy: application.student,
      entityType: 'Application',
      entityId: application._id,
      details: 'A student submitted a new application.',
      severity: 'info'
    });
  });

  // ---------------------------------------------------------
  // 2. Financial Events
  // ---------------------------------------------------------
  eventBus.on('PaymentCompleted', async (paymentData) => {
    // Notify the student
    await NotificationService.dispatch({
      recipientId: paymentData.studentId,
      title: 'Payment Successful',
      message: 'Your payment was processed successfully. You now have access to your courses.',
      type: 'success',
      channels: ['in-app', 'email', 'whatsapp'] // Premium experience
    });

    // Record Activity
    NotificationService.recordActivity({
      action: 'PaymentCompleted',
      performedBy: paymentData.studentId,
      entityType: 'Payment',
      entityId: paymentData.transactionId,
      details: `Payment of $${paymentData.amount} received.`,
      severity: 'success'
    });
  });

  // ---------------------------------------------------------
  // 3. System Error Events
  // ---------------------------------------------------------
  eventBus.on('SystemError', async (errorData) => {
    // Notify super admins immediately
    const superAdmins = await User.find({ role: 'super_admin' });
    superAdmins.forEach(admin => {
      NotificationService.dispatch({
        recipientId: admin._id,
        title: 'Critical System Error',
        message: `Error encountered: ${errorData.message}`,
        type: 'error',
        channels: ['in-app', 'email']
      });
    });

    NotificationService.recordActivity({
      action: 'SystemError',
      performedBy: 'SYSTEM',
      entityType: 'Error',
      details: errorData.message,
      severity: 'critical',
      metadata: errorData
    });
  });

  console.log('✅ Notification Engine Subscribers initialized.');
}
