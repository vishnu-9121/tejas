import mongoose from 'mongoose';

// The Block Schema represents an individual chunk of UI on the frontend.
// e.g. HeroBlock, StatsBlock, ProgramsBlock, etc.
const BlockSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'HeroBlock', 'StatsBlock', 'FacultyBlock', 'ProgramsBlock', 
      'EventsBlock', 'TestimonialsBlock', 'GalleryBlock', 'FaqBlock', 
      'RichTextBlock', 'CallToActionBlock'
    ]
  },
  // The flexible JSON payload that the specific React component will consume
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // To allow admins to reorder blocks
  order: {
    type: Number,
    default: 0
  },
  // For A/B Testing or temporary hiding
  isActive: {
    type: Boolean,
    default: true
  }
}, { _id: false }); // Disable separate IDs for subdocuments to keep it clean

const ContentVersionSchema = new mongoose.Schema({
  page: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ContentPage',
    required: true,
    index: true
  },
  // A label given by the admin (e.g. "Fall 2026 Campaign Update")
  versionName: {
    type: String,
    required: true
  },
  // The actual layout of the page in this version
  blocks: [BlockSchema],
  
  // Approval Workflow
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: ['draft', 'in_review', 'approved', 'archived'],
    default: 'draft'
  }
}, { timestamps: true });

export const ContentVersion = mongoose.model('ContentVersion', ContentVersionSchema);
