import { verifyToken } from '../utils/jwt.js';
import { AppError } from './errorHandler.js';

/**
 * Protect routes - verify JWT token
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Not authorized to access this route', 401));
    }

    try {
      const decoded = verifyToken(token, process.env.JWT_SECRET || 'fallback_secret_key_change_me_in_prod');
      req.user = decoded; // Contains id and role
      next();
    } catch (err) {
      return next(new AppError('Not authorized to access this route', 401));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Grant access to specific roles (RBAC)
 * @param  {...String} roles - Array of roles allowed (e.g. 'admin', 'super_admin')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(`User role ${req.user?.role} is not authorized to access this route`, 403));
    }
    next();
  };
};

export const restrictTo = authorize;

/**
 * Optional authentication - attaches req.user if token is valid, but allows unauthenticated access
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      try {
        const decoded = verifyToken(token, process.env.JWT_SECRET || 'fallback_secret_key_change_me_in_prod');
        req.user = decoded;
      } catch (err) {
        // Ignore invalid token for optional auth
      }
    }
    next();
  } catch (error) {
    next();
  }
};

