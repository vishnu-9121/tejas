import 'dotenv/config';
import mongoose from 'mongoose';
import { ContentEntry } from '../backend/models/ContentEntry.js';

async function checkHomepage() {
  await mongoose.connect(process.env.MONGODB_URI);
  const hp = await ContentEntry.findOne({ key: 'homepage' });
  console.log('HOMEPAGE CMS ENTRY IN MONGODB:');
  console.log(JSON.stringify(hp, null, 2));
  await mongoose.disconnect();
}

checkHomepage();
