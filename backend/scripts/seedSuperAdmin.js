import { User } from '../models/User.js';
import { logger } from '../utils/logger.js';

/**
 * Seed Default Super Admin Account on Application Boot
 * Credentials: vishnu24.igm@gmail.com / vishnu@9121
 */
export const seedDefaultSuperAdmin = async () => {
  try {
    const adminEmail = 'vishnu24.igm@gmail.com';
    const adminPassword = 'vishnu@9121';

    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      admin = await User.create({
        name: 'Vishnu Super Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'super_admin',
        isVerified: true
      });
      logger.info(`✅ Default Super Admin auto-created successfully: ${adminEmail}`);
    } else {
      // Ensure role is super_admin
      if (admin.role !== 'super_admin') {
        admin.role = 'super_admin';
        await admin.save({ validateBeforeSave: false });
        logger.info(`✅ Default Super Admin role updated to super_admin for: ${adminEmail}`);
      }
    }
  } catch (error) {
    logger.error('Error seeding default super admin:', error.message);
  }
};
