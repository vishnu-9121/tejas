import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'operations_manager', 'mentor', 'faculty', 'student', 'parent', 'recruiter', 'guest'],
      default: 'student',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'pending'],
      default: 'active',
    },
    permissions: [{
      type: String,
    }],
    profileImage: {
      type: String,
      default: '',
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    lifecycleStage: {
      type: String,
      enum: ['guest', 'lead', 'applicant', 'admitted', 'active_learner', 'alumni'],
      default: 'applicant',
    },
    passwordHistory: [{
      type: String,
    }],
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordOtp: String,
    resetPasswordExpire: Date,
    refreshTokens: [String],
    
    // Engagement / Student Journey Fields
    savedPrograms: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
    }],
    bookmarkedEvents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    }],
    profileCompletionScore: {
      type: Number,
      default: 25,
    },
    address: {
      type: String,
    },
    bio: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to populate fullName and encrypt password
userSchema.pre('save', async function (next) {
  if (this.name && !this.fullName) {
    this.fullName = this.name;
  } else if (this.fullName && !this.name) {
    this.name = this.fullName;
  }
  if (this.phoneNumber && !this.phone) {
    this.phone = this.phoneNumber;
  } else if (this.phone && !this.phoneNumber) {
    this.phoneNumber = this.phone;
  }

  if (!this.isModified('password') || !this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  if (this.passwordHistory) {
    this.passwordHistory.push(this.password);
    if (this.passwordHistory.length > 3) {
      this.passwordHistory.shift();
    }
  } else {
    this.passwordHistory = [this.password];
  }
  next();
});

// Compare entered password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate OTP for reset
userSchema.methods.getResetPasswordOtp = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.resetPasswordOtp = crypto.createHash('sha256').update(otp).digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return otp;
};

// High-speed indexes
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
