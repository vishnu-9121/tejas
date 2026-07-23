import { StudentProfile } from '../models/StudentProfile.js';
import { User } from '../models/User.js';
import { AppError } from '../middlewares/errorHandler.js';
import { sendResponse } from '../helpers/responseFormatter.js';
import { HTTP_STATUS } from '../constants/index.js';
import bcrypt from 'bcryptjs';

// Get all students with pagination, search, and filters
export const getStudents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, status, program } = req.query;

    // Build Match Object
    const match = {};
    if (status) match.status = status;
    if (program) match['academicInfo.program'] = program;

    // Search by studentId
    if (search) {
      match.$or = [
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }

    // Find profiles that match initial criteria
    let query = StudentProfile.find(match)
      .populate({
        path: 'user',
        select: 'name email role isVerified',
        match: search ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        } : undefined
      })
      .populate('academicInfo.program', 'title slug');

    const rawStudents = await query.skip(skip).limit(limit).sort({ createdAt: -1 });

    // If we searched by user name/email, the populate match will return null for user if it doesn't match.
    // We need to filter out documents where user is null (if search was applied)
    const students = search 
      ? rawStudents.filter(s => s.user != null || match.$or) // keep if user matched OR studentId matched
      : rawStudents;

    const total = await StudentProfile.countDocuments(match); // Approximate count, complex search needs aggregation for exact

    sendResponse(res, HTTP_STATUS.OK, 'Students retrieved successfully', {
      students,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single student
export const getStudentById = async (req, res, next) => {
  try {
    const student = await StudentProfile.findById(req.params.id)
      .populate('user', 'name email role isVerified')
      .populate('academicInfo.program', 'title description')
      .populate('academicInfo.courses', 'title')
      .populate('notes.addedBy', 'name');

    if (!student) {
      throw new AppError('Student not found', 404);
    }

    sendResponse(res, HTTP_STATUS.OK, 'Student retrieved successfully', student);
  } catch (error) {
    next(error);
  }
};

// Create student
export const createStudent = async (req, res, next) => {
  try {
    const { name, email, password, personalInfo, contactInfo, guardianDetails, academicInfo } = req.body;

    // 1. Create User
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'student',
      isVerified: true
    });

    // 2. Generate Student ID (e.g., TAE-2026-0001)
    const year = new Date().getFullYear();
    const count = await StudentProfile.countDocuments();
    const studentId = `TAE-${year}-${String(count + 1).padStart(4, '0')}`;

    // 3. Create Student Profile
    const studentProfile = await StudentProfile.create({
      user: user._id,
      studentId,
      personalInfo,
      contactInfo,
      guardianDetails,
      academicInfo,
      timeline: [{
        title: 'Student Admitted',
        description: `Student account created and enrolled.`,
        type: 'administrative'
      }]
    });

    const populatedProfile = await StudentProfile.findById(studentProfile._id).populate('user', 'name email');

    sendResponse(res, HTTP_STATUS.CREATED, 'Student created successfully', populatedProfile);
  } catch (error) {
    next(error);
  }
};

// Update student
export const updateStudent = async (req, res, next) => {
  try {
    const { personalInfo, contactInfo, guardianDetails, academicInfo, status, notes } = req.body;
    
    const student = await StudentProfile.findById(req.params.id);
    if (!student) throw new AppError('Student not found', 404);

    if (personalInfo) student.personalInfo = { ...student.personalInfo, ...personalInfo };
    if (contactInfo) student.contactInfo = { ...student.contactInfo, ...contactInfo };
    if (guardianDetails) student.guardianDetails = { ...student.guardianDetails, ...guardianDetails };
    if (academicInfo) student.academicInfo = { ...student.academicInfo, ...academicInfo };
    
    if (status && status !== student.status) {
      student.status = status;
      student.timeline.push({
        title: 'Status Changed',
        description: `Status changed to ${status}`,
        type: 'administrative'
      });
    }

    if (notes) {
      student.notes.push({
        text: notes,
        addedBy: req.user.id // assuming auth middleware sets req.user
      });
    }

    await student.save();
    
    sendResponse(res, HTTP_STATUS.OK, 'Student updated successfully', student);
  } catch (error) {
    next(error);
  }
};

// Add timeline event
export const addTimelineEvent = async (req, res, next) => {
  try {
    const { title, description, type } = req.body;
    const student = await StudentProfile.findById(req.params.id);
    if (!student) throw new AppError('Student not found', 404);

    student.timeline.push({ title, description, type });
    await student.save();

    sendResponse(res, HTTP_STATUS.OK, 'Timeline updated', student.timeline);
  } catch (error) {
    next(error);
  }
};

// Delete student (Soft or Hard)
export const deleteStudent = async (req, res, next) => {
  try {
    const student = await StudentProfile.findById(req.params.id);
    if (!student) throw new AppError('Student not found', 404);

    // Delete associated User account
    await User.findByIdAndDelete(student.user);
    
    // Delete profile
    await StudentProfile.findByIdAndDelete(req.params.id);

    sendResponse(res, HTTP_STATUS.OK, 'Student deleted successfully', null);
  } catch (error) {
    next(error);
  }
};
