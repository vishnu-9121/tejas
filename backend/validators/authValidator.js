import { body, validationResult } from 'express-validator';
import { sendResponse } from '../helpers/responseFormatter.js';
import { HTTP_STATUS } from '../constants/index.js';

export const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, errorMessages[0] || 'Validation Error', null, null, errorMessages);
  }
  next();
};

export const registerValidator = [
  body('name')
    .custom((val, { req }) => {
      const nameVal = val || req.body.fullName;
      if (!nameVal || typeof nameVal !== 'string' || nameVal.trim().length < 2) {
        throw new Error('Name is required (at least 2 characters)');
      }
      if (!req.body.name && req.body.fullName) {
        req.body.name = req.body.fullName;
      }
      return true;
    }),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail({ gmail_remove_dots: false, gmail_remove_subaddress: false }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .optional()
    .trim(),
  body('phoneNumber')
    .optional()
    .trim(),
  validateResult,
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail({ gmail_remove_dots: false, gmail_remove_subaddress: false }),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validateResult,
];
