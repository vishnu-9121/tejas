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

    let admin = await User.findOne({ email: adminEmail }).select('+password');

    if (!admin) {
      admin = await User.create({
        name: 'Vishnu Super Admin',
        email: adminEmail,
        password: adminPassword,
        phone: '9121000000',
        phoneNumber: '9121000000',
        role: 'super_admin',
        status: 'active',
        isEmailVerified: true
      });
      logger.info(`✅ Default Super Admin auto-created successfully: ${adminEmail}`);
    } else {
      const isPasswordValid = await admin.matchPassword(adminPassword);
      if (!isPasswordValid || admin.role !== 'super_admin' || admin.status !== 'active') {
        admin.role = 'super_admin';
        admin.status = 'active';
        if (!isPasswordValid) {
          admin.password = adminPassword;
        }
        await admin.save();
        logger.info(`✅ Default Super Admin credentials synced: ${adminEmail}`);
      } else {
        logger.info(`✅ Default Super Admin verified: ${adminEmail}`);
      }
    }
  } catch (error) {
    logger.error('Error seeding default super admin:', error.message);
  }
};
