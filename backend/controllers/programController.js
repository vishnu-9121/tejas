import slugify from 'slugify';
import { Program } from '../models/Program.js';
import { AppError } from '../middlewares/errorHandler.js';
import { eventBus } from '../utils/eventBus.js';

// Helper to normalize and sanitize complete 6-section program input payload
export const normalizeProgramPayload = (body) => {
  const payload = { ...body };

  if (payload.fees !== undefined) {
    payload.fees = Number(payload.fees) || 0;
    if (!payload.pricing) payload.pricing = {};
    payload.pricing.totalFee = payload.fees;
    payload.pricing.currency = payload.pricing.currency || 'INR';
    payload.pricing.installmentAvailable = payload.pricing.installmentAvailable !== undefined ? payload.pricing.installmentAvailable : true;
  } else if (payload.pricing?.totalFee !== undefined) {
    payload.fees = Number(payload.pricing.totalFee) || 0;
  }

  if (payload.intake !== undefined) {
    payload.intake = Number(payload.intake) || 60;
  }
  if (payload.order !== undefined) {
    payload.order = Number(payload.order) || 0;
  }

  // Generate or refresh slug if title changes
  if (payload.title && (!payload.slug || typeof payload.slug !== 'string')) {
    payload.slug = slugify(payload.title, { lower: true, strict: true });
  }

  // Section 1 & 4: Text summaries & in-depth descriptions
  if (!payload.shortDescription && payload.description) {
    payload.shortDescription = payload.description.substring(0, 160);
  }

  // Section 4: Highlights & Outcomes String Arrays
  ['learningOutcomes', 'highlights', 'careerOpportunities', 'skills'].forEach((field) => {
    if (typeof payload[field] === 'string') {
      payload[field] = payload[field]
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (Array.isArray(payload[field])) {
      payload[field] = payload[field].map(s => typeof s === 'string' ? s.trim() : String(s)).filter(Boolean);
    }
  });

  // Section 3: Curriculum Architecture
  if (Array.isArray(payload.curriculum)) {
    payload.curriculum = payload.curriculum.map((c) => ({
      semester: c.semester || c.termName || '',
      description: c.description || '',
      courses: Array.isArray(c.courses)
        ? c.courses.map((x) => (typeof x === 'string' ? x.trim() : x.title || x.name || '')).filter(Boolean)
        : typeof c.courses === 'string'
        ? c.courses.split(',').map((x) => x.trim()).filter(Boolean)
        : [],
    })).filter((c) => c.semester || (c.courses && c.courses.length > 0));
  }

  // Section 6: FAQs
  if (Array.isArray(payload.faqs)) {
    payload.faqs = payload.faqs.filter(f => f && (f.question?.trim() || f.answer?.trim())).map(f => ({
      question: (f.question || '').trim(),
      answer: (f.answer || '').trim()
    }));
  }

  // Section 5: Mentors & Faculty ObjectId references
  if (Array.isArray(payload.facultyMapping)) {
    payload.facultyMapping = payload.facultyMapping.map(f => typeof f === 'object' && f !== null ? (f._id || f.id) : f).filter(Boolean);
  }
  if (Array.isArray(payload.mentorMapping)) {
    payload.mentorMapping = payload.mentorMapping.map(m => typeof m === 'object' && m !== null ? (m._id || m.id) : m).filter(Boolean);
  }

  // Section 2: Media, Posters, Banners & Brochures
  const mainImage = payload.posterImage || payload.poster || payload.featuredImage || payload.thumbnailUrl || payload.image || '';
  if (mainImage) {
    payload.posterImage = mainImage;
    payload.poster = mainImage;
    payload.featuredImage = mainImage;
    payload.thumbnailUrl = mainImage;
  }

  const mainBrochure = payload.brochureUrl || payload.brochure || '';
  if (mainBrochure) {
    payload.brochureUrl = mainBrochure;
    payload.brochure = mainBrochure;
  }

  // Section 6: SEO Metadata
  if (payload.seo) {
    payload.seo = {
      metaTitle: payload.seo.metaTitle || (payload.title ? `${payload.title} | Tejas Academy` : ''),
      metaDescription: payload.seo.metaDescription || payload.shortDescription || '',
      keywords: payload.seo.keywords || '',
      canonicalUrl: payload.seo.canonicalUrl || '',
      ogTitle: payload.seo.ogTitle || payload.seo.metaTitle || '',
      ogDescription: payload.seo.ogDescription || payload.seo.metaDescription || '',
      ogImage: payload.seo.ogImage || payload.posterImage || ''
    };
  }

  // Status normalization
  if (payload.status) {
    const s = payload.status.toLowerCase();
    payload.isActive = s === 'published';
    payload.status = s === 'published' ? 'Published' : (s === 'draft' ? 'Draft' : 'Archived');
  }

  return payload;
};

// @desc    Get all programs (with filters, pagination, search)
// @route   GET /api/v1/programs
// @access  Public
export const getPrograms = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const { search, category, isActive, isFeatured } = req.query;

    const match = {};
    if (category) match.category = category;
    if (isActive !== undefined) match.isActive = isActive === 'true';
    if (isFeatured !== undefined) match.isFeatured = isFeatured === 'true';

    if (search) {
      match.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const programs = await Program.find(match)
      .skip(skip)
      .limit(limit)
      .sort('order -createdAt')
      .populate('facultyMapping', 'name firstName lastName email department designation avatar profileImage')
      .populate({
        path: 'mentorMapping',
        populate: { path: 'user', select: 'name email avatar' }
      })
      .lean();

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

// @desc    Get single program by slug or ID
// @route   GET /api/v1/programs/:slug
// @access  Public
export const getProgramBySlug = async (req, res, next) => {
  try {
    let program = await Program.findOne({ slug: req.params.slug })
      .populate('facultyMapping', 'name firstName lastName email department designation avatar profileImage')
      .populate({
        path: 'mentorMapping',
        populate: { path: 'user', select: 'name email avatar' }
      })
      .lean();

    if (!program && req.params.slug && (mongoose.isValidObjectId(req.params.slug) || String(req.params.slug).match(/^[0-9a-fA-F]{24}$/))) {
      // Fallback by ID if slug was passed as an ObjectId
      program = await Program.findById(req.params.slug)
        .populate('facultyMapping', 'name firstName lastName email department designation avatar profileImage')
        .populate({
          path: 'mentorMapping',
          populate: { path: 'user', select: 'name email avatar' }
        })
        .lean();
    }

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

// @desc    Get single program by ID (for admin editor)
// @route   GET /api/v1/programs/id/:id
// @access  Private/Admin
export const getProgramById = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id)
      .populate('facultyMapping', 'name firstName lastName email department designation avatar profileImage')
      .populate({
        path: 'mentorMapping',
        populate: { path: 'user', select: 'name email avatar' }
      })
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
    const normalizedBody = normalizeProgramPayload(req.body);
    let program = await Program.create(normalizedBody);

    program = await Program.findById(program._id)
      .populate('facultyMapping', 'name firstName lastName email department designation avatar profileImage')
      .populate({
        path: 'mentorMapping',
        populate: { path: 'user', select: 'name email avatar' }
      });

    eventBus.emit('PROGRAM_UPDATED', program);

    res.status(201).json({
      success: true,
      message: 'Program created successfully',
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
    const normalizedBody = normalizeProgramPayload(req.body);
    const program = await Program.findByIdAndUpdate(req.params.id, normalizedBody, {
      new: true,
      runValidators: true,
    })
      .populate('facultyMapping', 'name firstName lastName email department designation avatar profileImage')
      .populate({
        path: 'mentorMapping',
        populate: { path: 'user', select: 'name email avatar' }
      });

    if (!program) {
      return next(new AppError('Program not found', 404));
    }

    eventBus.emit('PROGRAM_UPDATED', program);

    res.status(200).json({
      success: true,
      message: 'Program updated successfully',
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
    program.status = program.isActive ? 'Published' : 'Archived';
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
      message: 'Program deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
