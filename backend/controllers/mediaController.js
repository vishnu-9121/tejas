import { MediaAsset } from '../models/MediaAsset.js';
import { AppError } from '../middlewares/errorHandler.js';
import { sendResponse } from '../helpers/responseFormatter.js';
import { HTTP_STATUS } from '../constants/index.js';
import path from 'path';

export const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file && !req.files) {
      return next(new AppError('No media file uploaded', 400));
    }

    const files = req.files || [req.file];
    const createdAssets = [];

    for (const file of files) {
      const asset = await MediaAsset.create({
        name: req.body.name || file.originalname,
        originalName: file.originalname,
        url: `/uploads/${file.filename}`,
        mimeType: file.mimetype,
        size: file.size,
        folder: req.body.folder || 'General',
        altText: req.body.altText || file.originalname,
        caption: req.body.caption || '',
        tags: req.body.tags ? req.body.tags.split(',').map(t => t.trim()) : [],
        uploadedBy: req.user?._id
      });
      createdAssets.push(asset);
    }

    sendResponse(res, HTTP_STATUS.CREATED, 'Media uploaded successfully', createdAssets);
  } catch (error) {
    next(error);
  }
};

export const getMediaAssets = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24;
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };
    if (req.query.folder && req.query.folder !== 'All') {
      query.folder = req.query.folder;
    }
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    const [assets, total] = await Promise.all([
      MediaAsset.find(query).skip(skip).limit(limit).sort('-createdAt').lean(),
      MediaAsset.countDocuments(query)
    ]);

    const folders = await MediaAsset.distinct('folder', { isDeleted: false });

    sendResponse(res, HTTP_STATUS.OK, 'Media assets retrieved', {
      assets,
      folders,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

export const updateMediaMetadata = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, altText, caption, folder, tags } = req.body;

    const asset = await MediaAsset.findByIdAndUpdate(
      id,
      { name, altText, caption, folder, tags },
      { new: true, runValidators: true }
    );

    if (!asset) {
      return next(new AppError('Media asset not found', 404));
    }

    sendResponse(res, HTTP_STATUS.OK, 'Media metadata updated', asset);
  } catch (error) {
    next(error);
  }
};

export const deleteMediaBulk = async (req, res, next) => {
  try {
    const { assetIds } = req.body;
    if (!assetIds || !Array.isArray(assetIds)) {
      return next(new AppError('Please provide an array of assetIds', 400));
    }

    await MediaAsset.updateMany(
      { _id: { $in: assetIds } },
      { isDeleted: true }
    );

    sendResponse(res, HTTP_STATUS.OK, `${assetIds.length} media assets deleted`);
  } catch (error) {
    next(error);
  }
};

export const getMediaStorageStats = async (req, res, next) => {
  try {
    const stats = await MediaAsset.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          totalFiles: { $sum: 1 },
          totalBytes: { $sum: '$size' }
        }
      }
    ]);

    const result = stats[0] || { totalFiles: 0, totalBytes: 0 };
    sendResponse(res, HTTP_STATUS.OK, 'Storage statistics retrieved', result);
  } catch (error) {
    next(error);
  }
};
