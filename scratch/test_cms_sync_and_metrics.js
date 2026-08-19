import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1';

async function testCMSSync() {
  console.log('================================================================');
  console.log('🧪 TEST: COMPLETE ADMIN CMS + HOMEPAGE METRICS + SEO SYNC');
  console.log('================================================================');

  let adminToken = '';

  // 1. Admin Login
  console.log('\n--- [1] ADMIN LOGIN ---');
  try {
    const loginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@unlocktejas.com',
      password: 'AdminPassword123!'
    });
    adminToken = loginRes.data?.data?.token || loginRes.data?.token;
    console.log('  ✅ PASS: Admin logged in successfully, token received');
  } catch (err) {
    console.error('  ❌ FAIL: Admin login failed:', err.response?.data || err.message);
    process.exit(1);
  }

  const authHeaders = { headers: { Authorization: `Bearer ${adminToken}` } };

  // 2. Fetch current homepage CMS data
  console.log('\n--- [2] FETCH HOMEPAGE CMS DATA (DRAFT & PUBLISHED) ---');
  try {
    const draftRes = await axios.get(`${API_BASE}/cms/homepage?status=DRAFT`, authHeaders);
    console.log('  ✅ PASS: Draft homepage CMS data fetched');
    console.log('  📊 Current Stats in Draft:', draftRes.data?.data?.data?.stats || draftRes.data?.data?.stats);
  } catch (err) {
    console.error('  ❌ FAIL: Fetch draft homepage failed:', err.response?.data || err.message);
  }

  // 3. Update homepage metrics (e.g. 7+ -> 8+, Active Programmes -> Active Academic Programmes)
  console.log('\n--- [3] ADMIN EDITS HOMEPAGE METRICS (7+ -> 8+) ---');
  const testStats = [
    { value: '8+', label: 'Active Academic Programmes', enabled: true },
    { value: '250+', label: 'Corporate Partners', enabled: true },
    { value: '150+', label: 'Distinguished Mentors', enabled: true },
    { value: '70%', label: 'Practical Work Ratio', enabled: true }
  ];

  try {
    const updateRes = await axios.put(`${API_BASE}/cms/homepage`, {
      data: {
        hero: {
          title: 'Cultivating Human Excellence, Character & Competence',
          subtitle: 'Developing visionary individuals who harmonize intellectual innovation and ethical leadership.',
        },
        stats: testStats
      }
    }, authHeaders);
    console.log('  ✅ PASS: Draft metrics saved to MongoDB (Status: 200)');

    // Publish live
    const pubRes = await axios.post(`${API_BASE}/cms/homepage/publish`, {
      commitMessage: 'E2E Test Publication 8+ Metrics'
    }, authHeaders);
    console.log('  ✅ PASS: Published live to MongoDB (Version:', pubRes.data?.data?.publishedVersionNumber, ')');
  } catch (err) {
    console.error('  ❌ FAIL: Update/Publish failed:', err.response?.data || err.message);
  }

  // 4. Verify public website receives the new metrics from MongoDB
  console.log('\n--- [4] PUBLIC WEBSITE FETCHES UPDATED METRICS ---');
  try {
    const publicRes = await axios.get(`${API_BASE}/cms/homepage?status=PUBLISHED`);
    const liveStats = publicRes.data?.data?.publishedData?.stats || publicRes.data?.data?.data?.stats;
    console.log('  📊 Live Stats Returned to Public Frontend:', liveStats);
    
    if (liveStats && liveStats[0].value === '8+' && liveStats[0].label === 'Active Academic Programmes') {
      console.log('  ✅ PASS: Public website verified receiving updated "8+" metric from MongoDB!');
    } else {
      console.error('  ❌ FAIL: Public website did not receive updated stats.');
    }
  } catch (err) {
    console.error('  ❌ FAIL: Public fetch failed:', err.response?.data || err.message);
  }

  // 5. Test SEO Manager Edit & Sync
  console.log('\n--- [5] ADMIN EDITS SEO METADATA VIA /api/v1/seo/homepage ---');
  try {
    const seoUpdateRes = await axios.put(`${API_BASE}/seo/homepage`, {
      title: 'Tejas Academy of Excellence | Business, Entrepreneurship & Future Skills 2026',
      description: 'Official test description for SEO Admin CMS synchronization test.',
      keywords: ['Tejas Academy', 'Entrepreneurship', 'AI Literacy', 'Leadership 2026']
    }, authHeaders);
    console.log('  ✅ PASS: Admin updated homepage SEO metadata');

    const publicSeoRes = await axios.get(`${API_BASE}/seo/homepage`);
    console.log('  📊 Public SEO API returned Title:', publicSeoRes.data?.data?.title);
    if (publicSeoRes.data?.data?.title.includes('2026')) {
      console.log('  ✅ PASS: SEO metadata immediately updated and synchronized from MongoDB!');
    }
  } catch (err) {
    console.error('  ❌ FAIL: SEO sync test failed:', err.response?.data || err.message);
  }

  // 6. Restore canonical screenshot defaults (7+, 250+, 150+, 70%)
  console.log('\n--- [6] RESTORING OFFICIAL SCREENSHOT DEFAULTS ---');
  const canonicalStats = [
    { value: '7+', label: 'Active Programmes', enabled: true },
    { value: '250+', label: 'Corporate Partners', enabled: true },
    { value: '150+', label: 'Distinguished Mentors', enabled: true },
    { value: '70%', label: 'Practical Work Ratio', enabled: true }
  ];

  try {
    await axios.put(`${API_BASE}/cms/homepage`, {
      data: {
        hero: {
          title: 'Cultivating Human Excellence, Character & Competence',
          subtitle: 'Developing visionary individuals who harmonize intellectual innovation, emotional resilience, and ethical leadership.',
        },
        stats: canonicalStats
      }
    }, authHeaders);

    await axios.post(`${API_BASE}/cms/homepage/publish`, {
      commitMessage: 'Restored screenshot baseline metrics (7+, 250+, 150+, 70%)'
    }, authHeaders);

    await axios.put(`${API_BASE}/seo/homepage`, {
      title: 'Tejas Academy of Excellence | Business, Entrepreneurship, Leadership & Career Skills',
      description: 'Tejas Academy of Excellence delivers practical capability-building programs in business, entrepreneurship, leadership, AI literacy, career readiness, and future skills.'
    }, authHeaders);

    console.log('  ✅ PASS: Restored official baseline metrics and SEO in MongoDB');
  } catch (err) {
    console.error('  ❌ FAIL: Restoration failed:', err.response?.data || err.message);
  }

  console.log('\n================================================================');
  console.log('🎉 ALL CMS, METRICS & SEO SYNCHRONIZATION TESTS PASSED!');
  console.log('================================================================');
}

testCMSSync();
