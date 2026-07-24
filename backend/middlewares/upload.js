import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { AppError } from './errorHandler.js';

// Memory storage engine for buffering upload stream in memory
const storage = multer.memoryStorage();

// Allowed file extensions & mime-types
const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'doc', 'docx'];

const fileFilter = (req, file, cb) => {
  const ext = file.originalname.split('.').pop()?.toLowerCase();
  const mime = file.mimetype.toLowerCase();

  const isValidExt = ALLOWED_FORMATS.includes(ext);
  const isValidMime =
    mime.startsWith('image/') ||
    mime === 'application/pdf' ||
    mime === 'application/msword' ||
    mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  if (isValidExt || isValidMime) {
    cb(null, true);
  } else {
    cb(new AppError(`Invalid file type. Allowed formats: ${ALLOWED_FORMATS.join(', ')}`, 400), false);
  }
};

const memoryUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter,
});

/**
 * Upload buffer to Cloudinary using upload_stream API (Cloudinary v2 compatible)
 */
export const uploadStreamToCloudinary = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'tejas_assets',
        resource_type: 'auto',
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

/**
 * Custom Upload Middleware replacing multer-storage-cloudinary
 */
export const upload = {
  single: (fieldname) => {
    const multerSingle = memoryUpload.single(fieldname);
    return (req, res, next) => {
      multerSingle(req, res, async (err) => {
        if (err) return next(err);
        if (!req.file) return next();

        try {
          const result = await uploadStreamToCloudinary(req.file.buffer, {
            folder: 'tejas_assets',
          });
          // Attach Cloudinary response to req.file for 100% backward compatibility
          req.file.path = result.secure_url;
          req.file.filename = result.public_id;
          req.file.secure_url = result.secure_url;
          req.file.public_id = result.public_id;
          next();
        } catch (uploadErr) {
          next(new AppError(`Cloudinary upload failed: ${uploadErr.message}`, 500));
        }
      });
    };
  },

  array: (fieldname, maxCount) => {
    const multerArray = memoryUpload.array(fieldname, maxCount);
    return (req, res, next) => {
      multerArray(req, res, async (err) => {
        if (err) return next(err);
        if (!req.files || req.files.length === 0) return next();

        try {
          const uploadPromises = req.files.map(async (file) => {
            const result = await uploadStreamToCloudinary(file.buffer, {
              folder: 'tejas_assets',
            });
            file.path = result.secure_url;
            file.filename = result.public_id;
            file.secure_url = result.secure_url;
            file.public_id = result.public_id;
            return file;
          });
          await Promise.all(uploadPromises);
          next();
        } catch (uploadErr) {
          next(new AppError(`Cloudinary upload failed: ${uploadErr.message}`, 500));
        }
      });
    };
  },

  fields: (fieldsArray) => {
    const multerFields = memoryUpload.fields(fieldsArray);
    return (req, res, next) => {
      multerFields(req, res, async (err) => {
        if (err) return next(err);
        if (!req.files) return next();

        try {
          const allFiles = [];
          for (const key of Object.keys(req.files)) {
            allFiles.push(...req.files[key]);
          }
          const uploadPromises = allFiles.map(async (file) => {
            const result = await uploadStreamToCloudinary(file.buffer, {
              folder: 'tejas_assets',
            });
            file.path = result.secure_url;
            file.filename = result.public_id;
            file.secure_url = result.secure_url;
            file.public_id = result.public_id;
            return file;
          });
          await Promise.all(uploadPromises);
          next();
        } catch (uploadErr) {
          next(new AppError(`Cloudinary upload failed: ${uploadErr.message}`, 500));
        }
      });
    };
  }
};
