import { registerAdmissionListeners } from './admissionListeners.js';
import { registerStudentListeners } from './studentListeners.js';
import { registerAdminListeners } from './adminListeners.js';
import { registerAcademicListeners } from './academicListeners.js';
import { registerFinancialListeners } from './financialListeners.js';
import { setupNotificationSubscribers } from '../services/NotificationSubscribers.js';

export const registerAllEventHandlers = () => {
  registerAdmissionListeners();
  registerStudentListeners();
  registerAdminListeners();
  registerAcademicListeners();
  registerFinancialListeners();
  setupNotificationSubscribers();
  console.log('[EventBus] All Domain Event Listeners (Admissions, Student, Admin, Academic, Financial, Notifications) successfully registered.');
};
