import { MentorProfile } from '../models/MentorProfile.js';
import { User } from '../models/User.js';
import { AppError } from '../middlewares/errorHandler.js';

// @desc    Get all mentor profiles
// @route   GET /api/v1/mentors
// @access  Public
export const getMentors = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, industry, isFeatured } = req.query;

    const match = {};
    if (industry) match.industry = industry;
    if (isFeatured !== undefined) match.isFeatured = isFeatured === 'true';

    let query = MentorProfile.find(match).populate('user', 'name email avatar role isActive');

    const profiles = await query.skip(skip).limit(limit).sort('-createdAt');
    const total = await MentorProfile.countDocuments(match);

    let filteredProfiles = profiles;
    if (search) {
      const lowerSearch = search.toLowerCase();
      filteredProfiles = profiles.filter(p => 
        p.user?.name?.toLowerCase().includes(lowerSearch) ||
        p.company?.toLowerCase().includes(lowerSearch) ||
        p.industry?.toLowerCase().includes(lowerSearch)
      );
    }

    res.status(200).json({
      success: true,
      data: {
        mentors: filteredProfiles,
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

// @desc    Get single mentor by ID
// @route   GET /api/v1/mentors/:id
// @access  Public
export const getMentorById = async (req, res, next) => {
  try {
    const profile = await MentorProfile.findById(req.params.id)
      .populate('user', 'name email avatar');

    if (!profile) return next(new AppError('Mentor profile not found', 404));

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Create mentor profile
// @route   POST /api/v1/mentors
// @access  Private/Admin
export const createMentor = async (req, res, next) => {
  try {
    const { name, email, password, ...profileData } = req.body;

    const user = await User.create({
      name,
      email,
      password: password || 'Mentor@123',
      role: 'mentor',
      isActive: true
    });

    const profile = await MentorProfile.create({
      user: user._id,
      ...profileData
    });

    res.status(201).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Update mentor profile
// @route   PUT /api/v1/mentors/:id
// @access  Private/Admin
export const updateMentor = async (req, res, next) => {
  try {
    const { name, ...profileData } = req.body;

    let profile = await MentorProfile.findById(req.params.id);
    if (!profile) return next(new AppError('Profile not found', 404));

    if (name) {
      await User.findByIdAndUpdate(profile.user, { name }, { runValidators: true });
    }

    profile = await MentorProfile.findByIdAndUpdate(req.params.id, profileData, { new: true, runValidators: true });

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete mentor profile & user
// @route   DELETE /api/v1/mentors/:id
// @access  Private/Admin
export const deleteMentor = async (req, res, next) => {
  try {
    const profile = await MentorProfile.findById(req.params.id);
    if (!profile) return next(new AppError('Profile not found', 404));

    await User.findByIdAndDelete(profile.user);
    await MentorProfile.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle feature status
// @route   PATCH /api/v1/mentors/:id/feature
// @access  Private/Admin
export const toggleMentorFeature = async (req, res, next) => {
  try {
    const profile = await MentorProfile.findById(req.params.id);
    if (!profile) return next(new AppError('Profile not found', 404));

    profile.isFeatured = !profile.isFeatured;
    await profile.save();

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};
