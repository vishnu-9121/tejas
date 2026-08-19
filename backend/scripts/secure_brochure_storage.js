import fs from 'fs';
import path from 'path';

function ensureInternalBrochureStorage() {
  const dir = path.resolve('./storage/brochures');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const publicPdf = path.resolve('../frontend/public/brochure.pdf');
  const targetPdf = path.join(dir, 'default_brochure.pdf');

  if (fs.existsSync(publicPdf)) {
    fs.copyFileSync(publicPdf, targetPdf);
    // Remove from public to prevent unauthenticated static bypassing
    fs.unlinkSync(publicPdf);
    console.log('✅ Secured default brochure inside backend/storage/brochures/default_brochure.pdf and removed public unauthenticated bypass.');
  } else {
    console.log('✅ Target storage ready at:', targetPdf);
  }
}

ensureInternalBrochureStorage();
