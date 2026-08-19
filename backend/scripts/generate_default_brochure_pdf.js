import fs from 'fs';
import path from 'path';

function createValidPdf(outputPath, title = "Tejas Academy of Excellence - Academic Prospectus") {
  const contentStream = `
BT
/F1 22 Tf
50 720 Td
(TEJAS ACADEMY OF EXCELLENCE) Tj
ET
BT
/F2 14 Tf
50 690 Td
(Official Academic Prospectus & Program Curriculum) Tj
ET
BT
/F1 11 Tf
50 650 Td
(Welcome to Tejas Academy of Excellence.) Tj
0 -18 Td
(Empowering Future Leaders through Values, Technology, and Industry Mentorship.) Tj
0 -30 Td
(Key Highlights:) Tj
0 -18 Td
(- Elite Industry Mentorship from Global Technology Practitioners) Tj
0 -18 Td
(- Hands-On Capstone Projects and Advanced Simulation Labs) Tj
0 -18 Td
(- Cutting-Edge Curriculum in AI, Robotics, Software Architecture & Management) Tj
0 -18 Td
(- Comprehensive Career Development and Global Network Access) Tj
0 -40 Td
(Official Contact Details:) Tj
0 -18 Td
(Email: support@unlocktejas.com) Tj
0 -18 Td
(Phone / WhatsApp: +91 83310 51327) Tj
0 -18 Td
(Website: https://unlocktejas.com) Tj
0 -18 Td
(Campus: Beside L K Towers, Roy Nagar, Gannavaram, Vijayawada, Amaravathi - 521101) Tj
ET
`;

  const streamLength = Buffer.byteLength(contentStream, 'utf-8');

  const pdf = `%PDF-1.4
1 0 obj
<<
  /Type /Catalog
  /Pages 2 0 R
>>
endobj
2 0 obj
<<
  /Type /Pages
  /Kids [3 0 R]
  /Count 1
>>
endobj
3 0 obj
<<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [0 0 595 842]
  /Contents 4 0 R
  /Resources <<
    /Font <<
      /F1 <<
        /Type /Font
        /Subtype /Type1
        /BaseFont /Helvetica-Bold
      >>
      /F2 <<
        /Type /Font
        /Subtype /Type1
        /BaseFont /Helvetica
      >>
    >>
  >>
>>
endobj
4 0 obj
<<
  /Length ${streamLength}
>>
stream
${contentStream}
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000350 00000 n 
trailer
<<
  /Size 5
  /Root 1 0 R
>>
startxref
${450 + streamLength}
%%EOF`;

  fs.writeFileSync(outputPath, pdf, 'utf-8');
  console.log(`✅ Generated valid PDF at: ${outputPath}`);
}

const publicPdfPath = path.resolve('../frontend/public/brochure.pdf');
createValidPdf(publicPdfPath);
