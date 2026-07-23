import { body } from 'express-validator';
import { validateResult } from './authValidator.js';

export const applyAdmissionValidator = [
  body('personalDetails.fullName').trim().notEmpty().withMessage('Full name is required'),
  body('personalDetails.dateOfBirth').notEmpty().withMessage('Date of birth is required').isISO8601().withMessage('Valid date is required'),
  body('personalDetails.gender').isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
  body('personalDetails.phone').trim().notEmpty().withMessage('Phone is required').isLength({ min: 10 }).withMessage('Phone must be at least 10 digits'),
  body('personalDetails.address').trim().notEmpty().withMessage('Address is required'),
  body('educationDetails.highestDegree').trim().notEmpty().withMessage('Highest degree is required'),
  body('educationDetails.institution').trim().notEmpty().withMessage('Institution is required'),
  body('educationDetails.yearOfPassing').isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Valid year of passing required'),
  body('educationDetails.percentageOrCGPA').trim().notEmpty().withMessage('Percentage/CGPA is required'),
  body('program').trim().notEmpty().withMessage('Program is required'),
  validateResult,
];
