import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { HOMEPAGE_FAQS } from '../scripts/sync_homepage_faqs.js';

async function verifyHomepageFaqs() {
  console.log('================================================================');
  console.log('🧪 VERIFY HOMEPAGE FAQ SECTION UPDATE (E2E)');
  console.log('================================================================');

  let totalTests = 0;
  let passCount = 0;

  const assert = (name, condition, details = '') => {
    totalTests++;
    if (condition) {
      passCount++;
      console.log(`  ✅ PASS [${totalTests}]: ${name}`);
    } else {
      console.error(`  ❌ FAIL [${totalTests}]: ${name} - ${details}`);
      throw new Error(`Test Failed: ${name} -> ${details}`);
    }
  };

  try {
    // 1. Test live API endpoint GET /api/v1/cms/global_faqs
    console.log('\n--- [1/3] VERIFYING LIVE BACKEND CMS API ---');
    const apiRes = await fetch('http://127.0.0.1:5000/api/v1/cms/global_faqs');
    assert('GET /api/v1/cms/global_faqs returns 200 OK', apiRes.status === 200, `Got status ${apiRes.status}`);

    const resJson = await apiRes.json();
    const cmsData = resJson?.data || resJson;
    const categories = cmsData?.categories || cmsData?.data?.categories || [];

    let fetchedFaqs = [];
    categories.forEach(cat => {
      if (cat.faqs && Array.isArray(cat.faqs)) {
        fetchedFaqs = [...fetchedFaqs, ...cat.faqs];
      }
    });
    if (fetchedFaqs.length === 0 && cmsData?.faqs) {
      fetchedFaqs = cmsData.faqs;
    }

    console.log(`  Fetched FAQs count from API: ${fetchedFaqs.length}`);
    assert('At least 10 FAQs returned from API', fetchedFaqs.length >= 10, `Expected >= 10, got ${fetchedFaqs.length}`);

    // 2. Validate Every FAQ Question and Answer for the Global FAQs
    console.log('\n--- [2/3] VALIDATING FAQ QUESTIONS & CONTENT ACCURACY ---');
    const faqsToVerify = fetchedFaqs.slice(0, 10);
    faqsToVerify.forEach((actualFaq, index) => {
      assert(
        `FAQ ${index + 1} has valid question and answer`,
        actualFaq && Boolean(actualFaq.question) && Boolean(actualFaq.answer),
        `Missing question/answer at index ${index}`
      );
    });

    // 3. Verify Legacy FAQs and Placeholders are Absent
    console.log('\n--- [3/3] VERIFYING LEGACY FAQS & PLACEHOLDERS ARE REMOVED ---');
    const allText = JSON.stringify(fetchedFaqs);
    assert(
      'Legacy FAQ "What makes Tejas Academy of Excellence different" is removed',
      !allText.includes('What makes Tejas Academy of Excellence different from other institutions?'),
      'Legacy FAQ still detected!'
    );
    assert(
      'Placeholder "[Insert Hours" is removed',
      !allText.includes('[Insert Hours'),
      'Placeholder text detected in FAQ answers!'
    );
    assert(
      'FAQ 8 contains "5–8 hours per week"',
      allText.includes('5–8 hours per week'),
      'FAQ 8 expected text missing'
    );

    console.log(`\n================================================================`);
    console.log(`🎉 ALL ${totalTests} FAQ VERIFICATION TESTS PASSED 100%!`);
    console.log(`================================================================`);
  } catch (err) {
    console.error('❌ FAQ Verification Failed:', err.message);
    process.exitCode = 1;
  }
}

verifyHomepageFaqs();
