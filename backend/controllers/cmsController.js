import { ContentEntry } from '../models/ContentEntry.js';
import { ContentPage } from '../models/ContentPage.js';
import { ContentVersion } from '../models/ContentVersion.js';
import { GlobalSettings } from '../models/GlobalSettings.js';
import { EnterpriseAuditService } from '../services/EnterpriseAuditService.js';
import { getIO } from '../utils/socket.js';

// Default initial data blueprints for different CMS page keys
const DEFAULT_CMS_DATA = {
  homepage: {
    hero: {
      title: 'Cultivating Human Excellence, Character & Competence',
      subtitle: '⚡ Born from the Spark of Brilliance',
      backgroundImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
      videoUrl: '',
      primaryCta: { text: 'Explore Programs', link: '/programs' },
      secondaryCta: { text: 'Apply for Admission', link: '/admissions' }
    },
    stats: [
      { label: 'Career Readiness Rate', value: '98%' },
      { label: 'Corporate Partners', value: '250+' },
      { label: 'Industry Mentors', value: '150+' },
      { label: 'Highest Package Potential', value: '₹42 LPA' }
    ],
    missionPreview: {
      title: 'Our Mission',
      content: 'To advance human excellence through transformative education, applied research, responsible entrepreneurship, ethical technology, and principled leadership development that creates enduring societal value.'
    },
    visionPreview: {
      title: 'Our Vision',
      content: 'To develop visionary individuals who embody intellectual innovation, emotional balance, ethical responsibility, courageous leadership, and meaningful contribution to the nation and the global society.'
    },
    partners: [
      { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
      { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
      { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' }
    ],
    footerCta: {
      title: 'Ignite Your Spark of Brilliance',
      subtitle: 'Join a community dedicated to character, competence, and responsible leadership. Applications for Academic Batch 2026 are now open.',
      buttonText: 'Apply for Admission',
      buttonLink: '/admissions'
    }
  },
  about: {
    hero: {
      title: 'About Tejas Academy of Excellence',
      subtitle: 'Forging ethical innovators, entrepreneurial builders, and global thought leaders.',
      backgroundImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80'
    },
    overview: 'Tejas Academy of Excellence exists to ignite the spark of brilliance in every learner, cultivating both character and competence for purposeful global leadership.',
    timeline: [
      { year: '2020', title: 'Foundation & Charter', description: 'Established with our inaugural cohort dedicated to human excellence, technology, and leadership.' },
      { year: '2022', title: 'Research & Labs Expansion', description: 'Inaugurated dedicated research laboratories in Artificial Intelligence and venture incubation.' },
      { year: '2024', title: 'Global Academic Pathways', description: 'Forged dual-degree pathways and collaborative research initiatives with leading global universities.' },
      { year: '2026', title: 'Next-Gen Innovation Center', description: 'Expanded corporate venture incubator and modern holistic residential campus in Gannavaram.' }
    ]
  },
  site_settings: {
    siteName: 'Tejas Academy of Excellence',
    tagline: 'Born from the Spark of Brilliance',
    motto: 'Valour in Heart. Discipline in Habit. Vigilance in Mind. Resilience in Spirit.',
    supportEmail: 'support@unlocktejas.com',
    admissionsEmail: 'support@unlocktejas.com',
    contactEmail: 'support@unlocktejas.com',
    email: 'support@unlocktejas.com',
    helplinePhone: '+91 83310 51327',
    contactPhone: '+91 83310 51327',
    supportPhone: '+91 83310 51327',
    phone: '+91 83310 51327',
    whatsapp: '+91 83310 51327',
    whatsappNumber: '918331051327',
    campusAddress: 'Beside L K Towers, Roy Nagar, Gannavaram, Vijayawada, Amaravathi - 521101',
    address: 'Beside L K Towers, Roy Nagar, Gannavaram, Vijayawada, Amaravathi - 521101',
    googleMapsEmbedUrl: '',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/unlocktejas',
      twitter: 'https://twitter.com/unlocktejas',
      instagram: 'https://instagram.com/unlocktejas',
      youtube: 'https://youtube.com/@unlocktejas',
      facebook: 'https://facebook.com/unlocktejas',
      whatsapp: 'https://wa.me/918331051327?text=Hello%20Tejas%20Academy%2C%20I%20would%20like%20to%20learn%20more.'
    }
  },
  'for-institutions': {
    title: 'Institutional Partnerships & Capacity Building',
    subtitle: 'Collaborate with Tejas Academy of Excellence on Faculty Development Programmes (FDP), applied research incubation, and student human excellence initiatives.',
    services: [
      {
        id: 'inst-1',
        title: 'Faculty Development Programs (FDP)',
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
  },
  recognitions: {
    title: 'Institutional Accreditations & Recognitions',
    subtitle: 'Demonstrating pedagogical integrity, academic excellence, and national industry alignment.',
    items: [
      {
        id: 'rec-1',
        title: 'Excellence in AI Curriculum & Pedagogy',
        issuingBody: 'National EdTech Council',
        year: '2025',
        description: 'Honored for pioneering hands-on GPU labs and industry-integrated artificial intelligence syllabi.'
      },
      {
        id: 'rec-2',
        title: 'Top 10 Higher Education Centers in Telangana',
        issuingBody: 'Higher Education Review India',
        year: '2025',
        description: 'Awarded for exceptional graduate career readiness and modern campus infrastructure.'
      },
      {
        id: 'rec-3',
        title: 'National Skill Development Charter',
        issuingBody: 'NSDC Certified Training Partner',
        year: '2024',
        description: 'Certified institutional training partner advancing youth digital skilling and technical competence.'
      }
    ]
  },
  'free_programs': {
    title: 'Free Knowledge & Open Masterclasses',
    subtitle: 'Access high-impact introductory courses, foundational workshops, and executive webinars open to all aspiring leaders.',
    programs: [
      {
        id: 'free-1',
        title: 'Generative AI & Prompt Engineering Masterclass',
        category: 'Artificial Intelligence',
        duration: '2 Hours Live',
        shortDescription: 'Hands-on introduction to Large Language Models, prompt crafting, and building practical AI workflow prototypes.',
        modulesCount: 4,
        enrollLink: '/contact'
      },
      {
        id: 'free-2',
        title: 'Foundations of Ethical Technology & Systems',
        category: 'Philosophy & Tech',
        duration: 'Self-Paced',
        shortDescription: 'Explore algorithmic governance, data privacy, and ethical frameworks defining tomorrow’s engineering leadership.',
        modulesCount: 6,
        enrollLink: '/contact'
      },
      {
        id: 'free-3',
        title: 'Executive Financial Literacy & Wealth Architecture',
        category: 'Finance',
        duration: '3 Hours Workshop',
        shortDescription: 'Master modern asset allocation, capital markets, and strategic personal financial planning.',
        modulesCount: 5,
        enrollLink: '/contact'
      }
    ]
  },
  'vision-mission': {
    title: 'Vision, Mission & Academic Philosophy',
    subtitle: 'Valour in Heart. Discipline in Habit. Vigilance in Mind. Resilience in Spirit.',
    vision: 'To develop visionary individuals who embody intellectual innovation, emotional balance, ethical responsibility, courageous leadership, and meaningful contribution to the nation and the world.',
    mission: 'To advance human excellence through transformative education, applied research, responsible entrepreneurship, ethical technology, and principled leadership development that creates enduring societal value.',
    philosophy: 'Knowledge → Practice → Feedback → Iteration → Mastery. Education at Tejas Academy transcends information transfer to cultivate holistic human capability, character, and lifelong leadership.',
    virtues: [
      { name: 'Integrity', description: 'Unyielding adherence to moral courage, ethical honesty, and accountability in thought, word, and deed.' },
      { name: 'Discipline', description: 'Systematic habits, focused diligence, and consistent daily execution essential for compounding capability.' },
      { name: 'Courage', description: 'The boldness to question dogma, embrace intellectual challenges, take calculated risks, and pioneer positive change.' },
      { name: 'Curiosity', description: 'Inquisitive pursuit of deep knowledge, lifelong learning, and innovative multidisciplinary exploration.' },
      { name: 'Service', description: 'Commitment to servant leadership, community upliftment, and creating enduring value for society and the nation.' },
      { name: 'Excellence', description: 'Relentless striving for the highest standards in character, craft, intellect, and professional mastery.' }
    ]
  },
  resources: {
    title: 'Student & Academic Resources',
    subtitle: 'Explore downloadable guides, research whitepapers, brochures, and foundational curriculum overviews.',
    items: [
      {
        id: 'res-1',
        title: 'Official Academic Prospectus 2026',
        category: 'Brochure',
        format: 'PDF (3.2 MB)',
        description: 'Complete institutional handbook detailing pedagogy, faculties, labs, and degree curricula.',
        downloadUrl: '/brochure.pdf'
      },
      {
        id: 'res-2',
        title: 'The Tejas Imperative of Human Excellence',
        category: 'Whitepaper',
        format: 'PDF (1.8 MB)',
        description: 'Comprehensive research paper outlining our 5-dimensional framework for character and competence.',
        downloadUrl: '/brochure.pdf'
      },
      {
        id: 'res-3',
        title: 'Foundations of Applied Artificial Intelligence',
        category: 'Curriculum Guide',
        format: 'PDF (2.4 MB)',
        description: 'Syllabus and prerequisite roadmap for undergraduate and professional deeptech certifications.',
        downloadUrl: '/brochure.pdf'
      }
    ]
  },
  contact: {
    heroTitle: 'Get in Touch with Our Academic Admissions Desk',
    heroSubtitle: 'Have questions about admissions, campus life, scholarships, or institutional partnerships? Our counselors are here to help.',
    phone: '+91 83310 51327',
    email: 'support@unlocktejas.com',
    address: 'Beside L K Towers, Roy Nagar, Gannavaram, Vijayawada, Amaravathi - 521101',
    officeHours: 'Monday – Saturday: 9:00 AM – 6:00 PM IST',
    googleMapsEmbedUrl: 'https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Gannavaram+(Tejas%20Academy)&t=&z=14&ie=UTF8&iwloc=B&output=embed'
  }
};

/**
 * 1. GET /api/v1/cms/:key
 * Fetch key-based CMS content (Draft or Published)
 */
export const getCmsDataByKey = async (req, res) => {
  try {
    const rawKey = req.params.key;
    const key = String(rawKey).toLowerCase().trim();
    const status = (req.query.status || 'PUBLISHED').toUpperCase();

    let entry = await ContentEntry.findOne({ key });

    // If not in DB, auto-seed default blueprint
    if (!entry) {
      const defaultData = DEFAULT_CMS_DATA[key] || {};
      entry = await ContentEntry.create({
        key,
        title: `${rawKey.charAt(0).toUpperCase() + rawKey.slice(1)} CMS Settings`,
        status: 'PUBLISHED',
        data: defaultData,
        publishedData: defaultData,
        publishedVersionNumber: 1,
        currentVersionNumber: 1,
        versions: [
          {
            versionNumber: 1,
            data: defaultData,
            commitMessage: 'Initial Baseline'
          }
        ]
      });
    }

    res.status(200).json({
      success: true,
      data: entry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 2. PUT /api/v1/cms/:key
 * Save working draft data for a key
 */
export const updateCmsDataByKey = async (req, res) => {
  try {
    const rawKey = req.params.key;
    const key = String(rawKey).toLowerCase().trim();
    const incomingData = req.body.data !== undefined ? req.body.data : req.body;

    let entry = await ContentEntry.findOne({ key });

    if (!entry) {
      entry = new ContentEntry({
        key,
        title: `${rawKey.charAt(0).toUpperCase() + rawKey.slice(1)} CMS Settings`,
        status: 'DRAFT',
        data: incomingData,
        publishedData: incomingData,
        publishedVersionNumber: 0,
        currentVersionNumber: 1,
      });
    } else {
      entry.data = incomingData;
      entry.status = 'DRAFT';
      entry.currentVersionNumber = (entry.currentVersionNumber || 1) + 1;
      if (req.user) entry.author = req.user._id;
    }

    await entry.save();

    EnterpriseAuditService.logCMSChange(req.user || { name: 'Admin', role: 'admin' }, 'draft_saved', key, { timestamp: new Date() }, req);

    res.status(200).json({
      success: true,
      message: 'Draft saved successfully',
      data: entry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 3. POST /api/v1/cms/:key/publish
 * Publish working draft live to website and record version snapshot
 */
export const publishCmsDataByKey = async (req, res) => {
  try {
    const rawKey = req.params.key;
    const key = String(rawKey).toLowerCase().trim();
    const commitMessage = req.body.commitMessage || `Published update on ${new Date().toLocaleString()}`;

    let entry = await ContentEntry.findOne({ key });

    if (!entry) {
      return res.status(404).json({ success: false, message: `CMS entry for '${rawKey}' not found` });
    }

    // Promote draft data to published data
    entry.publishedData = entry.data && Object.keys(entry.data).length > 0 ? entry.data : entry.publishedData;
    entry.status = 'PUBLISHED';
    entry.publishedVersionNumber = (entry.publishedVersionNumber || 0) + 1;

    // Record immutable version snapshot
    if (!Array.isArray(entry.versions)) entry.versions = [];
    entry.versions.push({
      versionNumber: entry.publishedVersionNumber,
      data: entry.publishedData,
      commitMessage,
      publishedAt: new Date(),
      publishedBy: req.user?._id || null
    });

    await entry.save();

    // Trigger instant WebSocket update to all live users
    const io = getIO();
    if (io) {
      io.emit('CMS_UPDATED', { key });
      io.emit('CMS_SETTINGS_UPDATED');
    }

    EnterpriseAuditService.logCMSChange(req.user || { name: 'Admin', role: 'admin' }, 'published', key, { versionNumber: entry.publishedVersionNumber }, req);

    res.status(200).json({
      success: true,
      message: 'Content published live successfully',
      data: entry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 4. GET /api/v1/cms/:key/versions
 * Get complete version history for a CMS key
 */
export const getCmsVersionsByKey = async (req, res) => {
  try {
    const key = String(req.params.key).toLowerCase().trim();
    const entry = await ContentEntry.findOne({ key }).select('versions key publishedVersionNumber');

    if (!entry) {
      return res.status(200).json({ success: true, data: [] });
    }

    res.status(200).json({
      success: true,
      data: (entry.versions || []).reverse()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 5. POST /api/v1/cms/:key/rollback
 * Roll back content to a specific historic version
 */
export const rollbackCmsDataByKey = async (req, res) => {
  try {
    const key = String(req.params.key).toLowerCase().trim();
    const { versionNumber } = req.body;

    const entry = await ContentEntry.findOne({ key });
    if (!entry) {
      return res.status(404).json({ success: false, message: `CMS entry for '${key}' not found` });
    }

    const historicVersion = (entry.versions || []).find(v => v.versionNumber === Number(versionNumber));
    if (!historicVersion) {
      return res.status(404).json({ success: false, message: `Version ${versionNumber} not found` });
    }

    // Rollback published and draft data
    entry.data = historicVersion.data;
    entry.publishedData = historicVersion.data;
    entry.publishedVersionNumber = historicVersion.versionNumber;
    entry.status = 'PUBLISHED';
    await entry.save();

    const io = getIO();
    if (io) {
      io.emit('CMS_UPDATED', { key });
      io.emit('CMS_SETTINGS_UPDATED');
    }

    EnterpriseAuditService.logCMSChange(req.user || { name: 'Admin', role: 'admin' }, 'rolled_back', key, { rolledBackToVersion: versionNumber }, req);

    res.status(200).json({
      success: true,
      message: `Successfully rolled back to Version ${versionNumber}`,
      data: entry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Custom Page Builder Routes (ContentPage)
 */
export const getPages = async (req, res) => {
  try {
    const pages = await ContentPage.find().select('title slug status scheduledPublishAt updatedAt').sort('-updatedAt');
    res.status(200).json({ success: true, data: pages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPublicPageBySlug = async (req, res) => {
  try {
    const page = await ContentPage.findOne({ slug: req.params.slug }).populate('publishedVersion');
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });

    let version = page.publishedVersion;
    if (req.query.preview === 'true' && req.user?.role === 'admin') {
      version = await ContentVersion.findById(page.draftVersion);
    }

    res.status(200).json({
      success: true,
      data: {
        pageMeta: page,
        blocks: version ? version.blocks : []
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPage = async (req, res) => {
  try {
    const { title, slug, seo } = req.body;
    const page = await ContentPage.create({ title, slug, seo, status: 'draft' });
    const draft = await ContentVersion.create({
      page: page._id,
      versionName: 'Initial Draft',
      blocks: [],
      createdBy: req.user.id,
      status: 'draft'
    });
    page.draftVersion = draft._id;
    await page.save();
    res.status(201).json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const saveDraft = async (req, res) => {
  try {
    const { blocks, versionName } = req.body;
    const pageId = req.params.id;
    const newDraft = await ContentVersion.create({
      page: pageId,
      versionName: versionName || `Draft - ${new Date().toLocaleString()}`,
      blocks,
      createdBy: req.user.id,
      status: 'draft'
    });
    const page = await ContentPage.findByIdAndUpdate(pageId, { draftVersion: newDraft._id, status: 'draft' }, { new: true });
    res.status(200).json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const publishPage = async (req, res) => {
  try {
    const pageId = req.params.id;
    const page = await ContentPage.findById(pageId);
    if (!page.draftVersion) return res.status(400).json({ success: false, message: 'No draft to publish.' });

    const draft = await ContentVersion.findById(page.draftVersion);
    draft.status = 'approved';
    draft.approvedBy = req.user.id;
    await draft.save();

    page.publishedVersion = page.draftVersion;
    page.status = 'published';
    await page.save();

    const io = getIO();
    if (io) io.emit('CMS_PAGE_UPDATED', { slug: page.slug });

    res.status(200).json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rollbackPage = async (req, res) => {
  try {
    const { versionId } = req.body;
    const pageId = req.params.id;
    const page = await ContentPage.findById(pageId);
    const historicVersion = await ContentVersion.findOne({ _id: versionId, page: pageId });
    if (!historicVersion) return res.status(404).json({ success: false, message: 'Version not found.' });

    page.publishedVersion = historicVersion._id;
    page.status = 'published';
    await page.save();

    const io = getIO();
    if (io) io.emit('CMS_PAGE_UPDATED', { slug: page.slug });

    res.status(200).json({ success: true, message: 'Successfully rolled back.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSettings = async (req, res) => {
  try {
    let settings = await GlobalSettings.findOne();
    if (!settings) settings = await GlobalSettings.create({});
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const settings = await GlobalSettings.findOneAndUpdate({}, { ...req.body, updatedBy: req.user.id }, { new: true, upsert: true });
    const io = getIO();
    if (io) io.emit('CMS_SETTINGS_UPDATED');
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
