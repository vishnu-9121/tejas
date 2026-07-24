import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

/**
 * Global Rate Limiter
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    data: null,
    pagination: null,
    errors: null,
    timestamp: new Date().toISOString()
  }
});

/**
 * Auth Rate Limiter
 * Increased max limit to prevent 429 errors during testing/development.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 30 : 500, // 500 requests in dev mode
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
    data: null,
    pagination: null,
    errors: null,
    timestamp: new Date().toISOString()
  }
});

/**
 * Configure Helmet with custom policies
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "res.cloudinary.com", "https://images.unsplash.com"],
      connectSrc: ["'self'", "https://api.cloudinary.com", "http://localhost:*", "http://127.0.0.1:*"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

/**
 * CORS Configuration supporting all local development ports and production domain
 */
export const corsOptions = cors({
  origin: function (origin, callback) {
    // Always allow requests without origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    const defaultProductionOrigins = ['https://unlocktejas.com', 'https://www.unlocktejas.com'];
    const configuredOrigins = (process.env.CLIENT_URL || process.env.FRONTEND_URL || '')
      .split(',')
      .map(o => o.trim())
      .filter(Boolean);

    const allowedOrigins = Array.from(new Set([...defaultProductionOrigins, ...configuredOrigins]));

    // Check if origin matches production whitelist or any local development origin
    const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

    if (process.env.NODE_ENV === 'production') {
      if (allowedOrigins.includes(origin) || isLocalhost) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS in production: ${origin}`));
      }
    } else {
      // In development mode, allow all localhost/127.0.0.1 ports and configured origins
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
});

/**
 * Global API Timeout Handler
 */
export const timeoutHandler = (req, res, next) => {
  req.setTimeout(30000, () => {
    const err = new Error('Request Timeout');
    err.status = 408;
    next(err);
  });
  
  res.setTimeout(30000, () => {
    const err = new Error('Service Unavailable - Timeout');
    err.status = 503;
    next(err);
  });
  
  next();
};
