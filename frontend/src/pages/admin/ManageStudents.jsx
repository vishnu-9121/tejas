import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Filter, Download, Printer, MoreVertical, 
  Edit, Trash2, Eye, Ban, CheckCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { studentService } from '@/services/studentService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { Modal } from '@/components/ui/Modal';
import { exportToCSV } from '@/utils/exportToCSV';

export default function ManageStudents() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  
  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Fetch Students
  const { data, isLoading, isError } = useQuery({
    queryKey: ['students', { page, search, status: statusFilter }],
    queryFn: () => studentService.getStudents({ page, limit: 10, search, status: statusFilter }),
    keepPreviousData: true,
  });

  const students = data?.data?.students || [];
  const totalPages = data?.data?.pagination?.pages || 1;

  // Delete Mutation
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

  // Status Update Mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => studentService.updateStudent(id, { status }),
    onSuccess: () => {
      toast.success('Student status updated');
      queryClient.invalidateQueries(['students']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  });

  const handleDeleteConfirm = () => {
    if (studentToDelete) {
      deleteMutation.mutate(studentToDelete._id);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(students.map(s => s._id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter(sId => sId !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active': return <Badge variant="success">Active</Badge>;
      case 'suspended': return <Badge variant="error">Suspended</Badge>;
      case 'alumni': return <Badge variant="primary">Alumni</Badge>;
      case 'dropped': return <Badge variant="warning">Dropped</Badge>;
      case 'pending': return <Badge variant="default">Pending</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
          <p className="text-sm text-gray-500">Manage all student profiles, enrollments, and academic records.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2" onClick={() => exportToCSV(students.map(s => ({ ID: s.studentId, Name: s.user?.name, Email: s.user?.email, Program: s.academicInfo?.program?.title || 'N/A', Status: s.status })), 'students_export')}>
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
            <Printer className="w-4 h-4" /> Print
          </Button>
          <Button variant="primary" size="sm" className="flex items-center gap-2" as={Link} to="/admin/students/new">
            <Plus className="w-4 h-4" /> Add Student
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input 
            type="text" 
            placeholder="Search by name, ID, or email..." 
            className="pl-10 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-500" />
            <select 
              className="bg-transparent border-none text-sm focus:ring-0 text-gray-700 w-full cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="alumni">Alumni</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions Banner */}
      <AnimatePresence>
        {selectedStudents.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-primary-50 border border-primary-200 rounded-lg p-3 flex justify-between items-center"
          >
            <span className="text-sm font-medium text-primary-700">
              {selectedStudents.length} students selected
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="bg-white h-8 text-xs" onClick={() => {
                const selectedData = students.filter(s => selectedStudents.includes(s._id)).map(s => ({ ID: s.studentId, Name: s.user?.name, Email: s.user?.email, Program: s.academicInfo?.program?.title || 'N/A', Status: s.status }));
                exportToCSV(selectedData, 'students_bulk_export');
              }}>Bulk Export</Button>
              <Button variant="outline" size="sm" className="bg-white h-8 text-xs text-red-600 border-red-200 hover:bg-red-50">Bulk Delete</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enterprise Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 w-12">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                    onChange={handleSelectAll}
                    checked={students.length > 0 && selectedStudents.length === students.length}
                  />
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-1">Student <ChevronDown className="w-3 h-3" /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-1">Student ID <ChevronDown className="w-3 h-3" /></div>
                </th>
                <th className="px-6 py-4">Program</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Enrollment Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-3">
                      <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                      Loading students...
                    </div>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No students found matching your criteria.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <motion.tr 
                    key={student._id} 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                        checked={selectedStudents.includes(student._id)}
                        onChange={() => handleSelectOne(student._id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm shrink-0 object-cover overflow-hidden">
                          {student.profileImage ? (
                            <img src={student.profileImage} alt={student.user?.name} className="w-full h-full object-cover" />
                          ) : (
                            student.user?.name?.[0] || 'U'
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{student.user?.name || 'N/A'}</div>
                          <div className="text-xs text-gray-500">{student.user?.email || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700">{student.studentId}</td>
                    <td className="px-6 py-4 text-gray-600">{student.academicInfo?.program?.title || 'Not Assigned'}</td>
                    <td className="px-6 py-4">
                      {getStatusBadge(student.status)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {student.academicInfo?.enrollmentDate ? new Date(student.academicInfo.enrollmentDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          as={Link} 
                          to={`/admin/students/${student._id}`}
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4 text-gray-500 hover:text-primary-600" />
                        </Button>
                        
                        {student.status === 'active' ? (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            onClick={() => statusMutation.mutate({ id: student._id, status: 'suspended' })}
                            title="Suspend Student"
                          >
                            <Ban className="w-4 h-4 text-warning-500" />
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            onClick={() => statusMutation.mutate({ id: student._id, status: 'active' })}
                            title="Activate Student"
                          >
                            <CheckCircle className="w-4 h-4 text-success-500" />
                          </Button>
                        )}

                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setStudentToDelete(student);
                            setIsDeleteModalOpen(true);
                          }}
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                      <div className="group-hover:hidden text-gray-400">
                        <MoreVertical className="w-4 h-4 ml-auto" />
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <Pagination 
              currentPage={page} 
              totalPages={totalPages} 
              onPageChange={setPage} 
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Student"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong className="text-gray-900">{studentToDelete?.user?.name}</strong>? 
            This action cannot be undone and will permanently remove their profile, academic records, and login access.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button 
              variant="primary" 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isLoading}
            >
              {deleteMutation.isLoading ? 'Deleting...' : 'Yes, Delete Student'}
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
