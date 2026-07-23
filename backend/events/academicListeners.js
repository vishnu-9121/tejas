import { eventBus, EVENTS } from '../utils/eventBus.js';
import { getIO } from '../utils/socket.js';
import { logger } from '../utils/logger.js';
import AuditLog from '../models/AuditLog.js';

export const registerAcademicListeners = () => {
  eventBus.on(EVENTS.ASSIGNMENT_SUBMITTED, async (payload) => {
    const { assignmentId, studentId, courseId } = payload;
    logger.info(`[Event] Assignment ${assignmentId} submitted by ${studentId}`);
    
    const io = getIO();
    
    // Notify Faculty Dashboard
    io.to('faculty_room').emit('FACULTY_DASHBOARD_UPDATED', {
      type: EVENTS.ASSIGNMENT_SUBMITTED,
      message: `New assignment submission for course ${courseId}`
    });

    // Notify Student
    io.to(`user_${studentId}`).emit('notification', {
      title: 'Assignment Submitted',
      message: 'Your assignment has been successfully submitted for grading.',
      type: 'success',
    });

    await AuditLog.create({
      action: EVENTS.ASSIGNMENT_SUBMITTED,
      details: `Assignment ${assignmentId} submitted for course ${courseId}`,
      performedBy: studentId,
      ipAddress: 'internal'
    });
  });
};
