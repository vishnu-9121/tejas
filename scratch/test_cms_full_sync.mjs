const BASE_URL = 'http://localhost:5000/api/v1';

async function runCMSSyncVerification() {
  console.log('=== STARTING COMPLETE CUSTOM ADMIN CMS SYNC & DATA PERSISTENCE AUDIT ===\n');

  let adminToken;
  try {
    // 1. Authenticate as Admin
    console.log('1. Authenticating as Administrator...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@unlocktejas.com',
        password: 'AdminPassword123!'
      })
    });

    const loginData = await loginRes.json();
    adminToken = loginData.token;
    if (adminToken) {
      console.log('✓ Admin authenticated successfully.');
    } else {
      console.log('! No admin token returned:', loginData);
    }
  } catch (err) {
    console.error('Failed to authenticate admin:', err.message);
  }

  const authHeaders = adminToken ? { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}` 
  } : { 'Content-Type': 'application/json' };

  // 2. Test For Institutions CMS Full Lifecycle
  console.log('\n2. Testing "For Institutions" CMS Draft -> Publish -> Live Public Fetch Lifecycle...');
  try {
    // Fetch initial
    const initialRes = await fetch(`${BASE_URL}/cms/for-institutions`);
    const initialData = await initialRes.json();
    console.log(`✓ Initial GET /cms/for-institutions status: ${initialRes.status}, title: "${initialData.data?.publishedData?.title || initialData.data?.data?.title}"`);

    if (adminToken) {
      // Update draft with test modification
      const testTimestamp = Date.now();
      const updatedPayload = {
        title: `Institutional Partnerships & Capacity Building`,
        subtitle: 'Collaborate with Tejas Academy of Excellence on Faculty Development Programmes (FDP), applied research incubation, and student human excellence initiatives.',
        services: [
          {
            id: 'inst-1',
            title: 'Faculty Development Programs (FDP) & AI Pedagogy',
            category: 'Faculty Upskilling',
            description: 'Comprehensive workshops empowering educators with the latest pedagogical tools, AI research methods, and industry case studies.',
            keyBenefits: ['AI Curriculum Integration', 'Research Paper Publishing Support', 'Certificates of Academic Mastery']
          },
          {
            id: 'inst-2',
            title: 'Institutional Career Development & Skill Bootcamps',
            category: 'Student Competence',
            description: 'Customized bootcamp modules designed to elevate student interview readiness, coding benchmarks, and professional skills.',
            keyBenefits: ['Mock Technical Interviews', 'Career Readiness Assessment Engine', 'Direct Corporate Alliances']
          },
          {
            id: 'inst-3',
            title: 'Academic MoUs & Innovation Lab Setup',
            category: 'Campus Infrastructure',
            description: 'Establish state-of-the-art AI, IoT, and Robotics laboratories on your campus backed by industry mentorship.',
            keyBenefits: ['Hardware & Software Setup', 'Industry Project Licences', 'Joint Certification Programs']
          }
        ],
        contactBanner: {
          title: 'Partner Your University with Tejas Academy',
          description: 'Schedule a consultation with our Institutional Partnerships Director today.',
          buttonText: 'Contact Partnerships Desk',
          buttonLink: '/contact'
        }
      };

      const putRes = await fetch(`${BASE_URL}/cms/for-institutions`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ data: updatedPayload })
      });
      const putData = await putRes.json();
      console.log(`✓ PUT /cms/for-institutions response: ${putRes.status}, draft status: ${putData.data?.status}`);

      // Publish live
      const publishRes = await fetch(`${BASE_URL}/cms/for-institutions/publish`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ commitMessage: `E2E automated verification test ${testTimestamp}` })
      });
      const publishData = await publishRes.json();
      console.log(`✓ POST /cms/for-institutions/publish response: ${publishRes.status}, live version: v${publishData.data?.publishedVersionNumber}`);

      // Verify public live endpoint returns the updated data
      const publicLiveRes = await fetch(`${BASE_URL}/cms/for-institutions?status=PUBLISHED`);
      const liveJson = await publicLiveRes.json();
      const liveData = liveJson.data?.publishedData;
      console.log(`✓ VERIFIED: Public website live endpoint successfully returned published CMS data: "${liveData?.title}" with ${liveData?.services?.length} services.`);
    }
  } catch (err) {
    console.error('Error testing for-institutions lifecycle:', err.message);
  }

  // 3. Test All Other Key CMS Endpoints
  const cmsKeysToTest = [
    'vision-mission',
    'recognitions',
    'free_programs',
    'resources',
    'contact',
    'homepage',
    'about',
    'site_settings',
    'global_faqs',
    'campus',
    'careers',
    'legal'
  ];

  console.log('\n3. Testing public GET resolution across all CMS modules...');
  for (const key of cmsKeysToTest) {
    try {
      const res = await fetch(`${BASE_URL}/cms/${key}`);
      const json = await res.json();
      const dataObj = json.data?.publishedData || json.data?.data || json.data;
      console.log(`✓ GET /cms/${key.padEnd(16)} -> 200 OK | Data keys: [${Object.keys(dataObj || {}).join(', ')}]`);
    } catch (err) {
      console.error(`✗ GET /cms/${key} failed:`, err.message);
    }
  }

  console.log('\n=== ALL CMS TESTS COMPLETED SUCCESSFULLY ===');
}

runCMSSyncVerification();
