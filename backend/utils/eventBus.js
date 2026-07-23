import EventEmitter from 'events';

class GlobalEventBus extends EventEmitter {
  // Override emit to provide robust error handling (prevents unhandled rejections from crashing the app)
  emit(event, ...args) {
    try {
      const listeners = this.listeners(event);
      if (listeners.length === 0) {
        console.warn(`[EventBus] No listeners registered for event: ${event}`);
      }
      // Execute each listener in a try-catch block
      listeners.forEach(listener => {
        try {
          const result = listener(...args);
          if (result instanceof Promise) {
            result.catch(err => {
              console.error(`[EventBus] Async Error in listener for ${event}:`, err);
            });
          }
        } catch (err) {
          console.error(`[EventBus] Sync Error in listener for ${event}:`, err);
        }
      });
      return true; // We handled it manually
    } catch (err) {
      console.error(`[EventBus] Critical Error emitting event ${event}:`, err);
      return false;
    }
  }
}

export const eventBus = new GlobalEventBus();

// Core Domain Events Dictionary
export const EVENTS = {
  // Admissions Lifecycle
  APPLICATION_SUBMITTED: 'APPLICATION_SUBMITTED',
  APPLICATION_APPROVED: 'APPLICATION_APPROVED',
  APPLICATION_REJECTED: 'APPLICATION_REJECTED',
  
  // Student & IAM Lifecycle
  STUDENT_CREATED: 'STUDENT_CREATED',
  USER_REGISTERED: 'USER_REGISTERED',
  PROFILE_UPDATED: 'PROFILE_UPDATED',
  
  // Academic Lifecycle
  PROGRAM_CREATED: 'PROGRAM_CREATED',
  COURSE_PUBLISHED: 'COURSE_PUBLISHED',
  ASSIGNMENT_SUBMITTED: 'ASSIGNMENT_SUBMITTED',
  CERTIFICATE_ISSUED: 'CERTIFICATE_ISSUED',
  FACULTY_ADDED: 'FACULTY_ADDED',
  
  // Financial Lifecycle
  PAYMENT_COMPLETED: 'PAYMENT_COMPLETED',
  INVOICE_GENERATED: 'INVOICE_GENERATED',
  
  // Operations & Engagement
  CONTENT_PUBLISHED: 'CONTENT_PUBLISHED',
  EVENT_CREATED: 'EVENT_CREATED',
  BLOG_PUBLISHED: 'BLOG_PUBLISHED',
};
