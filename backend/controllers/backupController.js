import mongoose from 'mongoose';
import { sendResponse } from '../helpers/responseFormatter.js';
import { HTTP_STATUS } from '../constants/index.js';
import { AppError } from '../middlewares/errorHandler.js';

export const createSystemBackup = async (req, res, next) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const backupData = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      system: 'Tejas Academy Website OS',
      collections: {}
    };

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const docs = await mongoose.connection.db.collection(collectionName).find({}).toArray();
      backupData.collections[collectionName] = docs;
    }

    sendResponse(res, HTTP_STATUS.CREATED, 'System backup generated successfully', backupData);
  } catch (error) {
    next(error);
  }
};

export const downloadBackupFile = async (req, res, next) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const backupData = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      system: 'Tejas Academy Website OS',
      collections: {}
    };

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const docs = await mongoose.connection.db.collection(collectionName).find({}).toArray();
      backupData.collections[collectionName] = docs;
    }

    const filename = `tejas_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(JSON.stringify(backupData, null, 2));
  } catch (error) {
    next(error);
  }
};
