import { Course } from '../models/Course.js';
import { AppError } from '../middlewares/errorHandler.js';

export const getAllCoursesService = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const { search, category, level, status } = query;

  const match = {};
  if (category) match.category = category;
  if (level) match.level = level;
  if (status) match.status = status;

  if (search) {
    match.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

    const courses = await Course.find(match)
      .populate('program', 'title slug')
      .skip(skip)
    .limit(limit)
    .sort('-createdAt')
    .lean();

  const total = await Course.countDocuments(match);

  return {
    courses,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  };
};

export const getCourseBySlugService = async (slug) => {
  const course = await Course.findOne({ slug })
    .populate('program', 'title slug')
    .lean();
  if (!course) throw new AppError('Course not found', 404);
  return course;
};

export const getCourseByIdService = async (id) => {
  const course = await Course.findById(id)
    .populate('program', 'title slug')
    .lean();
  if (!course) throw new AppError('Course not found', 404);
  return course;
};

export const createCourseService = async (courseData) => {
  return await Course.create(courseData);
};

export const updateCourseService = async (id, updateData) => {
  const course = await Course.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  if (!course) throw new AppError('Course not found', 404);
  return course;
};

export const deleteCourseService = async (id) => {
  const course = await Course.findByIdAndDelete(id);
  if (!course) throw new AppError('Course not found', 404);
  return course;
};

export const toggleStatusService = async (id, status) => {
  const course = await Course.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
  if (!course) throw new AppError('Course not found', 404);
  return course;
};
