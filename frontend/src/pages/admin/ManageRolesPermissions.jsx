import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Plus, Check, Lock, Key, Info } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/utils/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';

export default function ManageRolesPermissions() {
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [newRoleData, setNewRoleData] = useState({ name: '', description: '' });

  const { data: roles = [], isLoading: isRolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = await api.get('/roles');
      return res.data?.data || [];
    }
  });

  const { data: permissionsCatalog = [] } = useQuery({
    queryKey: ['permissions-catalog'],
    queryFn: async () => {
      const res = await api.get('/roles/permissions');
      return res.data?.data || [];
    }
  });

  const activeRole = selectedRole || roles[0];

  const updatePermissionsMutation = useMutation({
    mutationFn: ({ roleId, permissions }) => api.put(`/roles/${roleId}/permissions`, { permissions }),
    onSuccess: () => {
      toast.success('Role permissions updated successfully');
      queryClient.invalidateQueries(['roles']);
    },
    onError: () => toast.error('Failed to update permissions')
  });

  const handleTogglePermission = (permKey) => {
    if (!activeRole) return;
    const current = activeRole.permissions || [];
    const nextPerms = current.includes(permKey)
      ? current.filter(k => k !== permKey)
      : [...current, permKey];

    updatePermissionsMutation.mutate({ roleId: activeRole._id, permissions: nextPerms });
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-outfit">Enterprise Roles & Permissions (RBAC)</h1>
          <p className="text-sm text-gray-500">Configure granular system permissions and define custom user access matrices.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Roles List Sidebar */}
        <div className="lg:col-span-1 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Configured Roles</div>
          {roles.map(role => {
            const isSelected = activeRole?._id === role._id;
            return (
              <button
                key={role._id}
                onClick={() => setSelectedRole(role)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between ${
                  isSelected ? 'bg-primary-50 border border-primary-200 text-primary-900 shadow-sm' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div>
                  <div className="font-bold text-sm flex items-center gap-1.5">
                    <Shield className={`w-4 h-4 ${isSelected ? 'text-primary-600' : 'text-gray-400'}`} />
                    {role.name}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{role.permissions?.length || 0} permissions</div>
                </div>
                {role.isSystem && <Badge variant="default" className="text-[10px]">System</Badge>}
              </button>
            );
          })}
        </div>

        {/* Permissions Catalog Matrix */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          {activeRole ? (
            <>
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Key className="w-5 h-5 text-primary-600" />
                    Permission Matrix: {activeRole.name}
                  </h2>
                  <p className="text-xs text-gray-500">{activeRole.description}</p>
                </div>
                <Badge variant="primary" className="font-semibold">
                  {activeRole.permissions?.length || 0} Active Access Keys
                </Badge>
              </div>

              <div className="space-y-4">
                {permissionsCatalog.map(perm => {
                  const hasAccess = activeRole.permissions?.includes(perm.key);
                  return (
                    <div key={perm.key} className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                          <span>{perm.name}</span>
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-mono">{perm.key}</span>
                        </div>
                        <p className="text-xs text-gray-500">{perm.description}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleTogglePermission(perm.key)}
                        disabled={activeRole.key === 'super_admin'}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                          hasAccess ? 'bg-emerald-500 justify-end' : 'bg-gray-200 justify-start'
                        } ${activeRole.key === 'super_admin' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <motion.div layout className="w-4 h-4 rounded-full bg-white shadow-md" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-gray-500">Select a role to inspect permissions.</div>
          )}
        </div>
      </div>
    </div>
  );
}
