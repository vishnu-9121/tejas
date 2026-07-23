import { Lead } from '../models/Lead.js';
import { AppError } from '../middlewares/errorHandler.js';
import { sendResponse } from '../helpers/responseFormatter.js';
import { HTTP_STATUS } from '../constants/index.js';

export const getLeads = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.program) query.program = req.query.program;
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { phone: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [leads, total] = await Promise.all([
      Lead.find(query).populate('assignedStaff', 'name email').skip(skip).limit(limit).sort('-createdAt').lean(),
      Lead.countDocuments(query)
    ]);

    sendResponse(res, HTTP_STATUS.OK, 'Leads retrieved', {
      leads,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

export const createLead = async (req, res, next) => {
  try {
    const { name, email, phone, program, source, campaign, notes } = req.body;
    if (!name || !email) {
      return next(new AppError('Name and Email are required for lead capture', 400));
    }

    const lead = await Lead.create({
      name,
      email,
      phone,
      program: program || 'General Inquiry',
      source: source || 'Website Contact Form',
      campaign: campaign || 'Organic',
      notes: notes ? [{ authorName: 'System', text: notes }] : [],
      timeline: [{ action: 'Created', description: `Lead created via ${source || 'Website'}` }]
    });

    sendResponse(res, HTTP_STATUS.CREATED, 'Lead captured successfully', lead);
  } catch (error) {
    next(error);
  }
};

export const updateLeadStatus = async (req, res, next) => {
  try {
    const { leadId } = req.params;
    const { status, note } = req.body;

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return next(new AppError('Lead not found', 404));
    }

    const oldStatus = lead.status;
    lead.status = status;
    if (note) {
      lead.notes.push({ authorName: req.user?.name || 'Staff', text: note });
    }
    lead.timeline.push({
      action: 'Status Change',
      description: `Status changed from ${oldStatus} to ${status}`
    });

    await lead.save();

    sendResponse(res, HTTP_STATUS.OK, `Lead status updated to ${status}`, lead);
  } catch (error) {
    next(error);
  }
};

export const assignLeadStaff = async (req, res, next) => {
  try {
    const { leadId } = req.params;
    const { staffId } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      leadId,
      { assignedStaff: staffId },
      { new: true }
    ).populate('assignedStaff', 'name email');

    if (!lead) {
      return next(new AppError('Lead not found', 404));
    }

    sendResponse(res, HTTP_STATUS.OK, 'Staff assigned to lead', lead);
  } catch (error) {
    next(error);
  }
};
