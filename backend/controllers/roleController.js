import { Role } from '../models/Role.js';
import { Permission } from '../models/Permission.js';
import { AppError } from '../middlewares/errorHandler.js';
import { sendResponse } from '../helpers/responseFormatter.js';
import { HTTP_STATUS } from '../constants/index.js';

const SYSTEM_PERMISSIONS = [
  { key: 'cms:view', name: 'View Headless CMS Pages', category: 'CMS', description: 'Can view draft and published CMS pages' },
  { key: 'cms:edit', name: 'Edit & Create CMS Pages', category: 'CMS', description: 'Can create and modify sections and pages' },
  { key: 'cms:publish', name: 'Publish CMS Content', category: 'CMS', description: 'Can publish and unpublish live content' },
  { key: 'media:manage', name: 'Manage Media Library', category: 'Media', description: 'Can upload, replace, and delete assets' },
  { key: 'users:manage', name: 'Manage Users & Profiles', category: 'Users', description: 'Can manage user accounts and statuses' },
  { key: 'roles:manage', name: 'Manage Enterprise RBAC', category: 'Roles', description: 'Can define custom roles and permissions' },
  { key: 'crm:leads', name: 'Manage CRM Leads & Inquiries', category: 'CRM', description: 'Can access and update lead pipeline' },
  { key: 'email:broadcast', name: 'Send Email Broadcasts', category: 'Email', description: 'Can create and dispatch email campaigns' },
  { key: 'analytics:view', name: 'View Realtime Analytics', category: 'Analytics', description: 'Can view analytics dashboard and traffic' },
  { key: 'settings:manage', name: 'Manage Global Settings', category: 'Settings', description: 'Can update website settings & SEO defaults' },
  { key: 'backups:manage', name: 'Manage Database Backups', category: 'System', description: 'Can create and restore system backups' },
];

export const getPermissionsCatalog = async (req, res, next) => {
  try {
    sendResponse(res, HTTP_STATUS.OK, 'Permissions catalog retrieved', SYSTEM_PERMISSIONS);
  } catch (error) {
    next(error);
  }
};

export const getRoles = async (req, res, next) => {
  try {
    let roles = await Role.find().sort('name').lean();
    if (roles.length === 0) {
      // Seed default system roles
      const defaultRoles = [
        { name: 'Super Admin', key: 'super_admin', description: 'Full system access', permissions: SYSTEM_PERMISSIONS.map(p => p.key), isSystem: true },
        { name: 'Administrator', key: 'admin', description: 'Administrative access', permissions: SYSTEM_PERMISSIONS.map(p => p.key).filter(k => k !== 'roles:manage'), isSystem: true },
        { name: 'Content Manager', key: 'content_manager', description: 'Manage website pages and media', permissions: ['cms:view', 'cms:edit', 'cms:publish', 'media:manage'], isSystem: true },
        { name: 'Student', key: 'student', description: 'Default student user role', permissions: [], isSystem: true },
      ];
      roles = await Role.insertMany(defaultRoles);
    }
    sendResponse(res, HTTP_STATUS.OK, 'Roles retrieved', roles);
  } catch (error) {
    next(error);
  }
};

export const createRole = async (req, res, next) => {
  try {
    const { name, description, permissions } = req.body;
    if (!name) {
      return next(new AppError('Role name is required', 400));
    }

    const key = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const existing = await Role.findOne({ key });
    if (existing) {
      return next(new AppError('A role with this name already exists', 400));
    }

    const role = await Role.create({
      name,
      key,
      description,
      permissions: permissions || [],
      isSystem: false
    });

    sendResponse(res, HTTP_STATUS.CREATED, 'Role created successfully', role);
  } catch (error) {
    next(error);
  }
};

export const updateRolePermissions = async (req, res, next) => {
  try {
    const { roleId } = req.params;
    const { permissions, description } = req.body;

    const role = await Role.findByIdAndUpdate(
      roleId,
      { permissions, description },
      { new: true, runValidators: true }
    );

    if (!role) {
      return next(new AppError('Role not found', 404));
    }

    sendResponse(res, HTTP_STATUS.OK, 'Role permissions updated', role);
  } catch (error) {
    next(error);
  }
};
