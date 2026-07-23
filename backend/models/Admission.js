import mongoose from 'mongoose';

const admissionSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    program: {
      type: String, // Or ObjectId if there is a Program model
      required: [true, 'Please specify the program applying for'],
    },
    personalDetails: {
      fullName: { type: String, required: true },
      dateOfBirth: { type: Date, required: true },
      gender: { type: String, enum: ['male', 'female', 'other'], required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    educationDetails: {
      highestDegree: { type: String, required: true },
      institution: { type: String, required: true },
      yearOfPassing: { type: Number, required: true },
      percentageOrCGPA: { type: String, required: true },
    },
    documents: {
      resumeUrl: { type: String }, // Cloudinary URL
      idProofUrl: { type: String }, // Cloudinary URL
    },
    status: {
      type: String,
      enum: ['submitted', 'under_review', 'interview_scheduled', 'accepted', 'rejected'],
      default: 'submitted',
    },
    applicationId: {
      type: String,
      unique: true,
    }
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate application ID
admissionSchema.pre('save', function (next) {
  if (this.isNew) {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    this.applicationId = `TAE-APP-${year}-${random}`;
  }
  next();
});

admissionSchema.index({ status: 1 });
admissionSchema.index({ applicant: 1 });
admissionSchema.index({ program: 1 });

export const Admission = mongoose.model('Admission', admissionSchema);
