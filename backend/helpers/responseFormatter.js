/**
 * Standardizes all API responses across the enterprise backend.
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP Status Code
 * @param {String} message - Success or generic message
 * @param {Object|Array|null} data - Payload
 * @param {Object|null} pagination - Pagination info { total, page, limit, totalPages }
 * @param {Object|Array|null} errors - Error details
 */
export const sendResponse = (res, statusCode, message, data = null, pagination = null, errors = null) => {
  return res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
    pagination,
    errors,
    timestamp: new Date().toISOString(),
  });
};
