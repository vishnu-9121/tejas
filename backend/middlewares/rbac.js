import { AppError } from "./errorHandler.js";
import { HTTP_STATUS } from "../constants/index.js";

/**
 * Role-Based Access Control middleware.
 * Must be used AFTER the `protect` (auth) middleware so that `req.user` is populated.
 * 
 * @param  {...string} roles - Spread array of allowed roles
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("User not found in request. Missing auth middleware.", HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`Role (${req.user.role}) is not allowed to access this resource`, HTTP_STATUS.FORBIDDEN)
      );
    }
    next();
  };
};
