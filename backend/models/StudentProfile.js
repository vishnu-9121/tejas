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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    studentId: {
      type: String,
      unique: true,
      required: true
    },
    admissionNumber: {
      type: String,
    },
    dateOfBirth: Date,
    gender: { type: String, enum: ['male', 'female', 'other'] },
    qualification: { type: String, default: 'High School / Secondary' },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    parentDetails: {
      fatherName: String,
      fatherPhone: String,
      motherName: String,
      motherPhone: String,
      emergencyContactPhone: String,
    },
    interests: [{ type: String }],
    profilePhoto: String,
    profileImage: String,
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
    }
  },
  {
    timestamps: true,
  }
);

studentProfileSchema.pre('save', function (next) {
  if (this.user && !this.userId) {
    this.userId = this.user;
  } else if (this.userId && !this.user) {
    this.user = this.userId;
  }
  if (this.studentId && !this.admissionNumber) {
    this.admissionNumber = this.studentId;
  } else if (this.admissionNumber && !this.studentId) {
    this.studentId = this.admissionNumber;
  }
  if (this.profileImage && !this.profilePhoto) {
    this.profilePhoto = this.profileImage;
  } else if (this.profilePhoto && !this.profileImage) {
    this.profileImage = this.profilePhoto;
  }
  next();
});

studentProfileSchema.index({ admissionNumber: 1 });

export const StudentProfile = mongoose.models.StudentProfile || mongoose.model('StudentProfile', studentProfileSchema);
export default StudentProfile;
