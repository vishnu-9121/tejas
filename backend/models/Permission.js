import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['CMS', 'Media', 'Users', 'Roles', 'CRM', 'Email', 'Analytics', 'Settings', 'Security', 'System'],
    },
    description: {
      type: String,
      default: '',
    }
  },
  {
    timestamps: true,
  }
);

export const Permission = mongoose.model('Permission', permissionSchema);
