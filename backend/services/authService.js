import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/User.js';
import { AppError } from '../middlewares/errorHandler.js';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt.js';
import { sendEmail } from '../utils/emailService.js';
import { getPasswordResetTemplate } from '../templates/emailTemplates.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Handle user registration (Email/Password)
 */
export const registerService = async (userData) => {
  const { name, email, password } = userData;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError('User already exists', 400);
  }

  const user = await User.create({ name, email, password });
  
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  // Store refresh token in DB
  user.refreshTokens.push(refreshToken);
  await user.save();

  return { user, accessToken, refreshToken };
};

/**
 * Handle user login (Email/Password)
 */
export const loginService = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.matchPassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  // Add refresh token to DB array
  user.refreshTokens.push(refreshToken);
  await user.save({ validateBeforeSave: false });

  // Remove password from output
  user.password = undefined;

  return { user, accessToken, refreshToken };
};

/**
 * Handle Google OAuth Login/Registration
 */
export const googleAuthService = async (googleToken) => {
  if (!googleToken) {
    throw new AppError('Google token is required', 400);
  }

  // Verify token with Google
  const ticket = await client.verifyIdToken({
    idToken: googleToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  
  const payload = ticket.getPayload();
  const { email, name, sub: googleId, email_verified } = payload;

  if (!email_verified) {
    throw new AppError('Google email is not verified', 400);
  }

  let user = await User.findOne({ email });

  if (!user) {
    // Register the user automatically
    user = await User.create({
      name,
      email,
      googleId,
      isVerified: true,
      // Default to Super Admin if it's the main admin email
      role: email === 'vishnu24.igm@gmail.com' ? 'super_admin' : 'user'
    });
  } else {
    // Link google account if not linked
    if (!user.googleId) {
      user.googleId = googleId;
      await user.save({ validateBeforeSave: false });
    }
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshTokens.push(refreshToken);
  await user.save({ validateBeforeSave: false });

  return { user, accessToken, refreshToken };
};

/**
 * Handle Token Refresh
 */
export const refreshService = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError('Not authorized, no refresh token', 401);
  }

  try {
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_key_change_me');
    
    const user = await User.findById(decoded.id);
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      throw new AppError('Invalid refresh token', 401);
    }

    // Optional: Rotate the refresh token
    const newAccessToken = generateAccessToken(user._id, user.role);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshTokens = user.refreshTokens.filter(rt => rt !== refreshToken);
    user.refreshTokens.push(newRefreshToken);
    await user.save({ validateBeforeSave: false });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw new AppError('Not authorized, token failed', 401);
  }
};

/**
 * Handle Logout
 */
export const logoutService = async (userId, refreshToken) => {
  const user = await User.findById(userId);
  if (user) {
    user.refreshTokens = user.refreshTokens.filter(rt => rt !== refreshToken);
    await user.save({ validateBeforeSave: false });
  }
};

/**
 * Handle Forgot Password
 */
export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError('There is no user with that email', 404);
  }

  // Get reset token (OTP)
  const otp = user.getResetPasswordOtp();

  await user.save({ validateBeforeSave: false });

  // Create reset url (if you want to use links instead of OTP, but the user requested OTP Verification)
  const message = getPasswordResetTemplate(user.firstName || 'User', otp);

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset OTP',
      message,
    });
    return true;
  } catch (error) {
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw new AppError('Email could not be sent', 500);
  }
};

/**
 * Handle Reset Password using OTP
 */
export const resetPasswordService = async (otp, newPassword) => {
  // Get hashed OTP
  const resetPasswordOtp = crypto.createHash('sha256').update(otp).digest('hex');

  const user = await User.findOne({
    resetPasswordOtp,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+password +passwordHistory');

  if (!user) {
    throw new AppError('Invalid or expired OTP', 400);
  }

  // Check password history (must not be one of the last 3 passwords)
  // user.matchPassword logic uses bcrypt.compare
  if (user.passwordHistory && user.passwordHistory.length > 0) {
    for (const oldHash of user.passwordHistory) {
      const isMatch = await bcrypt.compare(newPassword, oldHash);
      if (isMatch) {
        throw new AppError('You cannot reuse any of your last 3 passwords', 400);
      }
    }
  }

  // Set new password (the pre-save hook will hash it and append to history)
  user.password = newPassword;
  user.resetPasswordOtp = undefined;
  user.resetPasswordExpire = undefined;
  
  // Wipe refresh tokens so they are forced to log in again across all devices
  user.refreshTokens = [];

  await user.save();
  return true;
};
