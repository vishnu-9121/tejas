import { User } from '../models/User.js';
import { AppError } from '../middlewares/errorHandler.js';
import { sendResponse } from '../helpers/responseFormatter.js';
import { HTTP_STATUS } from '../constants/index.js';
import { eventBus, EVENTS } from '../utils/eventBus.js';
import { EnterpriseAuditService } from '../services/EnterpriseAuditService.js';

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('savedPrograms').populate('bookmarkedEvents');
    sendResponse(res, HTTP_STATUS.OK, 'User retrieved', user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phoneNumber, address, bio } = req.body;
    
    // Calculate new profile score simply
    let score = 25;
    if (name) score += 15;
    if (phoneNumber) score += 20;
    if (address) score += 20;
    if (bio) score += 20;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phoneNumber, address, bio, profileCompletionScore: score },
      { new: true, runValidators: true }
    );

    eventBus.emit(EVENTS.PROFILE_UPDATED, { userId: user._id, score });

    sendResponse(res, HTTP_STATUS.OK, 'Profile updated', user);
  } catch (error) {
    next(error);
  }
};

export const toggleSaveProgram = async (req, res, next) => {
  try {
    const { programId } = req.body;
    const user = await User.findById(req.user.id);
    
    const isSaved = user.savedPrograms.includes(programId);
    if (isSaved) {
      user.savedPrograms = user.savedPrograms.filter(id => id.toString() !== programId.toString());
    } else {
      user.savedPrograms.push(programId);
    }
    
    await user.save();

    eventBus.emit(EVENTS.PROGRAM_SAVED, { userId: user._id, programId, isSaved: !isSaved });

    sendResponse(res, HTTP_STATUS.OK, 'Program saved status updated', { savedPrograms: user.savedPrograms });
  } catch (error) {
    next(error);
  }
};

export const toggleBookmarkEvent = async (req, res, next) => {
  try {
    const { eventId } = req.body;
    const user = await User.findById(req.user.id);
    
    const isSaved = user.bookmarkedEvents.includes(eventId);
    if (isSaved) {
      user.bookmarkedEvents = user.bookmarkedEvents.filter(id => id.toString() !== eventId.toString());
    } else {
      user.bookmarkedEvents.push(eventId);
    }
    
    await user.save();

    eventBus.emit(EVENTS.EVENT_BOOKMARKED, { userId: user._id, eventId, isSaved: !isSaved });

    sendResponse(res, HTTP_STATUS.OK, 'Event bookmark status updated', { bookmarkedEvents: user.bookmarkedEvents });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().select('-password').skip(skip).limit(limit).sort('-createdAt').lean(),
      User.countDocuments()
    ]);

    sendResponse(res, HTTP_STATUS.OK, 'Users retrieved', { users, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return next(new AppError('User not found', 404));
    }

    const oldRole = targetUser.role;
    targetUser.role = role;
    await targetUser.save();

    // Log in Enterprise Audit Security Logs
    EnterpriseAuditService.logRoleChange(req.user, targetUser, oldRole, role, req);

    sendResponse(res, HTTP_STATUS.OK, `User role updated from ${oldRole} to ${role}`, targetUser);
  } catch (error) {
    next(error);
  }
};

export const createUserAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return next(new AppError('Please provide name, email, and password', 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('A user with that email address already exists', 400));
    }

    const assignedRole = role || (email === 'vishnu24.igm@gmail.com' ? 'super_admin' : 'student');

    const newUser = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      isEmailVerified: true
    });

    EnterpriseAuditService.logAdminChange(req.user, 'created_user', newUser._id, { email, role: assignedRole }, req);

    sendResponse(res, HTTP_STATUS.CREATED, 'User created successfully', newUser);
  } catch (error) {
    next(error);
  }
};
