import { Admission } from '../models/Admission.js';
import { User } from '../models/User.js';
import { AppError } from '../middlewares/errorHandler.js';
import { eventBus, EVENTS } from '../utils/eventBus.js';
import * as XLSX from 'xlsx';

// Helper to normalize application payload
const normalizeAdmissionPayload = (body, user) => {
  const fullName = body.personalDetails?.fullName || 
    body.fullName || 
    (body.firstName && body.lastName ? `${body.firstName} ${body.lastName}`.trim() : (body.firstName || user?.name || 'Applicant'));
  
  const phone = body.personalDetails?.phone || body.phone || body.phoneNumber || user?.phone || user?.phoneNumber || 'Not Provided';
  const address = body.personalDetails?.address || body.address || 'Not Provided';
  const gender = body.personalDetails?.gender || body.gender || 'other';
  const dateOfBirth = body.personalDetails?.dateOfBirth || body.dateOfBirth || new Date();

  const highestDegree = body.educationDetails?.highestDegree || body.highestDegree || 'Secondary / High School';
  const institution = body.educationDetails?.institution || body.prevSchool || body.institution || 'Not Specified';
  const yearOfPassing = body.educationDetails?.yearOfPassing || body.yearOfPassing || new Date().getFullYear();
  const percentageOrCGPA = body.educationDetails?.percentageOrCGPA || body.grade || body.percentageOrCGPA || 'N/A';

  const program = body.program || body.programName || body.selectedProgram || 'General Admissions';

  return {
    ...body,
    program,
    personalDetails: {
      fullName,
      phone,
      address,
      gender,
      dateOfBirth,
    },
    educationDetails: {
      highestDegree,
      institution,
      yearOfPassing: Number(yearOfPassing) || new Date().getFullYear(),
      percentageOrCGPA: String(percentageOrCGPA),
    }
  };
};

// @desc    Submit a new admission application
// @route   POST /api/v1/admissions
// @access  Private or Public (auto-links if user logged in)
export const createAdmission = async (req, res, next) => {
  try {
    let applicantId = req.user?.id;

    // If user is not logged in but provided an email, find or create student user
    if (!applicantId && (req.body.email || req.body.personalDetails?.email)) {
      const email = (req.body.email || req.body.personalDetails?.email).toLowerCase().trim();
      let existingUser = await User.findOne({ email });
      if (!existingUser) {
        const name = req.body.fullName || 
          (req.body.firstName ? `${req.body.firstName} ${req.body.lastName || ''}`.trim() : 'New Applicant');
        const phone = req.body.phone || req.body.phoneNumber || '';
        // Create an active student record with a random secure initial password
        existingUser = await User.create({
          name,
          email,
          phone,
          phoneNumber: phone,
          role: 'student',
          status: 'active',
          password: Math.random().toString(36).slice(-10) + 'Aa1!'
        });
      }
      applicantId = existingUser._id;
    }

    if (!applicantId) {
      return next(new AppError('Applicant information or login is required to apply', 400));
    }

    const normalizedData = normalizeAdmissionPayload(req.body, req.user);
    normalizedData.applicant = applicantId;
    normalizedData.studentId = applicantId;

    // Check if the user already has an active application for this same program
    const existingApp = await Admission.findOne({
      applicant: applicantId,
      program: normalizedData.program,
      status: { $in: ['submitted', 'under_review', 'interview_scheduled'] }
    });

    if (existingApp) {
      return res.status(200).json({
        success: true,
        message: 'You already have an active application in progress for this program.',
        data: existingApp,
      });
    }

    const application = await Admission.create(normalizedData);

    // Emit event
    eventBus.emit(EVENTS.ADMISSION_SUBMITTED, {
      applicantId,
      programName: application.program,
      admissionId: application._id,
      applicationId: application.applicationId
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
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
    const applications = await Admission.find({ applicant: req.user.id })
      .sort('-createdAt')
      .lean();

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

    const { search, status, program, startDate, endDate } = req.query;

    const match = {};
    if (status) match.status = status;
    if (program) match.program = { $regex: program, $options: 'i' };

    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
    }

    if (search) {
      match.$or = [
        { applicationId: { $regex: search, $options: 'i' } },
        { program: { $regex: search, $options: 'i' } },
        { 'personalDetails.fullName': { $regex: search, $options: 'i' } },
        { 'personalDetails.phone': { $regex: search, $options: 'i' } }
      ];
    }

    const applications = await Admission.find(match)
      .populate('applicant', 'name email phone phoneNumber')
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
      .populate('applicant', 'name email phone phoneNumber');

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

// @desc    Update admission status & notes
// @route   PUT /api/v1/admissions/:id/status
// @access  Private/Admin
export const updateAdmissionStatus = async (req, res, next) => {
  try {
    const originalApplication = await Admission.findById(req.params.id);
    if (!originalApplication) {
      return next(new AppError('Application not found', 404));
    }
    
    const oldStatus = originalApplication.status;
    const updateData = {};
    if (req.body.status) updateData.status = req.body.status;
    if (req.body.applicationStatus) updateData.applicationStatus = req.body.applicationStatus;
    if (req.body.reviewNotes !== undefined) updateData.reviewNotes = req.body.reviewNotes;
    if (req.body.counselorNotes !== undefined) updateData.counselorNotes = req.body.counselorNotes;
    if (req.body.paymentStatus) updateData.paymentStatus = req.body.paymentStatus;

    const application = await Admission.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    // Emit events based on new status
    if (application.status === 'accepted') {
      eventBus.emit(EVENTS.APPLICATION_APPROVED, {
        admissionId: application._id,
        applicantId: application.applicant,
        programName: application.program
      });
    } else if (application.status === 'rejected') {
      eventBus.emit(EVENTS.APPLICATION_REJECTED, {
        admissionId: application._id,
        applicantId: application.applicant,
        programName: application.program
      });
    } else if (oldStatus !== application.status) {
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

// @desc    Export admissions to Excel (.xlsx)
// @route   GET /api/v1/admissions/export/excel
// @access  Private/Admin
export const exportAdmissionsExcel = async (req, res, next) => {
  try {
    const { status, program, search, startDate, endDate } = req.query;

    const match = {};
    if (status) match.status = status;
    if (program) match.program = { $regex: program, $options: 'i' };

    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
    }

    if (search) {
      match.$or = [
        { applicationId: { $regex: search, $options: 'i' } },
        { program: { $regex: search, $options: 'i' } },
        { 'personalDetails.fullName': { $regex: search, $options: 'i' } },
        { 'personalDetails.phone': { $regex: search, $options: 'i' } }
      ];
    }

    const applications = await Admission.find(match)
      .populate('applicant', 'name email phone phoneNumber')
      .sort('-createdAt')
      .lean();

    const formattedData = applications.map((app, index) => ({
      'S.No': index + 1,
      'Application ID': app.applicationId || `APP-${String(app._id).substring(0, 8)}`,
      'Applicant Name': app.personalDetails?.fullName || app.applicant?.name || 'N/A',
      'Email': app.applicant?.email || 'N/A',
      'Phone': app.personalDetails?.phone || app.applicant?.phone || app.applicant?.phoneNumber || 'N/A',
      'Program Applied': app.program || 'N/A',
      'Status': (app.status || 'submitted').toUpperCase().replace('_', ' '),
      'Payment Status': (app.paymentStatus || 'pending').toUpperCase(),
      'Previous Institution': app.educationDetails?.institution || 'N/A',
      'Grade / Score': app.educationDetails?.percentageOrCGPA || 'N/A',
      'Highest Degree': app.educationDetails?.highestDegree || 'N/A',
      'Year of Passing': app.educationDetails?.yearOfPassing || 'N/A',
      'Counselor Notes': app.counselorNotes || app.reviewNotes || '',
      'Date Applied': app.createdAt ? new Date(app.createdAt).toLocaleString('en-IN') : 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Auto-fit column widths
    const columnWidths = [
      { wch: 6 },  // S.No
      { wch: 22 }, // Application ID
      { wch: 24 }, // Applicant Name
      { wch: 28 }, // Email
      { wch: 16 }, // Phone
      { wch: 32 }, // Program Applied
      { wch: 18 }, // Status
      { wch: 16 }, // Payment Status
      { wch: 28 }, // Previous Institution
      { wch: 14 }, // Grade / Score
      { wch: 22 }, // Highest Degree
      { wch: 16 }, // Year of Passing
      { wch: 30 }, // Counselor Notes
      { wch: 22 }, // Date Applied
    ];
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Admissions');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="tejas_admissions_${new Date().toISOString().split('T')[0]}.xlsx"`);
    res.status(200).send(excelBuffer);
  } catch (error) {
    next(error);
  }
};
