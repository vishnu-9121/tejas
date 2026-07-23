import { ContentEntry } from '../models/ContentEntry.js';
import { ContentVersion } from '../models/ContentVersion.js';
import { AuditLog } from '../models/AuditLog.js';
import { AppError } from '../middlewares/errorHandler.js';

export const getCmsDataService = async (key, status = 'PUBLISHED') => {
  const entry = await ContentEntry.findOne({ key });
  if (!entry) return null;

  // If fetching for public site, return publishedData
  if (status === 'PUBLISHED') {
    return { ...entry.toObject(), data: entry.publishedData || {} };
  }
  
  // Otherwise return draft data (Admin view)
  return entry;
};

export const updateCmsDataService = async (key, data, user = null) => {
  let entry = await ContentEntry.findOne({ key });
  
  if (entry) {
    entry.data = data;
    entry.status = 'DRAFT'; // Saving edits moves it to draft
    entry.markModified('data');
    await entry.save();
  } else {
    // Create new if doesn't exist
    entry = await ContentEntry.create({ 
      key, 
      title: key,
      data,
      author: user?._id
    });
  }
  
  if (user) {
    await AuditLog.create({
      user: user._id,
      action: 'UPDATE',
      entityType: 'CONTENT_ENTRY',
      entityId: entry._id,
      details: `Draft updated for ${key}`
    });
  }
  
  return entry;
};

export const publishCmsDataService = async (key, user, commitMessage = "Published changes") => {
  const entry = await ContentEntry.findOne({ key });
  if (!entry) throw new AppError('Content not found', 404);

  // 1. Create a snapshot in ContentVersion
  await ContentVersion.create({
    entry: entry._id,
    versionNumber: entry.currentVersionNumber,
    data: entry.data,
    commitMessage,
    createdBy: user?._id
  });

  // 2. Update Entry to Published state
  entry.publishedData = entry.data;
  entry.publishedVersionNumber = entry.currentVersionNumber;
  entry.currentVersionNumber += 1;
  entry.status = 'PUBLISHED';
  
  entry.markModified('publishedData');
  await entry.save();

  if (user) {
    await AuditLog.create({
      user: user._id,
      action: 'PUBLISH',
      entityType: 'CONTENT_ENTRY',
      entityId: entry._id,
      details: `Published version ${entry.publishedVersionNumber} for ${key}`
    });
  }

  return entry;
};

export const getVersionHistoryService = async (key) => {
  const entry = await ContentEntry.findOne({ key });
  if (!entry) throw new AppError('Content not found', 404);

  const versions = await ContentVersion.find({ entry: entry._id })
    .sort({ versionNumber: -1 })
    .populate('createdBy', 'name email');
    
  return versions;
};

export const rollbackCmsDataService = async (key, versionNumber, user) => {
  const entry = await ContentEntry.findOne({ key });
  if (!entry) throw new AppError('Content not found', 404);

  const version = await ContentVersion.findOne({ entry: entry._id, versionNumber });
  if (!version) throw new AppError('Version not found', 404);

  // Overwrite working draft with rolled-back data
  entry.data = version.data;
  entry.status = 'DRAFT';
  entry.markModified('data');
  await entry.save();

  if (user) {
    await AuditLog.create({
      user: user._id,
      action: 'ROLLBACK',
      entityType: 'CONTENT_ENTRY',
      entityId: entry._id,
      details: `Rolled back to version ${versionNumber} for ${key}`
    });
  }

  return entry;
};
