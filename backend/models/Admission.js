import mongoose from 'mongoose';

const admissionSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      unique: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
    },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
    },
    program: {
      type: String,
      required: [true, 'Please specify the program applying for'],
    },
    counselorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['submitted', 'under_review', 'interview_scheduled', 'accepted', 'rejected'],
      default: 'submitted',
    },
    applicationStatus: {
      type: String,
      enum: ['submitted', 'under_review', 'interview_scheduled', 'accepted', 'rejected'],
      default: 'submitted',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'partial', 'completed', 'waived'],
      default: 'pending',
    },
    scholarship: {
      applied: { type: Boolean, default: false },
      percentage: { type: Number, default: 0 },
      amount: { type: Number, default: 0 },
    },
    submittedDocuments: [{
      name: String,
      url: String,
      type: String,
    }],
    documents: {
      resumeUrl: { type: String },
      idProofUrl: { type: String },
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'flagged'],
      default: 'pending',
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    reviewNotes: {
      type: String,
      default: '',
    },
    counselorNotes: {
      type: String,
      default: '',
    },
    personalDetails: {
      fullName: { type: String, required: true },
      dateOfBirth: { type: Date, default: Date.now },
      gender: { type: String, enum: ['male', 'female', 'other', 'Male', 'Female', 'Other'], default: 'other' },
      phone: { type: String, required: true },
      address: { type: String, default: 'Not Provided' },
    },
    educationDetails: {
      highestDegree: { type: String, default: 'Secondary / High School' },
      institution: { type: String, default: 'Not Specified' },
      yearOfPassing: { type: Number, default: () => new Date().getFullYear() },
      percentageOrCGPA: { type: String, default: 'N/A' },
    },
  },
  {
    timestamps: true,
  }
);

admissionSchema.pre('save', function (next) {
  if (this.isNew && !this.applicationId) {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    this.applicationId = `TAE-APP-${year}-${random}`;
  }
  if (this.status && !this.applicationStatus) this.applicationStatus = this.status;
  if (this.applicationStatus && !this.status) this.status = this.applicationStatus;
  if (this.applicant && !this.studentId) this.studentId = this.applicant;
  if (this.studentId && !this.applicant) this.applicant = this.studentId;
  next();
});

admissionSchema.index({ status: 1 });
admissionSchema.index({ applicant: 1 });
admissionSchema.index({ program: 1 });

export const Admission = mongoose.models.Admission || mongoose.model('Admission', admissionSchema);
export default Admission;
