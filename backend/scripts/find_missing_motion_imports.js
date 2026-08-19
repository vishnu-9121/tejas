import fs from 'fs';
import path from 'path';

const srcDir = 'c:/Users/vishn/OneDrive/Desktop/tejas final/frontend/src';

function scanDir(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(scanDir(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.jsx') || entry.name.endsWith('.js') || entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
      files.push(fullPath);
    }
  }
  return files;
}

const allFiles = scanDir(srcDir);
const missingImports = [];

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  
  // Check if file uses motion JSX elements or motion()
  const usesMotion = /<motion\.[a-zA-Z0-9]+|\bmotion\.[a-zA-Z0-9]+|\bmotion\(/.test(content);
  const usesAnimatePresence = /<AnimatePresence\b/.test(content);

  // Check if imported
  const hasMotionImport = /import\s+[^;]*\bmotion\b[^;]*from\s+['"]framer-motion['"]/.test(content);
  const hasAnimatePresenceImport = /import\s+[^;]*\bAnimatePresence\b[^;]*from\s+['"]framer-motion['"]/.test(content);

  if (usesMotion && !hasMotionImport) {
    missingImports.push({ file, type: 'motion', line: findLine(content, /<motion\.[a-zA-Z0-9]+|\bmotion\.[a-zA-Z0-9]+|\bmotion\(/) });
  }

  if (usesAnimatePresence && !hasAnimatePresenceImport) {
    missingImports.push({ file, type: 'AnimatePresence', line: findLine(content, /<AnimatePresence\b/) });
  }
}

function findLine(content, regex) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (regex.test(lines[i])) return i + 1;
  }
  return 1;
}

console.log('Total files scanned:', allFiles.length);
console.log('Files with missing framer-motion imports:', missingImports.length);
missingImports.forEach(m => {
  console.log(`❌ [${m.type}] at line ${m.line} in ${m.file}`);
});
