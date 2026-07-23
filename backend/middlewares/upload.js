import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

// This assumes configureCloudinary() has already been called in server.js
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tejas_assets',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'doc', 'docx'],
  },
});

export const upload = multer({ storage: storage });
