import express from 'express';
import { register, login, googleLogin, refresh, logout, forgotPassword, resetPassword } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';
import { authLimiter } from '../middlewares/security.js';
import { registerValidator, loginValidator } from '../validators/authValidator.js';

const router = express.Router();

// Public Auth Routes
router.post('/register', authLimiter, registerValidator, register);
router.post('/login', authLimiter, loginValidator, login);
router.post('/google', authLimiter, googleLogin);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);
router.post('/reset-password/:token', authLimiter, resetPassword);
router.post('/refresh', refresh);

// Protected Auth Routes
router.post('/logout', protect, logout);

export { router as authRoutes };
