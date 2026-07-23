import * as newsletterService from '../services/newsletterService.js';
import { sendResponse } from '../helpers/responseFormatter.js';
import { HTTP_STATUS } from '../constants/index.js';

export const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return sendResponse(res, HTTP_STATUS.BAD_REQUEST, 'Please provide an email address');
    }
    
    await newsletterService.subscribeService(email);
    sendResponse(res, HTTP_STATUS.CREATED, 'Subscribed successfully', null);
  } catch (error) {
    next(error);
  }
};

export const unsubscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return sendResponse(res, HTTP_STATUS.BAD_REQUEST, 'Please provide an email address');
    }
    
    await newsletterService.unsubscribeService(email);
    sendResponse(res, HTTP_STATUS.OK, 'Unsubscribed successfully', null);
  } catch (error) {
    next(error);
  }
};

export const getAllSubscribers = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const data = await newsletterService.getAllSubscribersService(page, limit);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
