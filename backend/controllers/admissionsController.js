import { Admission } from '../models/Admission.js';
import { AppError } from '../middlewares/errorHandler.js';
import { eventBus, EVENTS } from '../utils/eventBus.js';

// @desc    Submit a new admission application
// @route   POST /api/v1/admissions
// @access  Private (Any logged-in user)
export const createAdmission = async (req, res, next) => {
  try {
    // Inject logged in user ID as the applicant
    req.body.applicant = req.user.id;

    // Check if the user already has an active application
    const existingApp = await Admission.findOne({
      applicant: req.user.id,
      status: { $ne: 'rejected' } // allow re-applying if rejected, else no.
    });

    if (existingApp) {
      return next(new AppError('You already have an active application in progress.', 400));
    }

    const application = await Admission.create(req.body);

    // Emit event
    eventBus.emit(EVENTS.ADMISSION_SUBMITTED, {
      applicantId: req.user.id,
      programName: application.program,
      admissionId: application._id
    });

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's own applications
// @route   GET /api/v1/admissions/my-applications
// @access  Private
export const getMyAdmissions = async (req, res, next) => {
  try {
    const applications = await Admission.find({ applicant: req.user.id }).sort('-createdAt').lean();

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all admissions (with pagination, search, filters)
// @route   GET /api/v1/admissions
// @access  Private/Admin
export const getAdmissions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, status, program } = req.query;

    const match = {};
    if (status) match.status = status;
    if (program) match.program = program;

    if (search) {
      match.$or = [
        { applicationId: { $regex: search, $options: 'i' } },
        { 'personalDetails.fullName': { $regex: search, $options: 'i' } }
      ];
    }

    const applications = await Admission.find(match)
      .populate('applicant', 'name email')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt')
      .lean();

    const total = await Admission.countDocuments(match);

    res.status(200).json({
      success: true,
      data: {
        admissions: applications,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admission statistics
// @route   GET /api/v1/admissions/stats
// @access  Private/Admin
export const getAdmissionStats = async (req, res, next) => {
  try {
    const stats = await Admission.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Admission.countDocuments();

    // Format stats into an object
    const formattedStats = stats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, { total });

    res.status(200).json({
      success: true,
      data: formattedStats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admission by ID
// @route   GET /api/v1/admissions/:id
// @access  Private/Admin
export const getAdmissionById = async (req, res, next) => {
  try {
    const application = await Admission.findById(req.params.id)
      .populate('applicant', 'name email');

    if (!application) {
      return next(new AppError('Application not found', 404));
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update admission status
// @route   PUT /api/v1/admissions/:id/status
// @access  Private/Admin
export const updateAdmissionStatus = async (req, res, next) => {
  try {
    const originalApplication = await Admission.findById(req.params.id);
    if (!originalApplication) {
      return next(new AppError('Application not found', 404));
    }
    
    const oldStatus = originalApplication.status;

    const application = await Admission.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    // Emit events based on new status
    if (application.status === 'Accepted') {
      eventBus.emit(EVENTS.APPLICATION_APPROVED, {
        admissionId: application._id,
        applicantId: application.applicant,
        programName: application.program
      });
    } else if (application.status === 'Rejected') {
      eventBus.emit(EVENTS.APPLICATION_REJECTED, {
        admissionId: application._id,
        applicantId: application.applicant,
        programName: application.program
      });
    } else {
      eventBus.emit(EVENTS.ADMISSION_STATUS_UPDATED, {
        admissionId: application._id,
        applicantId: application.applicant,
        oldStatus,
        newStatus: application.status,
        programName: application.program
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};
