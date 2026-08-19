/**
 * Navigation & Role-based Routing Helpers
 * Tejas Academy of Excellence
 */

/**
 * Resolves the primary dashboard route based on user role.
 * @param {string} [role] - User role ('super_admin', 'admin', 'faculty', 'mentor', 'student', 'user')
 * @returns {string} Target dashboard URL path
 */
export const getDashboardRoute = (role) => {
  if (!role) return '/dashboard';
  const normalized = String(role).toLowerCase().trim();
  
  if (['admin', 'super_admin', 'operations_manager'].includes(normalized)) {
    return '/admin';
  }
  if (['faculty', 'mentor'].includes(normalized)) {
    return '/faculty';
  }
  return '/dashboard';
};

/**
 * Returns human-readable label for user dashboard navigation link based on role.
 * @param {string} [role] - User role
 * @returns {string} Dashboard link text
 */
export const getDashboardLabel = (role) => {
  if (!role) return 'My Dashboard';
  const normalized = String(role).toLowerCase().trim();
  
  if (['admin', 'super_admin', 'operations_manager'].includes(normalized)) {
    return 'Admin Panel';
  }
  if (['faculty', 'mentor'].includes(normalized)) {
    return 'Faculty Portal';
  }
  return 'Student Dashboard';
};

export default {
  getDashboardRoute,
  getDashboardLabel
};
