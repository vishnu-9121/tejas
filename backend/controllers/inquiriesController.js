import { Inquiry } from '../models/Inquiry.js';
import { AppError } from '../middlewares/errorHandler.js';
import { eventBus } from '../utils/eventBus.js';

// @desc    Create a new inquiry (Public Contact Form)
// @route   POST /api/v1/inquiries
// @access  Public
export const createInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.create(req.body);

    eventBus.emit('NEW_INQUIRY', inquiry);

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted successfully.',
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all inquiries
// @route   GET /api/v1/inquiries
// @access  Private/Admin
export const getInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find().sort('-createdAt').populate('assignedTo', 'name').lean();

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inquiry status
// @route   PUT /api/v1/inquiries/:id
// @access  Private/Admin
export const updateInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return next(new AppError('Inquiry not found', 404));
    }

    if (inquiry.status === 'converted') {
      eventBus.emit('LEAD_CONVERTED', inquiry);
    } else {
      eventBus.emit('INQUIRY_UPDATED', inquiry);
    }

    res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};
