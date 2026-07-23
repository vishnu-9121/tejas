import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const backupDir = path.join(__dirname, '../backups');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

/**
 * Exports JSON snapshots of all active Mongoose collections for backup & migration
 */
export const backupCollections = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri || mongoUri.includes('your_mongodb_connection_string_here')) {
      console.log('[Backup] Skipping remote backup — running in local memory mode.');
      return;
    }

    await mongoose.connect(mongoUri);
    console.log('[Backup] Connected to MongoDB for backup export...');

    const collections = await mongoose.connection.db.listCollections().toArray();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const targetFolder = path.join(backupDir, `backup_${timestamp}`);

    fs.mkdirSync(targetFolder, { recursive: true });

    for (const col of collections) {
      const data = await mongoose.connection.db.collection(col.name).find({}).toArray();
      const filePath = path.join(targetFolder, `${col.name}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`[Backup] Exported collection '${col.name}' (${data.length} records) ➔ ${filePath}`);
    }

    console.log(`[Backup] Complete! Backup saved to: ${targetFolder}`);
  } catch (error) {
    console.error('[Backup] Error during backup export:', error.message);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
};

if (process.argv[2] === '--run') {
  backupCollections();
}
