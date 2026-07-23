import express from 'express';
import { protect, authorize } from '../middlewares/auth.js';
import * as leadController from '../controllers/leadController.js';

const router = express.Router();

// Public endpoint to capture lead from landing page / contact forms
router.post('/public', leadController.createLead);

// Protected CRM management routes
router.use(protect);
router.get('/', authorize('admin', 'super_admin', 'operations_manager'), leadController.getLeads);
router.post('/', authorize('admin', 'super_admin', 'operations_manager'), leadController.createLead);
router.put('/:leadId/status', authorize('admin', 'super_admin', 'operations_manager'), leadController.updateLeadStatus);
router.put('/:leadId/assign', authorize('admin', 'super_admin'), leadController.assignLeadStaff);

export default router;
