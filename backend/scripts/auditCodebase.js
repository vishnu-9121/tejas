import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.join(__dirname, '..');

const dirsToAudit = [
  'config',
  'constants',
  'controllers',
  'events',
  'helpers',
  'middlewares',
  'models',
  'routes',
  'services',
  'utils',
  'validators'
];

async function runAudit() {
  console.log('--- Starting Backend Module Import Audit ---');
  let errors = [];
  let auditedCount = 0;

  for (const dirName of dirsToAudit) {
    const fullPath = path.join(backendDir, dirName);
    if (!fs.existsSync(fullPath)) continue;

    const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.js'));
    for (const file of files) {
      const filePath = path.join(fullPath, file);
      try {
        await import(`file://${filePath.replace(/\\/g, '/')}`);
        auditedCount++;
        console.log(`[OK] Imported: ${dirName}/${file}`);
      } catch (err) {
        console.error(`[ERROR] Failed to import: ${dirName}/${file}`);
        errors.push({ file: `${dirName}/${file}`, error: err.message, stack: err.stack });
      }
    }
  }

  console.log(`\nAudit Complete: ${auditedCount} modules processed.`);
  if (errors.length > 0) {
    console.error(`Found ${errors.length} import error(s):`);
    console.error(JSON.stringify(errors, null, 2));
    process.exit(1);
  } else {
    console.log('ALL BACKEND MODULE IMPORTS PASSED SUCCESSFULLY!');
  }
}

runAudit();
