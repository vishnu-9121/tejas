import * as courseService from '../services/courseService.js';
import { sendResponse } from '../helpers/responseFormatter.js';
import { HTTP_STATUS } from '../constants/index.js';
import { eventBus, EVENTS } from '../utils/eventBus.js';

export const getCourses = async (req, res, next) => {
  try {
    const courses = await courseService.getAllCoursesService(req.query);
    sendResponse(res, HTTP_STATUS.OK, 'Courses fetched successfully', courses, { total: courses.length });
  } catch (error) {
    next(error);
  }
};

export const getCourseBySlug = async (req, res, next) => {
  try {
    const course = await courseService.getCourseBySlugService(req.params.slug);
    sendResponse(res, HTTP_STATUS.OK, 'Course fetched successfully', course);
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (req, res, next) => {
  try {
    const course = await courseService.getCourseByIdService(req.params.id);
    sendResponse(res, HTTP_STATUS.OK, 'Course fetched successfully', course);
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (req, res, next) => {
  try {
    const course = await courseService.createCourseService(req.body);
    
    // Broadcast Event
    eventBus.emit(EVENTS.COURSE_PUBLISHED, course);

    sendResponse(res, HTTP_STATUS.CREATED, 'Course created successfully', course);
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const course = await courseService.updateCourseService(req.params.id, req.body);

    // Broadcast Event
    eventBus.emit(EVENTS.COURSE_PUBLISHED, course);

    sendResponse(res, HTTP_STATUS.OK, 'Course updated successfully', course);
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    await courseService.deleteCourseService(req.params.id);

    // Broadcast Event
    eventBus.emit(EVENTS.COURSE_PUBLISHED, { id: req.params.id, deleted: true });

    sendResponse(res, HTTP_STATUS.OK, 'Course deleted successfully', null);
  } catch (error) {
    next(error);
  }
};

export const toggleCourseStatus = async (req, res, next) => {
  try {
    const course = await courseService.toggleStatusService(req.params.id, req.body.status);

    // Broadcast Event
    eventBus.emit(EVENTS.COURSE_PUBLISHED, course);

    sendResponse(res, HTTP_STATUS.OK, 'Course status updated successfully', course);
  } catch (error) {
    next(error);
  }
};
