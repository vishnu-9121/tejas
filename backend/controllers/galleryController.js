import * as galleryService from '../services/galleryService.js';
import { sendResponse } from '../helpers/responseFormatter.js';
import { HTTP_STATUS } from '../constants/index.js';

export const getGallery = async (req, res, next) => {
  try {
    const { page, limit, category } = req.query;
    const data = await galleryService.getGalleryService(page, limit, category);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getGalleryById = async (req, res, next) => {
  try {
    const image = await galleryService.getGalleryByIdService(req.params.id);
    sendResponse(res, HTTP_STATUS.OK, 'Image fetched successfully', image);
  } catch (error) {
    next(error);
  }
};

export const addGalleryImage = async (req, res, next) => {
  try {
    const image = await galleryService.addGalleryImageService(req.body);
    sendResponse(res, HTTP_STATUS.CREATED, 'Image added to gallery', image);
  } catch (error) {
    next(error);
  }
};

export const updateGalleryImage = async (req, res, next) => {
  try {
    const image = await galleryService.updateGalleryImageService(req.params.id, req.body);
    sendResponse(res, HTTP_STATUS.OK, 'Image updated', image);
  } catch (error) {
    next(error);
  }
};

export const deleteGalleryImage = async (req, res, next) => {
  try {
    await galleryService.deleteGalleryImageService(req.params.id);
    sendResponse(res, HTTP_STATUS.OK, 'Image removed from gallery', null);
  } catch (error) {
    next(error);
  }
};
