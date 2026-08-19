import 'dotenv/config';
import mongoose from 'mongoose';
import { SEOPage } from '../models/SEOPage.js';
import { DEFAULT_SEO_PAGES } from '../controllers/seoController.js';

async function seedSEOPages() {
  console.log('================================================================');
  console.log('🚀 SEEDING MONGODB SEO PAGES FOR ALL 10 TOPIC CLUSTERS & CORE PAGES');
  console.log('================================================================');

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas Cluster');

    for (const page of DEFAULT_SEO_PAGES) {
      await SEOPage.findOneAndUpdate(
        { pageKey: page.pageKey },
        { ...page, updatedAt: new Date() },
        { upsert: true, new: true }
      );
      console.log(`  ✅ Synced SEO Page: "${page.pageKey}" (${page.route}) -> "${page.title}"`);
    }

    console.log('================================================================');
    console.log('🎉 ALL SEO PAGES SUCCESSFULLY SEEDED IN MONGODB!');
    console.log('================================================================');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to seed SEO pages:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedSEOPages();
