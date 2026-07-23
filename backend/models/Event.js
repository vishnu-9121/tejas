import mongoose from 'mongoose';
import slugify from 'slugify';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an event title'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Academic', 'Cultural', 'Leadership', 'Career', 'Other'],
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true, // e.g., '10:00 AM - 02:00 PM'
    },
    location: {
      type: String,
      required: true,
      default: 'Tejas Academy Campus',
    },
    mapUrl: {
      type: String,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    image: {
      type: String,
      default: 'default-event.jpg',
    },
    registrationLink: {
      type: String,
    },
    capacity: {
      type: Number,
    },
    agenda: [
      {
        time: String,
        title: String,
        speaker: String,
      }
    ],
    speakers: [
      {
        name: String,
        designation: String,
        image: String,
      }
    ],
    status: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Past', 'Cancelled'],
      default: 'Upcoming',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create event slug from the title before saving
eventSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    // Append a random string or date to ensure uniqueness if titles repeat
    const baseSlug = slugify(this.title, { lower: true, strict: true });
    this.slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
  }
  next();
});

eventSchema.index({ status: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ date: 1 });

export const Event = mongoose.model('Event', eventSchema);
