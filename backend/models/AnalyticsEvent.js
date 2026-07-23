import mongoose from 'mongoose';

const AnalyticsEventSchema = new mongoose.Schema({
  // What happened
  event: {
    type: String,
    required: true,
    index: true,
    enum: [
      'page_view', 'session_start', 'session_end',
      'form_submit', 'cta_click', 'search_query',
      'program_view', 'application_start', 'application_submit',
      'download', 'signup', 'login', 'bounce'
    ]
  },

  // Who did it (nullable for anonymous visitors)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  visitorId: {
    type: String, // Anonymous fingerprint / session ID
    index: true
  },

  // Context
  page: { type: String },           // e.g. '/programs/mba'
  referrer: { type: String },       // Traffic source URL
  source: {
    type: String,
    enum: ['direct', 'organic', 'social', 'referral', 'paid', 'email', 'unknown'],
    default: 'direct'
  },
  device: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet', 'unknown'],
    default: 'unknown'
  },
  browser: { type: String },
  country: { type: String },

  // Searchable metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed  // e.g. { searchTerm: 'MBA', programId: '...', duration: 45 }
  },

  // Session tracking
  sessionDuration: { type: Number, default: 0 } // seconds
}, { timestamps: true });

// Compound indexes for fast aggregation queries
AnalyticsEventSchema.index({ event: 1, createdAt: -1 });
AnalyticsEventSchema.index({ source: 1, createdAt: -1 });
AnalyticsEventSchema.index({ page: 1, createdAt: -1 });

export const AnalyticsEvent = mongoose.model('AnalyticsEvent', AnalyticsEventSchema);
