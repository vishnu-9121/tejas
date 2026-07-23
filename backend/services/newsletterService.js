import { Newsletter } from '../models/Newsletter.js';
import { AppError } from '../middlewares/errorHandler.js';
import { sendEmail } from '../utils/emailService.js';

export const subscribeService = async (email) => {
  let subscriber = await Newsletter.findOne({ email });

  if (subscriber) {
    if (!subscriber.isActive) {
      subscriber.isActive = true;
      await subscriber.save();
      return subscriber;
    }
    throw new AppError('Already subscribed', 400);
  }

  subscriber = await Newsletter.create({ email });

  // Optional: Send welcome to newsletter email
  await sendEmail({
    email,
    subject: 'Welcome to Tejas Academy Newsletter',
    message: '<p>Thank you for subscribing to our newsletter! We will keep you updated with the latest news, workshops, and courses.</p>'
  });

  return subscriber;
};

export const unsubscribeService = async (email) => {
  const subscriber = await Newsletter.findOne({ email });
  if (!subscriber) {
    throw new AppError('Subscriber not found', 404);
  }

  subscriber.isActive = false;
  await subscriber.save();

  return subscriber;
};

export const getAllSubscribersService = async (page = 1, limit = 20) => {
  const query = { isActive: true };
  const skip = (page - 1) * limit;
  const total = await Newsletter.countDocuments(query);
  const subscribers = await Newsletter.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).select('-__v');
  
  return {
    subscribers,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};
