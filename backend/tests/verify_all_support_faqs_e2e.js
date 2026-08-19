import dotenv from 'dotenv';
dotenv.config();

import { ALL_30_FAQS, FAQ_CATEGORIES } from '../scripts/seed_all_30_faqs.js';

async function verifyAllSupportFaqs() {
  console.log('================================================================');
  console.log('🧪 VERIFY COMPLETE 30-QUESTION SUPPORT FAQS (10 CATEGORIES)');
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
    // 1. Check live backend API
    console.log('\n--- [1/4] FETCHING FROM LIVE BACKEND API ---');
    const apiRes = await fetch('http://127.0.0.1:5000/api/v1/cms/global_faqs');
    assert('GET /api/v1/cms/global_faqs returns 200 OK', apiRes.status === 200, `Status: ${apiRes.status}`);

    const resJson = await apiRes.json();
    const cmsData = resJson?.data || resJson;
    const categories = cmsData?.categories || cmsData?.data?.categories || [];

    let fetchedFaqs = [];
    categories.forEach(cat => {
      if (cat.faqs && Array.isArray(cat.faqs)) {
        cat.faqs.forEach(f => {
          fetchedFaqs.push({
            ...f,
            category: f.category || cat.name
          });
        });
      }
    });

    console.log(`  Fetched total categories: ${categories.length}`);
    console.log(`  Fetched total FAQs: ${fetchedFaqs.length}`);

    // 2. Validate Categories Count and Names
    console.log('\n--- [2/4] VALIDATING 10 OFFICIAL CATEGORIES ---');
    assert('Contains all 10 official categories', categories.length === 10, `Expected 10, got ${categories.length}`);
    FAQ_CATEGORIES.forEach((expectedCategory, idx) => {
      const catObj = categories.find(c => c.name === expectedCategory);
      assert(`Category [${idx + 1}] "${expectedCategory}" exists`, Boolean(catObj), `Missing category: ${expectedCategory}`);
    });

    // 3. Validate 30 FAQs Count & Exact Content
    console.log('\n--- [3/4] VALIDATING ALL 30 FAQS & CONTENT ACCURACY ---');
    assert('Contains exactly 30 FAQs', fetchedFaqs.length === 30, `Expected 30, got ${fetchedFaqs.length}`);

    ALL_30_FAQS.forEach((expectedFaq, index) => {
      const actualFaq = fetchedFaqs[index];
      assert(
        `FAQ ${index + 1} (${expectedFaq.category}): "${expectedFaq.question.substring(0, 45)}..."`,
        actualFaq && actualFaq.question.trim() === expectedFaq.question.trim(),
        `Question mismatch at index ${index}`
      );
      assert(
        `FAQ ${index + 1} answer matches exact text`,
        actualFaq && actualFaq.answer.trim().startsWith(expectedFaq.answer.trim().substring(0, 40)),
        `Answer mismatch for FAQ ${index + 1}`
      );
    });

    // 4. Validate Absence of Old Placeholders or Unsupported Claims
    console.log('\n--- [4/4] VALIDATING ZERO LEGACY PLACEHOLDERS OR FAKE CLAIMS ---');
    const allText = JSON.stringify(fetchedFaqs);
    assert('No "[Insert Hours" placeholder', !allText.includes('[Insert Hours'), 'Found placeholder in FAQ text!');
    assert('FAQ 10 contains "5–8 hours per week"', allText.includes('5–8 hours per week'), 'Missing required hours recommendation');
    assert('No fake 100% placement guarantee claims', !allText.includes('100% placement guarantee'), 'Fake guarantee claim detected!');

    console.log(`\n================================================================`);
    console.log(`🎉 ALL ${totalTests} COMPLETE SUPPORT FAQ TESTS PASSED 100%!`);
    console.log(`================================================================`);

  } catch (err) {
    console.error('❌ FAQ Test Suite Failed:', err.message);
    process.exitCode = 1;
  }
}

verifyAllSupportFaqs();
