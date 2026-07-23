import { Gallery } from '../models/Gallery.js';
import { AppError } from '../middlewares/errorHandler.js';

export const getGalleryService = async (page = 1, limit = 20, category) => {
  const query = { isActive: true };
  if (category) query.category = category;

  const skip = (page - 1) * limit;
  const total = await Gallery.countDocuments(query);
  const images = await Gallery.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
  
  return {
    images,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getGalleryByIdService = async (id) => {
  const image = await Gallery.findById(id);
  if (!image) throw new AppError('Image not found', 404);
  return image;
};

export const addGalleryImageService = async (data) => {
  return await Gallery.create(data);
};

export const updateGalleryImageService = async (id, data) => {
  const image = await Gallery.findByIdAndUpdate(id, data, { new: true });
  if (!image) throw new AppError('Image not found', 404);
  return image;
};

export const deleteGalleryImageService = async (id) => {
  const image = await Gallery.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!image) throw new AppError('Image not found', 404);
  return image;
};
