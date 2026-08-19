import { verifyToken } from '../utils/jwt.js';
import { AppError } from './errorHandler.js';
import { User } from '../models/User.js';

/**
 * Protect routes - verify JWT token and fetch active user
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      token = req.query.token;
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new AppError('Not authorized to access this resource. Please sign in or create an account.', 401));
    }

    try {
      const jwtSecret = process.env.JWT_SECRET || (process.env.NODE_ENV !== 'production' ? 'dev_jwt_secret_key_tejas_academy_2026' : null);
      if (!jwtSecret) {
        return next(new AppError('Server authentication configuration error. JWT secret missing.', 500));
      }
      const decoded = verifyToken(token, jwtSecret);
      const currentUser = await User.findById(decoded.id).select('-password');
      
      if (!currentUser) {
        return next(new AppError('The user belonging to this token no longer exists.', 401));
      }

      req.user = currentUser;
      next();
    } catch (err) {
      return next(new AppError('Invalid or expired authentication token. Please sign in again.', 401));
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
      return next(new AppError(`User role ${req.user?.role} is not authorized to access this resource`, 403));
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
    } else if (req.query && req.query.token) {
      token = req.query.token;
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const jwtSecret = process.env.JWT_SECRET || (process.env.NODE_ENV !== 'production' ? 'dev_jwt_secret_key_tejas_academy_2026' : null);
        if (jwtSecret) {
          const decoded = verifyToken(token, jwtSecret);
          const currentUser = await User.findById(decoded.id).select('-password');
          if (currentUser) {
            req.user = currentUser;
          }
        }
      } catch (err) {
        // Ignore invalid token for optional auth
      }
    }
    next();
  } catch (error) {
    next();
  }
};

export default { protect, authorize, restrictTo, optionalAuth };
