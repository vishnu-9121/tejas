import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Filter, Download, Printer, MoreVertical, 
  Edit, Trash2, Eye, Ban, CheckCircle, ChevronDown, Shield, User, Users, GraduationCap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { studentService } from '@/services/studentService';
import { userService } from '@/services/userService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { Modal } from '@/components/ui/Modal';
import { exportToCSV } from '@/utils/exportToCSV';

export default function ManageStudents() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'students'
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  
  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Add User Modal State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [isAddingUser, setIsAddingUser] = useState(false);

  // Fetch Students
  const { data: studentData, isLoading: isStudentsLoading } = useQuery({
    queryKey: ['students', { page, search, status: statusFilter }],
    queryFn: () => studentService.getStudents({ page, limit: 10, search, status: statusFilter }),
    enabled: activeTab === 'students',
  });

  // Fetch All Registered Users
  const { data: usersData, isLoading: isUsersLoading } = useQuery({
    queryKey: ['all-users', { page }],
    queryFn: () => userService.getUsers({ page, limit: 20 }),
    enabled: activeTab === 'users',
  });

  const students = studentData?.data?.students || [];
  const studentTotalPages = studentData?.data?.pagination?.pages || 1;

  const usersList = usersData?.data?.users || [];
  const usersTotalPages = usersData?.data?.pages || 1;

  // Delete Student Mutation
  const deleteMutation = useMutation({
    mutationFn: studentService.deleteStudent,
    onSuccess: () => {
      toast.success('Student deleted successfully');
      queryClient.invalidateQueries(['students']);
      setIsDeleteModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete student');
    }
  });

  // Role Update Mutation
  const roleMutation = useMutation({
    mutationFn: ({ userId, role }) => userService.updateUserRole(userId, role),
    onSuccess: (res) => {
      toast.success(res.message || 'User role updated successfully');
      queryClient.invalidateQueries(['all-users']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update user role');
    }
  });

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsAddingUser(true);
    try {
      await userService.createUser(newUserData);
      toast.success(`User ${newUserData.name} created with role '${newUserData.role}'!`);
      queryClient.invalidateQueries(['all-users']);
      setIsAddUserModalOpen(false);
      setNewUserData({ name: '', email: '', password: '', role: 'student' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user.');
    } finally {
      setIsAddingUser(false);
    }
  };

  const getRoleBadge = (role, email) => {
    const isSuperAdmin = email === 'vishnu24.igm@gmail.com' || role === 'super_admin';
    if (isSuperAdmin) return <Badge variant="error" className="font-bold">Super Admin</Badge>;
    switch (role) {
      case 'admin': return <Badge variant="warning">Admin</Badge>;
      case 'faculty': case 'mentor': return <Badge variant="primary">Faculty / Mentor</Badge>;
      case 'student': return <Badge variant="success">Student (Default)</Badge>;
      default: return <Badge variant="default">{role || 'Student'}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users & Roles Management</h1>
          <p className="text-sm text-gray-500">Manage all registered website users, assign roles, and view student profiles.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" size="sm" className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white" onClick={() => setIsAddUserModalOpen(true)}>
            <Plus className="w-4 h-4" /> Add User & Assign Role
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'users' ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Registered Website Users & Roles ({usersData?.data?.total || 0})</span>
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'students' ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Enrolled Student Profiles</span>
        </button>
      </div>

      {/* VIEW 1: REGISTERED USERS & ROLE ASSIGNMENT */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Default Role: All users are Students by default (except vishnu24.igm@gmail.com)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Current Role</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Assign New Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isUsersLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      Loading registered users...
                    </td>
                  </tr>
                ) : usersList.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No registered users found.
                    </td>
                  </tr>
                ) : (
                  usersList.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                            {u.name?.[0] || 'U'}
                          </div>
                          <span className="font-semibold text-gray-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{u.email}</td>
                      <td className="px-6 py-4">
                        {getRoleBadge(u.role, u.email)}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select
                          className="bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold px-2.5 py-1.5 text-gray-700 cursor-pointer focus:ring-primary-500 focus:border-primary-500"
                          value={u.role || 'student'}
                          disabled={u.email === 'vishnu24.igm@gmail.com'}
                          onChange={(e) => roleMutation.mutate({ userId: u._id, role: e.target.value })}
                        >
                          <option value="student">Student (Default)</option>
                          <option value="faculty">Faculty / Mentor</option>
                          <option value="admin">Administrator</option>
                          <option value="super_admin">Super Admin</option>
                          <option value="operations_manager">Operations Manager</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {usersTotalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100">
              <Pagination currentPage={page} totalPages={usersTotalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: ENROLLED STUDENT PROFILES */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Student ID</th>
                  <th className="px-6 py-4">Program</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isStudentsLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">Loading student profiles...</td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">No enrolled student profiles found.</td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{student.user?.name || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{student.user?.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">{student.studentId}</td>
                      <td className="px-6 py-4 text-gray-600">{student.academicInfo?.program?.title || 'Not Assigned'}</td>
                      <td className="px-6 py-4"><Badge variant="success">{student.status}</Badge></td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="outline" size="sm" as={Link} to={`/admin/students/${student._id}`}>View Profile</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD USER MODAL */}
      <Modal isOpen={isAddUserModalOpen} onClose={() => setIsAddUserModalOpen(false)} title="Add User & Assign Role">
        <form onSubmit={handleCreateUser} className="space-y-4">
          <Input 
            label="Full Name" 
            placeholder="John Doe" 
            value={newUserData.name} 
            onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })} 
            required 
          />
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="user@tejas.edu" 
            value={newUserData.email} 
            onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })} 
            required 
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={newUserData.password} 
            onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })} 
            required 
          />
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Assign Role</label>
            <select
              className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary-500/20"
              value={newUserData.role}
              onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
            >
              <option value="student">Student (Default)</option>
              <option value="faculty">Faculty / Mentor</option>
              <option value="admin">Administrator</option>
              <option value="super_admin">Super Admin</option>
              <option value="operations_manager">Operations Manager</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" type="button" onClick={() => setIsAddUserModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" isLoading={isAddingUser}>Create & Assign Role</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
