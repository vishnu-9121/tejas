import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tejas_academy_local';
    console.log(`Connecting to database...`);
    await mongoose.connect(MONGODB_URI);
    
    const adminEmail = 'vishnu24.igm@gmail.com';
    const adminPassword = 'vishnu@9121';

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`[!] Super Admin user already exists with email: ${adminEmail}`);
      
      // Update password just in case they want to reset it using this script
      existingAdmin.password = adminPassword;
      existingAdmin.role = 'super_admin';
      existingAdmin.isVerified = true;
      await existingAdmin.save();
      console.log(`[+] Updated existing Super Admin password and role.`);
    } else {
      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'super_admin',
        isVerified: true
      });
      console.log(`[+] Successfully seeded Super Admin: ${adminEmail}`);
    }

    mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`[-] Error seeding admin: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
