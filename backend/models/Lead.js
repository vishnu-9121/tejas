import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      default: '',
    },
    program: {
      type: String,
      default: 'General Inquiry',
    },
    interestedProgram: {
      type: String,
      default: 'General Inquiry',
    },
    source: {
      type: String,
      default: 'Website Form',
    },
    campaign: {
      type: String,
      default: 'Organic',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'proposal', 'converted', 'lost'],
      default: 'new',
      index: true,
    },
    leadStatus: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'proposal', 'converted', 'lost'],
      default: 'new',
    },
    assignedStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    counselorAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    leadScore: {
      type: Number,
      default: 10,
    },
    remarks: {
      type: String,
      default: '',
    },
    followUpDate: {
      type: Date,
    },
    notes: [{
      authorName: String,
      text: String,
      createdAt: { type: Date, default: Date.now }
    }],
    timeline: [{
      action: String,
      description: String,
      timestamp: { type: Date, default: Date.now }
    }]
  },
  {
    timestamps: true,
  }
);

leadSchema.pre('save', function (next) {
  if (this.name && !this.fullName) this.fullName = this.name;
  if (this.fullName && !this.name) this.name = this.fullName;
  if (this.program && !this.interestedProgram) this.interestedProgram = this.program;
  if (this.interestedProgram && !this.program) this.program = this.interestedProgram;
  if (this.status && !this.leadStatus) this.leadStatus = this.status;
  if (this.leadStatus && !this.status) this.status = this.leadStatus;
  if (this.assignedStaff && !this.counselorAssigned) this.counselorAssigned = this.assignedStaff;
  if (this.counselorAssigned && !this.assignedStaff) this.assignedStaff = this.counselorAssigned;
  next();
});

leadSchema.index({ name: 'text', email: 'text', program: 'text' });
leadSchema.index({ status: 1 });
leadSchema.index({ followUpDate: 1 });

export const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);
export default Lead;
