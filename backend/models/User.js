import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'operations_manager', 'mentor', 'student', 'parent', 'recruiter', 'guest'],
      default: 'guest',
    },
    lifecycleStage: {
      type: String,
      enum: ['guest', 'lead', 'applicant', 'admitted', 'active_learner', 'alumni'],
      default: 'guest',
    },
    passwordHistory: [{
      type: String
    }],
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordOtp: String,
    resetPasswordExpire: Date,
    refreshTokens: [String], // Array to allow multiple active sessions
    
    // Engagement / Student Journey Fields
    savedPrograms: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program'
    }],
    bookmarkedEvents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    }],
    profileCompletionScore: {
      type: Number,
      default: 25 // base score for signing up
    },
    phoneNumber: {
      type: String
    },
    address: {
      type: String
    },
    bio: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt before saving if it was modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // Manage password history (keep last 3)
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

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false; // In case of Google users with no password
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash OTP
userSchema.methods.getResetPasswordOtp = function () {
  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash OTP and set to resetPasswordOtp field
  this.resetPasswordOtp = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');

  // Set expire (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return otp;
};

export const User = mongoose.model('User', userSchema);
