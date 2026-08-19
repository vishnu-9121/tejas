import * as testimonialService from '../services/testimonialService.js';
import { sendResponse } from '../helpers/responseFormatter.js';
import { HTTP_STATUS } from '../constants/index.js';

export const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await testimonialService.getTestimonialsService(req.query);
    sendResponse(res, HTTP_STATUS.OK, 'Testimonials fetched successfully', testimonials, { total: testimonials.length });
  } catch (error) {
    next(error);
  }
};

export const getAdminTestimonials = async (req, res, next) => {
  try {
    const testimonials = await testimonialService.getAllTestimonialsAdminService(req.query);
    sendResponse(res, HTTP_STATUS.OK, 'Admin testimonials fetched successfully', testimonials, { total: testimonials.length });
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

export const submitReview = async (req, res, next) => {
  try {
    const review = await testimonialService.submitReviewService(req.body, req.user || null);
    sendResponse(res, HTTP_STATUS.CREATED, 'Review submitted successfully. It will be published after moderation.', review);
  } catch (error) {
    next(error);
  }
};

export const updateTestimonialStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const testimonial = await testimonialService.updateTestimonialStatusService(req.params.id, status);
    sendResponse(res, HTTP_STATUS.OK, `Testimonial status updated to ${status}`, testimonial);
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
