import express from 'express';
import { protect, authorize } from '../middlewares/auth.js';
import * as roleController from '../controllers/roleController.js';

const router = express.Router();
router.use(protect);

router.get('/permissions', roleController.getPermissionsCatalog);
router.get('/', authorize('admin', 'super_admin'), roleController.getRoles);
router.post('/', authorize('super_admin'), roleController.createRole);
router.put('/:roleId/permissions', authorize('super_admin'), roleController.updateRolePermissions);

export default router;
