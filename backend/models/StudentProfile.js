import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['academic', 'administrative', 'disciplinary', 'achievement', 'system'], default: 'system' }
});

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, enum: ['id_proof', 'previous_academic', 'certificate', 'other'] },
  uploadedAt: { type: Date, default: Date.now }
});

const loginHistorySchema = new mongoose.Schema({
  loginTime: { type: Date, default: Date.now },
  ipAddress: { type: String },
  device: { type: String }
});

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    studentId: {
      type: String,
      unique: true,
      required: true
    },
    personalInfo: {
      dateOfBirth: Date,
      gender: { type: String, enum: ['male', 'female', 'other'] },
      bloodGroup: String,
      nationality: String
    },
    contactInfo: {
      phone: String,
      alternatePhone: String,
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
      }
    },
    guardianDetails: {
      fatherName: String,
      fatherPhone: String,
      fatherOccupation: String,
      motherName: String,
      motherPhone: String,
      motherOccupation: String,
      emergencyContactName: String,
      emergencyContactPhone: String,
      emergencyContactRelation: String
    },
    academicInfo: {
      program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
      courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
      enrollmentDate: { type: Date, default: Date.now },
      batch: String,
      currentSemester: { type: Number, default: 1 },
      attendancePercentage: { type: Number, default: 0 },
      cgpa: { type: Number, default: 0 }
    },
    documents: [documentSchema],
    certificates: [
      {
        name: String,
        issuedDate: Date,
        url: String
      }
    ],
    achievements: [
      {
        title: String,
        description: String,
        date: Date
      }
    ],
    timeline: [timelineSchema],
    loginHistory: [loginHistorySchema],
    notes: [
      {
        text: String,
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        date: { type: Date, default: Date.now }
      }
    ],
    status: {
      type: String,
      enum: ['active', 'suspended', 'alumni', 'dropped', 'pending'],
      default: 'active'
    },
    profileImage: String // URL to cloudinary
  },
  {
    timestamps: true,
  }
);

export const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);
