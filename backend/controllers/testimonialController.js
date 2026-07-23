import * as testimonialService from '../services/testimonialService.js';
import { sendResponse } from '../helpers/responseFormatter.js';
import { HTTP_STATUS } from '../constants/index.js';

export const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await testimonialService.getTestimonialsService();
    sendResponse(res, HTTP_STATUS.OK, 'Testimonials fetched successfully', testimonials, { total: testimonials.length });
  } catch (error) {
    next(error);
  }
};

export const getTestimonialById = async (req, res, next) => {
  try {
    const testimonial = await testimonialService.getTestimonialByIdService(req.params.id);
    sendResponse(res, HTTP_STATUS.OK, 'Testimonial fetched successfully', testimonial);
  } catch (error) {
    next(error);
  }
};

export const createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await testimonialService.createTestimonialService(req.body);
    sendResponse(res, HTTP_STATUS.CREATED, 'Testimonial created successfully', testimonial);
  } catch (error) {
    next(error);
  }
};

export const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await testimonialService.updateTestimonialService(req.params.id, req.body);
    sendResponse(res, HTTP_STATUS.OK, 'Testimonial updated successfully', testimonial);
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonial = async (req, res, next) => {
  try {
    await testimonialService.deleteTestimonialService(req.params.id);
    sendResponse(res, HTTP_STATUS.OK, 'Testimonial deleted successfully', null);
  } catch (error) {
    next(error);
  }
};
