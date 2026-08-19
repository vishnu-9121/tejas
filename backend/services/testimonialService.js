import { Testimonial } from '../models/Testimonial.js';
import { AuditLog } from '../models/AuditLog.js';
import { AppError } from '../middlewares/errorHandler.js';
import { getIO } from '../utils/socket.js';

export const getTestimonialsService = async (query = {}) => {
  const filter = { isActive: true, status: 'approved' };
  if (query.isFeatured) filter.isFeatured = true;
  return await Testimonial.find(filter).sort({ isFeatured: -1, createdAt: -1 });
};

export const getAllTestimonialsAdminService = async (query = {}) => {
  const filter = { isActive: true };
  if (query.status && query.status !== 'all') {
    filter.status = query.status;
  }
  return await Testimonial.find(filter).sort({ createdAt: -1 });
};

export const getTestimonialByIdService = async (id) => {
  const testimonial = await Testimonial.findById(id);
  if (!testimonial) throw new AppError('Testimonial not found', 404);
  return testimonial;
};

export const createTestimonialService = async (data) => {
  return await Testimonial.create({
    ...data,
    status: data.status || 'approved'
  });
};

export const submitReviewService = async (data, user = null) => {
  const { name, email, role, content, rating, program, imageUrl } = data;
  
  if (!name || !name.trim()) throw new AppError('Name is required', 400);
  if (!content || !content.trim()) throw new AppError('Review content is required', 400);
  if (content.trim().length < 15) throw new AppError('Review must be at least 15 characters', 400);
  
  const parsedRating = Number(rating) || 5;
  if (parsedRating < 1 || parsedRating > 5) throw new AppError('Rating must be between 1 and 5', 400);

  const review = await Testimonial.create({
    name: name.trim(),
    email: email ? email.trim().toLowerCase() : (user?.email || ''),
    role: role ? role.trim() : 'Student',
    program: program ? program.trim() : '',
    content: content.trim(),
    rating: parsedRating,
    imageUrl: imageUrl ? imageUrl.trim() : '',
    status: 'pending',
    submittedBy: user?._id || null,
    isActive: true
  });

  // Log activity
  try {
    await AuditLog.create({
      action: 'REVIEW_SUBMITTED',
      entity: 'Testimonial',
      entityId: review._id,
      user: user?._id || null,
      details: { name: review.name, rating: review.rating, program: review.program }
    });

    const io = getIO();
    if (io) {
      io.to('admin_channel').emit('admin_notification', {
        title: 'New Student Review Submitted',
        message: `${review.name} submitted a ${review.rating}-star review for moderation.`,
        type: 'info'
      });
      io.to('admin_channel').emit('NEW_ACTIVITY_LOG', {
        action: 'REVIEW_SUBMITTED',
        userName: review.name,
        entityName: 'Student Review',
        timestamp: new Date()
      });
    }
  } catch (err) {
    // Non-blocking log error
  }

  return review;
};

export const updateTestimonialStatusService = async (id, status) => {
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    throw new AppError('Invalid status value. Must be pending, approved, or rejected.', 400);
  }
  const testimonial = await Testimonial.findByIdAndUpdate(
    id, 
    { status }, 
    { new: true, runValidators: true }
  );
  if (!testimonial) throw new AppError('Testimonial not found', 404);
  return testimonial;
};

export const updateTestimonialService = async (id, data) => {
  const testimonial = await Testimonial.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!testimonial) throw new AppError('Testimonial not found', 404);
  return testimonial;
};

export const deleteTestimonialService = async (id) => {
  const testimonial = await Testimonial.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!testimonial) throw new AppError('Testimonial not found', 404);
  return testimonial;
};
