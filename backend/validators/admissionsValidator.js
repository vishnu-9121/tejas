import { body } from 'express-validator';
import { validateResult } from './authValidator.js';

export const applyAdmissionValidator = [
  body('program')
    .trim()
    .notEmpty()
    .withMessage('Please select or specify a program'),
  body('personalDetails.fullName')
    .optional()
    .trim(),
  body('personalDetails.phone')
    .optional()
    .trim(),
  body('phone')
    .optional()
    .trim(),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email'),
  validateResult,
];
