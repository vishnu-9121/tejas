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
      title: 'Empowering the Next Generation of Visionary Leaders',
      subtitle: 'World-Class Academic Programs, High-Impact Mentorship, and Industry-Aligned Research',
      backgroundImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
      videoUrl: '',
      primaryCta: { text: 'Explore Programs', link: '/programs' },
      secondaryCta: { text: 'Apply for Admission', link: '/admissions' }
    },
    stats: [
      { label: 'Graduates Placed', value: '98%' },
      { label: 'Corporate Partners', value: '250+' },
      { label: 'Industry Mentors', value: '150+' },
      { label: 'Highest Package', value: '₹42 LPA' }
    ],
    missionPreview: {
      title: 'Our Purpose',
      content: 'To democratize access to world-class, outcome-oriented leadership education.'
    },
    visionPreview: {
      title: 'Our Vision',
      content: 'To build India’s foremost hub for transformative technology and entrepreneurial minds.'
    },
    partners: [
      { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
      { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
      { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' }
    ],
    footerCta: {
      title: 'Begin Your Journey at Tejas Academy',
      subtitle: 'Applications for Academic Batch 2026 are currently open with merit scholarships.',
      buttonText: 'Start Application',
      buttonLink: '/admissions'
    }
  },
  about: {
    hero: {
      title: 'About Tejas Academy of Excellence',
      subtitle: 'Forging ethical innovators, entrepreneurial builders, and global thought leaders.',
      backgroundImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80'
    },
    overview: 'Tejas Academy was founded with the mission to redefine higher education in India through practical innovation and character building.',
    timeline: [
      { year: '2020', title: 'Foundation & Charter', description: 'Established with our inaugural cohort in technology and leadership.' },
      { year: '2022', title: 'Campus Expansion', description: 'Inaugurated dedicated research laboratories in Artificial Intelligence.' },
      { year: '2024', title: 'Global Academic Partnerships', description: 'Forged dual-degree pathways with leading global universities.' },
      { year: '2026', title: 'Next-Gen Innovation Center', description: 'Expanded corporate venture incubator and modern hostel facilities.' }
    ]
  },
  site_settings: {
    siteName: 'Tejas Academy of Excellence',
    tagline: 'Empowering Visionary Global Leaders',
    supportEmail: 'support@unlocktejas.com',
    admissionsEmail: 'support@unlocktejas.com',
    contactEmail: 'support@unlocktejas.com',
    helplinePhone: '+91 83310 51327',
    contactPhone: '+91 83310 51327',
    whatsappNumber: '918331051327',
    campusAddress: 'Beside L K Towers, Roy Nagar, Gannavaram - 521101',
    googleMapsEmbedUrl: '',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/unlocktejas',
      twitter: 'https://twitter.com/unlocktejas',
      instagram: 'https://instagram.com/unlocktejas',
      youtube: 'https://youtube.com/@unlocktejas'
    }
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
