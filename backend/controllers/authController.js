import * as authService from '../services/authService.js';
import { sendResponse } from '../helpers/responseFormatter.js';
import { HTTP_STATUS } from '../constants/index.js';
import { eventBus, EVENTS } from '../utils/eventBus.js';
import { EnterpriseAuditService } from '../services/EnterpriseAuditService.js';

// Cookie options for refresh tokens
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

export const register = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.registerService(req.body);
    
    res.cookie('refreshToken', refreshToken, cookieOptions);
    
    eventBus.emit(EVENTS.USER_REGISTERED, { userId: user._id, email: user.email, role: user.role });
    if (user.role === 'student' || user.role === 'user') {
      eventBus.emit(EVENTS.STUDENT_CREATED, { userId: user._id, email: user.email });
    }
    
    sendResponse(res, HTTP_STATUS.CREATED, 'Registration successful', { user, accessToken });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.loginService(email, password);
    
    res.cookie('refreshToken', refreshToken, cookieOptions);
    
    // Log user login in enterprise audit logs
    EnterpriseAuditService.logLogin(user, req, true);

    sendResponse(res, HTTP_STATUS.OK, 'Login successful', { user, accessToken });
  } catch (error) {
    EnterpriseAuditService.logLogin({ email: req.body.email }, req, false, error.message);
    next(error);
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;
    const { user, accessToken, refreshToken } = await authService.googleAuthService(credential);
    
    res.cookie('refreshToken', refreshToken, cookieOptions);
    
    sendResponse(res, HTTP_STATUS.OK, 'Google Login successful', { user, accessToken });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    const { accessToken, refreshToken } = await authService.refreshService(token);
    
    res.cookie('refreshToken', refreshToken, cookieOptions);
    
    sendResponse(res, HTTP_STATUS.OK, 'Token refreshed', { accessToken });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (token && req.user) {
      await authService.logoutService(req.user.id, token);
    }
    
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    
    sendResponse(res, HTTP_STATUS.OK, 'Logged out successfully', null);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return sendResponse(res, HTTP_STATUS.BAD_REQUEST, 'Please provide an email');
    }

    const result = await authService.forgotPasswordService(email);
    sendResponse(res, HTTP_STATUS.OK, 'Password reset OTP sent to email', { otp: result?.otp });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { otp, password } = req.body;
    if (!otp || !password) {
      return sendResponse(res, HTTP_STATUS.BAD_REQUEST, 'Please provide OTP and new password');
    }

    await authService.resetPasswordService(otp, password);
    sendResponse(res, HTTP_STATUS.OK, 'Password reset successful, please login with your new password', null);
  } catch (error) {
    next(error);
  }
};
