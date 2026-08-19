import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { Program } from '../models/Program.js';
import { Download } from '../models/Download.js';

const SANITY_PROJECT_ID = '6nl927hv';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2023-01-01';

async function inspect() {
  console.log('=== INSPECTING SANITY & MONGODB PROGRAMS ===');
  try {
    const query = `*[_type == "program"]{
      _id,
      title,
      "slug": slug.current,
      brochureUrl,
      "brochureFileUrl": brochureFile.asset->url,
      "curriculumFileUrl": curriculumFile.asset->url
    }`;
    const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const json = await res.json();
    const sanityPrograms = json.result || [];
    console.log('Sanity Programs Count:', sanityPrograms.length);
    console.log('Sanity Programs:', JSON.stringify(sanityPrograms, null, 2));

    await mongoose.connect(process.env.MONGODB_URI);
    const mongoPrograms = await Program.find({}, 'title slug brochureUrl brochure curriculum').lean();
    console.log('Mongo Programs Count:', mongoPrograms.length);
    console.log('Mongo Programs:', JSON.stringify(mongoPrograms, null, 2));

    const downloadCount = await Download.countDocuments();
    console.log('Existing Download tracking records in Mongo:', downloadCount);

    await mongoose.disconnect();
  } catch (err) {
    console.error('Inspection error:', err);
  }
}

inspect();
