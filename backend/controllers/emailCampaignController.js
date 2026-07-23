import { EmailCampaign } from '../models/EmailCampaign.js';
import { User } from '../models/User.js';
import { Newsletter } from '../models/Newsletter.js';
import { Lead } from '../models/Lead.js';
import { sendEmail } from '../utils/emailService.js';
import { AppError } from '../middlewares/errorHandler.js';
import { sendResponse } from '../helpers/responseFormatter.js';
import { HTTP_STATUS } from '../constants/index.js';

export const getCampaigns = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const [campaigns, total] = await Promise.all([
      EmailCampaign.find().skip(skip).limit(limit).sort('-createdAt').lean(),
      EmailCampaign.countDocuments()
    ]);

    sendResponse(res, HTTP_STATUS.OK, 'Email campaigns retrieved', {
      campaigns,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

export const createCampaign = async (req, res, next) => {
  try {
    const { subject, body, targetSegment, customEmails, scheduledAt } = req.body;
    if (!subject || !body) {
      return next(new AppError('Subject and Body are required', 400));
    }

    const campaign = await EmailCampaign.create({
      subject,
      body,
      targetSegment: targetSegment || 'all',
      customEmails: customEmails || [],
      scheduledAt: scheduledAt || null,
      status: scheduledAt ? 'scheduled' : 'draft',
      createdBy: req.user?._id
    });

    sendResponse(res, HTTP_STATUS.CREATED, 'Email campaign created', campaign);
  } catch (error) {
    next(error);
  }
};

export const sendCampaignBroadcast = async (req, res, next) => {
  try {
    const { campaignId } = req.params;
    const campaign = await EmailCampaign.findById(campaignId);
    if (!campaign) {
      return next(new AppError('Campaign not found', 404));
    }

    campaign.status = 'sending';
    await campaign.save();

    let targetEmails = [];

    if (campaign.targetSegment === 'all') {
      const users = await User.find({ isEmailVerified: true }).select('email').lean();
      targetEmails = users.map(u => u.email);
    } else if (campaign.targetSegment === 'students') {
      const users = await User.find({ role: 'student' }).select('email').lean();
      targetEmails = users.map(u => u.email);
    } else if (campaign.targetSegment === 'subscribers') {
      const subs = await Newsletter.find({ isActive: true }).select('email').lean();
      targetEmails = subs.map(s => s.email);
    } else if (campaign.targetSegment === 'leads') {
      const leads = await Lead.find().select('email').lean();
      targetEmails = leads.map(l => l.email);
    } else if (campaign.targetSegment === 'custom') {
      targetEmails = campaign.customEmails;
    }

    // Deduplicate emails
    targetEmails = [...new Set(targetEmails.filter(Boolean))];

    let sent = 0;
    let failed = 0;
    const deliveryLogs = [];

    for (const email of targetEmails) {
      try {
        const success = await sendEmail({
          email,
          subject: campaign.subject,
          message: campaign.body,
        });
        if (success !== false) {
          sent++;
          deliveryLogs.push({ email, status: 'sent' });
        } else {
          failed++;
          deliveryLogs.push({ email, status: 'failed', error: 'SMTP Send Failed' });
        }
      } catch (err) {
        failed++;
        deliveryLogs.push({ email, status: 'failed', error: err.message });
      }
    }

    campaign.status = 'sent';
    campaign.sentCount = sent;
    campaign.failedCount = failed;
    campaign.deliveryLogs = deliveryLogs;
    await campaign.save();

    sendResponse(res, HTTP_STATUS.OK, `Broadcast sent to ${sent} recipient(s)`, campaign);
  } catch (error) {
    next(error);
  }
};
