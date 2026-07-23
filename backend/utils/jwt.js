import jwt from 'jsonwebtoken';

/**
 * Generates an Access Token
 * Lifespan: 15 minutes
 */
export const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'fallback_secret_key_change_me_in_prod',
    { expiresIn: '15m' }
  );
};

/**
 * Generates a Refresh Token
 * Lifespan: 7 days
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_key_change_me',
    { expiresIn: '7d' }
  );
};

/**
 * Verifies any JWT token
 */
export const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};
