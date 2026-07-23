import { Program } from '../models/Program.js';
import { AppError } from '../middlewares/errorHandler.js';
import { eventBus, EVENTS } from '../utils/eventBus.js';

// @desc    Get all programs (with filters, pagination, search)
// @route   GET /api/v1/programs
// @access  Public
export const getPrograms = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, category, isActive, isFeatured } = req.query;

    const match = {};
    if (category) match.category = category;
    if (isActive !== undefined) match.isActive = isActive === 'true';
    if (isFeatured !== undefined) match.isFeatured = isFeatured === 'true';

    if (search) {
      match.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const programs = await Program.find(match).skip(skip).limit(limit).sort('-createdAt').lean();
    const total = await Program.countDocuments(match);

    res.status(200).json({
      success: true,
      data: {
        programs,
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

// @desc    Get single program by slug
// @route   GET /api/v1/programs/:slug
// @access  Public
export const getProgramBySlug = async (req, res, next) => {
  try {
    const program = await Program.findOne({ slug: req.params.slug, isActive: true })
      .populate('mentorMapping')
      .lean();

    if (!program) {
      return next(new AppError('Program not found', 404));
    }

    res.status(200).json({
      success: true,
      data: program,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single program by ID (for admin)
// @route   GET /api/v1/programs/id/:id
// @access  Private/Admin
export const getProgramById = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id)
      .populate('mentorMapping')
      .lean();

    if (!program) {
      return next(new AppError('Program not found', 404));
    }

    res.status(200).json({
      success: true,
      data: program,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new program
// @route   POST /api/v1/programs
// @access  Private/Admin
export const createProgram = async (req, res, next) => {
  try {
    const program = await Program.create(req.body);

    eventBus.emit('PROGRAM_UPDATED', program);

    res.status(201).json({
      success: true,
      data: program,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update program
// @route   PUT /api/v1/programs/:id
// @access  Private/Admin
export const updateProgram = async (req, res, next) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!program) {
      return next(new AppError('Program not found', 404));
    }

    eventBus.emit('PROGRAM_UPDATED', program);

    res.status(200).json({
      success: true,
      data: program,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle Program Archive Status
// @route   PATCH /api/v1/programs/:id/archive
// @access  Private/Admin
export const toggleArchiveProgram = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return next(new AppError('Program not found', 404));

    program.isActive = !program.isActive;
    await program.save();

    eventBus.emit('PROGRAM_UPDATED', program);

    res.status(200).json({ success: true, data: program });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle Program Featured Status
// @route   PATCH /api/v1/programs/:id/feature
// @access  Private/Admin
export const toggleFeatureProgram = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return next(new AppError('Program not found', 404));

    program.isFeatured = !program.isFeatured;
    await program.save();

    eventBus.emit('PROGRAM_UPDATED', program);

    res.status(200).json({ success: true, data: program });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete program (Hard delete)
// @route   DELETE /api/v1/programs/:id
// @access  Private/Admin
export const deleteProgram = async (req, res, next) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);

    if (!program) {
      return next(new AppError('Program not found', 404));
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
