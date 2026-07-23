import mongoose from 'mongoose';

const GlobalSettingsSchema = new mongoose.Schema({
  // Global Typography & Colors (Design Tokens)
  theme: {
    primaryColor: { type: String, default: '#0284c7' },
    accentColor: { type: String, default: '#eab308' },
    fontFamily: { type: String, default: 'Inter, sans-serif' },
    headerFontFamily: { type: String, default: 'Outfit, sans-serif' },
    borderRadius: { type: String, default: '16px' }
  },
  
  // Navigation Menu (Header)
  navigation: [{
    label: { type: String, required: true },
    url: { type: String, required: true },
    isButton: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  }],
  
  // Footer Links & Company Info
  footer: {
    companyName: { type: String, default: 'Tejas Academy' },
    address: String,
    email: String,
    phone: String,
    socialLinks: {
      twitter: String,
      linkedin: String,
      facebook: String,
      instagram: String
    },
    legalLinks: [{
      label: String,
      url: String
    }]
  },

  // Emergency / Announcement Popup Banners
  activeBanner: {
    isActive: { type: Boolean, default: false },
    text: String,
    ctaText: String,
    ctaUrl: String,
    backgroundColor: { type: String, default: '#ef4444' } // e.g. red for urgency
  },

  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

export const GlobalSettings = mongoose.model('GlobalSettings', GlobalSettingsSchema);
