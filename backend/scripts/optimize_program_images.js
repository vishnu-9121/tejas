import 'dotenv/config';
import mongoose from 'mongoose';
import { Program } from '../models/Program.js';

async function optimizeProgramImages() {
  console.log('Optimizing Program images in MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);

  const cleanImageUrl = 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&q=80&w=1200';

  const programs = await Program.find();
  for (const prog of programs) {
    let modified = false;

    ['posterImage', 'poster', 'featuredImage', 'thumbnailUrl'].forEach(key => {
      if (typeof prog[key] === 'string' && prog[key].length > 1000) {
        prog[key] = cleanImageUrl;
        modified = true;
      }
    });

    if (prog.seo && typeof prog.seo.ogImage === 'string' && prog.seo.ogImage.length > 1000) {
      prog.seo.ogImage = cleanImageUrl;
      modified = true;
    }

    if (modified) {
      await prog.save();
      console.log(`✅ Cleaned massive base64 in program: "${prog.title}"`);
    }
  }

  console.log('🎉 Optimization completed successfully!');
  await mongoose.disconnect();
}

optimizeProgramImages();
