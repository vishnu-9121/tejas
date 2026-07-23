import { Workshop } from '../models/Workshop.js';
import { AppError } from '../middlewares/errorHandler.js';

export const getAllWorkshopsService = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const { search, status } = query;

  const match = {};
  if (status) match.status = status;

  if (search) {
    match.$or = [
      { title: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
      { speaker: { $regex: search, $options: 'i' } }
    ];
  }

  const workshops = await Workshop.find(match).skip(skip).limit(limit).sort({ date: 1 });
  const total = await Workshop.countDocuments(match);

  return {
    workshops,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  };
};

export const getWorkshopBySlugService = async (slug) => {
  const workshop = await Workshop.findOne({ slug });
  if (!workshop) throw new AppError('Workshop not found', 404);
  return workshop;
};

export const getWorkshopByIdService = async (id) => {
  const workshop = await Workshop.findById(id);
  if (!workshop) throw new AppError('Workshop not found', 404);
  return workshop;
};

export const createWorkshopService = async (workshopData) => {
  return await Workshop.create(workshopData);
};

export const updateWorkshopService = async (id, updateData) => {
  const workshop = await Workshop.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  if (!workshop) throw new AppError('Workshop not found', 404);
  return workshop;
};

export const deleteWorkshopService = async (id) => {
  const workshop = await Workshop.findByIdAndDelete(id);
  if (!workshop) throw new AppError('Workshop not found', 404);
  return workshop;
};

export const toggleStatusService = async (id, status) => {
  const workshop = await Workshop.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
  if (!workshop) throw new AppError('Workshop not found', 404);
  return workshop;
};
