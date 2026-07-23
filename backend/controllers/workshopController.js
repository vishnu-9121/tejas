import * as workshopService from '../services/workshopService.js';
import { sendResponse } from '../helpers/responseFormatter.js';
import { HTTP_STATUS } from '../constants/index.js';

export const getWorkshops = async (req, res, next) => {
  try {
    const data = await workshopService.getAllWorkshopsService(req.query);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getWorkshopBySlug = async (req, res, next) => {
  try {
    const workshop = await workshopService.getWorkshopBySlugService(req.params.slug);
    sendResponse(res, HTTP_STATUS.OK, 'Workshop fetched successfully', workshop);
  } catch (error) {
    next(error);
  }
};

export const getWorkshopById = async (req, res, next) => {
  try {
    const workshop = await workshopService.getWorkshopByIdService(req.params.id);
    res.status(200).json({ success: true, data: workshop });
  } catch (error) {
    next(error);
  }
};

export const createWorkshop = async (req, res, next) => {
  try {
    const workshop = await workshopService.createWorkshopService(req.body);
    sendResponse(res, HTTP_STATUS.CREATED, 'Workshop created successfully', workshop);
  } catch (error) {
    next(error);
  }
};

export const updateWorkshop = async (req, res, next) => {
  try {
    const workshop = await workshopService.updateWorkshopService(req.params.id, req.body);
    sendResponse(res, HTTP_STATUS.OK, 'Workshop updated successfully', workshop);
  } catch (error) {
    next(error);
  }
};

export const deleteWorkshop = async (req, res, next) => {
  try {
    await workshopService.deleteWorkshopService(req.params.id);
    sendResponse(res, HTTP_STATUS.OK, 'Workshop permanently deleted successfully', null);
  } catch (error) {
    next(error);
  }
};

export const toggleWorkshopStatus = async (req, res, next) => {
  try {
    const workshop = await workshopService.toggleStatusService(req.params.id, req.body.status);
    sendResponse(res, HTTP_STATUS.OK, 'Workshop status updated successfully', workshop);
  } catch (error) {
    next(error);
  }
};
