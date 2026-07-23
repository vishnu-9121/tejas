import { sendResponse } from '../helpers/responseFormatter.js';
import { HTTP_STATUS } from '../constants/index.js';

export const uploadImage = (req, res, next) => {
  try {
    if (!req.file) {
      return sendResponse(res, HTTP_STATUS.BAD_REQUEST, 'Please upload an image file');
    }
    
    sendResponse(res, HTTP_STATUS.OK, 'File uploaded successfully', {
      url: req.file.path,
      filename: req.file.filename,
    });
  } catch (error) {
    next(error);
  }
};
