import { Testimonial } from '../models/Testimonial.js';
import { AppError } from '../middlewares/errorHandler.js';

export const getTestimonialsService = async () => {
  return await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });
};

export const getTestimonialByIdService = async (id) => {
  const testimonial = await Testimonial.findById(id);
  if (!testimonial) throw new AppError('Testimonial not found', 404);
  return testimonial;
};

export const createTestimonialService = async (data) => {
  return await Testimonial.create(data);
};

export const updateTestimonialService = async (id, data) => {
  const testimonial = await Testimonial.findByIdAndUpdate(id, data, { new: true });
  if (!testimonial) throw new AppError('Testimonial not found', 404);
  return testimonial;
};

export const deleteTestimonialService = async (id) => {
  const testimonial = await Testimonial.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!testimonial) throw new AppError('Testimonial not found', 404);
  return testimonial;
};
