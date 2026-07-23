import mongoose from 'mongoose';

const SearchLogSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  resultsCount: {
    type: Number,
    default: 0
  },
  filters: {
    type: mongoose.Schema.Types.Mixed // { category: 'programs', ... }
  },
  clickedResult: {
    type: String, // e.g. 'program:abc123'
    default: null
  }
}, { timestamps: true });

SearchLogSchema.index({ query: 1, createdAt: -1 });

export const SearchLog = mongoose.model('SearchLog', SearchLogSchema);
