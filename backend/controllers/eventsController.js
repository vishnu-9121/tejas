import { Event } from '../models/Event.js';
import { AppError } from '../middlewares/errorHandler.js';
import { sendResponse } from '../helpers/responseFormatter.js';
import { HTTP_STATUS } from '../constants/index.js';
import { eventBus, EVENTS } from '../utils/eventBus.js';
import { EnterpriseAuditService } from '../services/EnterpriseAuditService.js';

// @desc    Get all events
// @route   GET /api/v1/events
// @access  Public
export const getEvents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, category, isActive } = req.query;

    const match = {};
    if (category) match.category = category;
    if (isActive !== undefined) match.isActive = isActive === 'true';

    if (search) {
      match.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(match).skip(skip).limit(limit).sort({ date: 1 }).lean();
    const total = await Event.countDocuments(match);

    res.status(200).json({
      success: true,
      data: {
        events,
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

// @desc    Get single event by slug
// @route   GET /api/v1/events/:slug
// @access  Public
export const getEventBySlug = async (req, res, next) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug, isActive: true }).lean();

    if (!event) {
      return next(new AppError('Event not found', 404));
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID
// @route   GET /api/v1/events/:id/edit
// @access  Private/Admin
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).lean();
    if (!event) return next(new AppError('Event not found', 404));
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new event
// @route   POST /api/v1/events
// @access  Private/Admin
export const createEvent = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    
    // Broadcast Domain Event
    eventBus.emit(EVENTS.EVENT_CREATED, event);
    EnterpriseAuditService.logAdminChange(req.user, 'create_event', `Created event '${event.title}'`, { eventId: event._id }, req);

    sendResponse(res, HTTP_STATUS.CREATED, 'Event created successfully', event);
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/v1/events/:id
// @access  Private/Admin
export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return next(new AppError('Event not found', 404));
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/v1/events/:id
// @access  Private/Admin
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return next(new AppError('Event not found', 404));
    }
    EnterpriseAuditService.logAdminChange(req.user, 'delete_event', `Deleted event '${event.title}'`, { eventId: req.params.id }, req);

    sendResponse(res, HTTP_STATUS.OK, 'Event permanently deleted successfully', null);
  } catch (error) {
    next(error);
  }
};

export const toggleEventStatus = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return next(new AppError('Event not found', 404));

    event.isActive = !event.isActive;
    await event.save();

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};
