import mongoose from 'mongoose';

const mentorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    company: {
      type: String,
      required: [true, 'Please specify the company'],
      trim: true,
    },
    designation: {
      type: String,
      required: [true, 'Please specify a designation'],
      trim: true,
    },
    industry: {
      type: String,
      required: [true, 'Please specify an industry'],
      trim: true,
    },
    expertise: [{
      type: String,
      trim: true
    }],
    experienceYears: {
      type: Number,
      required: true,
      default: 0
    },
    bio: {
      type: String,
      required: true,
    },
    socialLinks: {
      linkedin: { type: String, trim: true },
      twitter: { type: String, trim: true },
      website: { type: String, trim: true },
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

export const MentorProfile = mongoose.model('MentorProfile', mentorProfileSchema);
