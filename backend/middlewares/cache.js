import NodeCache from 'node-cache';
import { sendResponse } from '../helpers/responseFormatter.js';
import { HTTP_STATUS } from '../constants/index.js';

// Cache for 5 minutes by default
const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

export const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return sendResponse(res, HTTP_STATUS.OK, 'Data fetched from cache successfully', cachedResponse);
    } else {
      // Overwrite res.json to intercept the response before sending it
      const originalJson = res.json;
      res.json = (body) => {
        // Only cache successful responses (where body.success is true and body.data exists)
        if (body && body.success && body.data) {
          cache.set(key, body.data, duration || 300);
        }
        originalJson.call(res, body);
      };
      next();
    }
  };
};

export const clearCache = (prefix) => {
  const keys = cache.keys();
  const keysToDelete = keys.filter(key => key.startsWith(prefix));
  cache.del(keysToDelete);
};
