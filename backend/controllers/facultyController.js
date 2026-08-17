import { User } from '../models/User.js';
import { MentorProfile } from '../models/MentorProfile.js';
import { AppError } from '../middlewares/errorHandler.js';

export const getFaculty = async (req, res, next) => {
  try {
    const facultyUsers = await User.find({
      role: { $in: ['faculty', 'mentor', 'super_admin', 'admin', 'operations_manager'] }
    }).select('name firstName lastName email role department designation bio avatar profileImage isFeatured').lean();

    // Map fields for convenience
    const faculty = facultyUsers.map(f => ({
      _id: f._id,
      firstName: f.firstName || f.name?.split(' ')[0] || 'Faculty',
      lastName: f.lastName || f.name?.split(' ').slice(1).join(' ') || 'Member',
      name: f.name || `${f.firstName} ${f.lastName}`,
      email: f.email,
      role: f.role,
      department: f.department || 'Academics & Research',
      designation: f.designation || (f.role === 'mentor' ? 'Industry Mentor' : 'Senior Professor'),
      bio: f.bio || '',
      avatar: f.avatar || f.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      isFeatured: f.isFeatured || false
    }));

    res.status(200).json({
      success: true,
      data: {
        faculty,
        total: faculty.length
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getFacultyById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('Faculty not found', 404));

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        firstName: user.firstName || user.name?.split(' ')[0] || '',
        lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
        name: user.name,
        email: user.email,
        department: user.department || 'Academics',
        designation: user.designation || 'Faculty Member',
        bio: user.bio || '',
        avatar: user.avatar || user.profileImage || ''
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createFaculty = async (req, res, next) => {
  try {
    const { name, firstName, lastName, email, department, designation, bio, avatar, password } = req.body;
    const fullName = name || `${firstName || ''} ${lastName || ''}`.trim() || 'Faculty Member';

    const user = await User.create({
      name: fullName,
      firstName: firstName || fullName.split(' ')[0],
      lastName: lastName || fullName.split(' ').slice(1).join(' '),
      email: email || `faculty.${Date.now()}@unlocktejas.com`,
      role: 'faculty',
      department: department || 'Academics',
      designation: designation || 'Professor',
      bio: bio || '',
      avatar: avatar || '',
      password: password || 'Tejas@2026'
    });

    res.status(201).json({
      success: true,
      message: 'Faculty created successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const updateFaculty = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return next(new AppError('Faculty not found', 404));

    res.status(200).json({
      success: true,
      message: 'Faculty updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFaculty = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(new AppError('Faculty not found', 404));

    res.status(200).json({
      success: true,
      message: 'Faculty removed successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

export const toggleFeatureFaculty = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('Faculty not found', 404));

    user.isFeatured = !user.isFeatured;
    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
