import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Plus, Book, Edit2, Trash2, MoreVertical, Eye, PlayCircle, Clock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { courseService } from '@/services/courseService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { Modal } from '@/components/ui/Modal';
import { Tabs } from '@/components/ui/Tabs';

export default function ManageCourses() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(''); // '' means all
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['courses', { page, search, status: activeTab }],
    queryFn: () => courseService.getCourses({ page, limit: 10, search, status: activeTab }),
    keepPreviousData: true,
  });

  const courses = data?.data?.courses || [];
  const totalPages = data?.data?.pagination?.pages || 1;
  const totalCourses = data?.data?.pagination?.total || 0;

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }) => courseService.toggleStatus(id, status),
    onSuccess: (data, variables) => {
      toast.success(`Course marked as ${variables.status}`);
      queryClient.invalidateQueries(['courses']);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: courseService.deleteCourse,
    onSuccess: () => {
      toast.success('Course permanently deleted');
      queryClient.invalidateQueries(['courses']);
      setIsDeleteModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete course');
    }
  });

  const handleDeleteConfirm = () => {
    if (courseToDelete) deleteMutation.mutate(courseToDelete._id);
  };

  const tabs = [
    { id: '', label: 'All Courses' },
    { id: 'published', label: 'Published' },
    { id: 'draft', label: 'Drafts' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
          <p className="text-sm text-gray-500">Create modular courses, manage curriculum, and assign instructors.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" className="flex items-center gap-2" as={Link} to="/admin/courses/new">
            <Plus className="w-4 h-4" /> Create Course
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
            <Book className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Courses</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalCourses}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-100">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => { setActiveTab(id); setPage(1); }} className="px-4 pt-2" />
        </div>
        
        <div className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input 
              type="text" 
              placeholder="Search by course title..." 
              className="pl-10 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="w-full sm:w-auto flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter Topics
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 font-medium border-y border-gray-200">
              <tr>
                <th className="px-6 py-4">Course Info</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4">Duration & Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-3">
                      <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                      Loading courses...
                    </div>
                  </td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No courses found.
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <motion.tr 
                    key={course._id} 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{course.title}</div>
                      <div className="text-xs text-gray-500">{course.category || 'Uncategorized'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="default">{course.level}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" /> {course.duration || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {course.price === 0 ? 'Free' : `₹${course.price?.toLocaleString()}`}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${course.status === 'published' ? 'bg-success-50 text-success-700 border-success-200' : 'bg-warning-50 text-warning-700 border-warning-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                        value={course.status || 'draft'}
                        onChange={(e) => toggleStatusMutation.mutate({ id: course._id, status: e.target.value })}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          as={Link} 
                          to={`/courses/${course.slug}`}
                          target="_blank"
                          title="Preview Course"
                        >
                          <Eye className="w-4 h-4 text-gray-500 hover:text-primary-600" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          as={Link} 
                          to={`/admin/courses/${course._id}/edit`}
                          title="Edit Course"
                        >
                          <Edit2 className="w-4 h-4 text-primary-600" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setCourseToDelete(course);
                            setIsDeleteModalOpen(true);
                          }}
                          title="Delete Permanently"
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

      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Course"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to permanently delete <strong className="text-gray-900">{courseToDelete?.title}</strong>? 
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button 
              variant="primary" 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isLoading}
            >
              {deleteMutation.isLoading ? 'Deleting...' : 'Yes, Delete Permanently'}
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
