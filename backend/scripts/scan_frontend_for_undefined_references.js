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
    } else if (entry.isFile() && (entry.name.endsWith('.jsx') || entry.name.endsWith('.js'))) {
      files.push(fullPath);
    }
  }
  return files;
}

const allFiles = scanDir(srcDir);

const checks = [
  { symbol: 'useSocket', regex: /\buseSocket\s*\(/, importRegex: /\buseSocket\b/ },
  { symbol: 'getDashboardRoute', regex: /\bgetDashboardRoute\s*\(/, importRegex: /\bgetDashboardRoute\b/ },
  { symbol: 'getDashboardLabel', regex: /\bgetDashboardLabel\s*\(/, importRegex: /\bgetDashboardLabel\b/ },
  { symbol: 'useAuthStore', regex: /\buseAuthStore\s*\(/, importRegex: /\buseAuthStore\b/ },
  { symbol: 'useQuery', regex: /\buseQuery\s*\(/, importRegex: /\buseQuery\b/ },
  { symbol: 'useMutation', regex: /\buseMutation\s*\(/, importRegex: /\buseMutation\b/ },
  { symbol: 'useQueryClient', regex: /\buseQueryClient\s*\(/, importRegex: /\buseQueryClient\b/ },
  { symbol: 'useNavigate', regex: /\buseNavigate\s*\(/, importRegex: /\buseNavigate\b/ },
  { symbol: 'useLocation', regex: /\buseLocation\s*\(/, importRegex: /\buseLocation\b/ },
  { symbol: 'useParams', regex: /\buseParams\s*\(/, importRegex: /\buseParams\b/ },
  { symbol: 'useSearchParams', regex: /\buseSearchParams\s*\(/, importRegex: /\buseSearchParams\b/ },
  { symbol: 'Link', regex: /<Link\b/, importRegex: /\bLink\b/ },
  { symbol: 'Navigate', regex: /<Navigate\b/, importRegex: /\bNavigate\b/ },
  { symbol: 'toast', regex: /\btoast\.(success|error|info|warning|loading|\()/, importRegex: /\btoast\b/ },
  { symbol: 'motion', regex: /<motion\.[a-zA-Z0-9]+|\bmotion\.[a-zA-Z0-9]+/, importRegex: /\bmotion\b/ },
  { symbol: 'AnimatePresence', regex: /<AnimatePresence\b/, importRegex: /\bAnimatePresence\b/ },
  { symbol: 'SEO', regex: /<SEO\b/, importRegex: /\bSEO\b/ },
];

let issues = [];

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  
  // Skip the definition file itself
  for (const check of checks) {
    // Check if the symbol is defined in this file (e.g. export const useSocket = ...)
    const isDefinition = new RegExp(`(export\\s+(const|function|let|var)\\s+${check.symbol}\\b|const\\s+${check.symbol}\\s*=|function\\s+${check.symbol}\\b)`).test(content);
    if (isDefinition) continue;

    if (check.regex.test(content)) {
      if (!check.importRegex.test(content)) {
        issues.push({ file, symbol: check.symbol });
      }
    }
  }
}

console.log('=== COMPREHENSIVE SCAN FOR MISSING IDENTIFIERS & IMPORTS ===');
console.log('Total files checked:', allFiles.length);
console.log('Issues found:', issues.length);
issues.forEach(issue => {
  console.log(`❌ Missing [${issue.symbol}] in ${issue.file}`);
});
