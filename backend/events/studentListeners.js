import { eventBus, EVENTS } from '../utils/eventBus.js';
import { getIO } from '../utils/socket.js';
import { logger } from '../utils/logger.js';
import AuditLog from '../models/AuditLog.js';
import { User } from '../models/User.js';

export const registerStudentListeners = () => {
  eventBus.on(EVENTS.PROFILE_UPDATED, async (payload) => {
    const { userId, score } = payload;
    const io = getIO();
    io.to(`user_${userId}`).emit('notification', {
      title: 'Profile Updated',
      message: 'Your profile has been successfully updated.',
      type: 'success',
    });
    
    await AuditLog.create({
      action: EVENTS.PROFILE_UPDATED,
      details: `User ${userId} updated profile. Profile Score: ${score}`,
      performedBy: userId,
      ipAddress: 'internal'
    });
  });

  eventBus.on(EVENTS.STUDENT_CREATED, async (payload) => {
    const { userId, email } = payload;
    const io = getIO();
    
    // Welcome Notification
    io.to(`user_${userId}`).emit('notification', {
      title: 'Welcome to Tejas Academy!',
      message: 'Your student account has been successfully created.',
      type: 'success',
    });

    await AuditLog.create({
      action: EVENTS.STUDENT_CREATED,
      details: `New student account created for ${email}`,
      performedBy: 'SYSTEM',
      ipAddress: 'internal'
    });
  });

  eventBus.on(EVENTS.PROGRAM_COMPLETED, async (payload) => {
    const { studentId, programName } = payload;
    const io = getIO();
    
    // Notification
    io.to(`user_${studentId}`).emit('notification', {
      title: 'Congratulations Alumni!',
      message: `You have successfully completed ${programName}. Welcome to the Alumni Network!`,
      type: 'success',
    });
    
    io.to(`user_${studentId}`).emit('invalidate_queries', ['my-profile']);
    
    // Update lifecycleStage to alumni
    await User.findByIdAndUpdate(studentId, { lifecycleStage: 'alumni' });

    await AuditLog.create({
      action: EVENTS.PROGRAM_COMPLETED,
      details: `Student ${studentId} completed program ${programName}`,
      performedBy: 'SYSTEM',
      ipAddress: 'internal'
    });
  });
};
