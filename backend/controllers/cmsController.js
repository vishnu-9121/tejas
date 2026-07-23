import { ContentPage } from '../models/ContentPage.js';
import { ContentVersion } from '../models/ContentVersion.js';
import { GlobalSettings } from '../models/GlobalSettings.js';
import { EnterpriseAuditService } from '../services/EnterpriseAuditService.js';
import { getIO } from '../utils/socket.js';
import mongoose from 'mongoose';

/**
 * 1. GET /api/v1/cms/pages
 * List all pages
 */
export const getPages = async (req, res) => {
  try {
    const pages = await ContentPage.find().select('title slug status scheduledPublishAt updatedAt').sort('-updatedAt');
    res.status(200).json({ success: true, data: pages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 2. GET /api/v1/cms/pages/:slug
 * Fetch the PUBLIC published version of a page (for the frontend)
 */
export const getPublicPageBySlug = async (req, res) => {
  try {
    const page = await ContentPage.findOne({ slug: req.params.slug })
      .populate('publishedVersion');
    
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    if (!page.publishedVersion && req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Page is not published yet.' });
    }

    // Admins can see the draft if requested (preview mode)
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

/**
 * 3. POST /api/v1/cms/pages
 * Create a new empty page
 */
export const createPage = async (req, res) => {
  try {
    const { title, slug, seo } = req.body;
    
    // 1. Create Page
    const page = await ContentPage.create({
      title,
      slug,
      seo,
      status: 'draft'
    });

    // 2. Create Initial Empty Draft Version
    const draft = await ContentVersion.create({
      page: page._id,
      versionName: 'Initial Draft',
      blocks: [],
      createdBy: req.user.id,
      status: 'draft'
    });

    // 3. Link Draft to Page
    page.draftVersion = draft._id;
    await page.save();

    res.status(201).json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 4. PUT /api/v1/cms/pages/:id/draft
 * Admin saves a draft. Creates a new ContentVersion.
 */
export const saveDraft = async (req, res) => {
  try {
    const { blocks, versionName } = req.body;
    const pageId = req.params.id;

    // We never overwrite. Always create a new version to maintain infinite history.
    const newDraft = await ContentVersion.create({
      page: pageId,
      versionName: versionName || `Draft - ${new Date().toLocaleString()}`,
      blocks,
      createdBy: req.user.id,
      status: 'draft'
    });

    const page = await ContentPage.findByIdAndUpdate(pageId, {
      draftVersion: newDraft._id,
      status: 'draft'
    }, { new: true });

    EnterpriseAuditService.logCMSChange(req.user, 'draft_saved', page?.slug || pageId, { versionName: newDraft.versionName }, req);

    res.status(200).json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 5. POST /api/v1/cms/pages/:id/publish
 * Approves a draft and pushes it to publishedVersion. Live instantly.
 */
export const publishPage = async (req, res) => {
  try {
    const pageId = req.params.id;
    const page = await ContentPage.findById(pageId);

    if (!page.draftVersion) {
      return res.status(400).json({ success: false, message: 'No draft to publish.' });
    }

    // 1. Mark the draft version as approved
    const draft = await ContentVersion.findById(page.draftVersion);
    draft.status = 'approved';
    draft.approvedBy = req.user.id;
    await draft.save();

    // 2. Promote draft to published
    page.publishedVersion = page.draftVersion;
    page.status = 'published';
    await page.save();

    // 3. Trigger WebSocket Invalidation for frontend users to instantly see changes
    const io = getIO();
    if (io) {
      io.emit('CMS_PAGE_UPDATED', { slug: page.slug });
    }

    EnterpriseAuditService.logCMSChange(req.user, 'published', page.slug, { versionId: page.publishedVersion }, req);

    res.status(200).json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 6. POST /api/v1/cms/pages/:id/rollback
 * Rolls back the published version to a specific historic version
 */
export const rollbackPage = async (req, res) => {
  try {
    const { versionId } = req.body;
    const pageId = req.params.id;

    const page = await ContentPage.findById(pageId);
    
    // Verify version exists and belongs to this page
    const historicVersion = await ContentVersion.findOne({ _id: versionId, page: pageId });
    if (!historicVersion) return res.status(404).json({ success: false, message: 'Version not found.' });

    // Instantly roll back the live site
    page.publishedVersion = historicVersion._id;
    page.status = 'published';
    await page.save();

    const io = getIO();
    if (io) io.emit('CMS_PAGE_UPDATED', { slug: page.slug });

    EnterpriseAuditService.logCMSChange(req.user, 'rolled_back', page.slug, { rolledBackToVersion: versionId }, req);

    res.status(200).json({ success: true, message: 'Successfully rolled back.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 7. GET /api/v1/cms/settings
 * Get Global Settings (Typography, Menus, Footer)
 */
export const getSettings = async (req, res) => {
  try {
    let settings = await GlobalSettings.findOne();
    if (!settings) {
      // Seed default settings if none exist
      settings = await GlobalSettings.create({});
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 8. PUT /api/v1/cms/settings
 * Update Global Settings
 */
export const updateSettings = async (req, res) => {
  try {
    const settings = await GlobalSettings.findOneAndUpdate({}, {
      ...req.body,
      updatedBy: req.user.id
    }, { new: true, upsert: true });

    const io = getIO();
    if (io) io.emit('CMS_SETTINGS_UPDATED');

    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
