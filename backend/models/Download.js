import mongoose from 'mongoose';

const downloadSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    fileUrl: {
      type: String,
      required: true
    },
    fileType: {
      type: String, // e.g. 'pdf', 'zip', 'doc'
      default: 'pdf'
    },
    fileSizeMB: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      enum: ['syllabus', 'brochure', 'prospectus', 'form', 'past_paper', 'other'],
      default: 'brochure',
      index: true
    },
    downloadCount: {
      type: Number,
      default: 0
    },
    accessLevel: {
      type: String,
      enum: ['public', 'student', 'faculty', 'admin'],
      default: 'public'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const Download = mongoose.model('Download', downloadSchema);
