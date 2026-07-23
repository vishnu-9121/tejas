import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Plus, BookOpen, Star, Archive, 
  Edit2, Trash2, MoreVertical, Eye, FileText
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { programService } from '@/services/programService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { Modal } from '@/components/ui/Modal';
import { Tabs } from '@/components/ui/Tabs';

export default function ManagePrograms() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('active'); // active, archived, featured
  
  // Modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['programs', { page, search, tab: activeTab }],
    queryFn: () => {
      const params = { page, limit: 10, search };
      if (activeTab === 'active') params.isActive = true;
      if (activeTab === 'archived') params.isActive = false;
      if (activeTab === 'featured') {
        params.isActive = true;
        params.isFeatured = true;
      }
      return programService.getPrograms(params);
    },
    keepPreviousData: true,
  });

  const programs = data?.data?.programs || [];
  const totalPages = data?.data?.pagination?.pages || 1;
  const totalPrograms = data?.data?.pagination?.total || 0;

  const toggleArchiveMutation = useMutation({
    mutationFn: programService.toggleArchive,
    onSuccess: () => {
      toast.success('Program archive status updated');
      queryClient.invalidateQueries(['programs']);
    },
  });

  const toggleFeatureMutation = useMutation({
    mutationFn: programService.toggleFeature,
    onSuccess: () => {
      toast.success('Program feature status updated');
      queryClient.invalidateQueries(['programs']);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: programService.deleteProgram,
    onSuccess: () => {
      toast.success('Program permanently deleted');
      queryClient.invalidateQueries(['programs']);
      setIsDeleteModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete program');
    }
  });

  const handleDeleteConfirm = () => {
    if (programToDelete) {
      deleteMutation.mutate(programToDelete._id);
    }
  };

  const tabs = [
    { id: 'active', label: 'Active Programs' },
    { id: 'featured', label: 'Featured' },
    { id: 'archived', label: 'Archived' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Program Management</h1>
          <p className="text-sm text-gray-500">Create, edit, and manage academic programs and curriculums.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" className="flex items-center gap-2" as={Link} to="/admin/programs/new">
            <Plus className="w-4 h-4" /> Create Program
          </Button>
        </div>
      </div>

      {/* Analytics / Stats summary (simple for now) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Found</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalPrograms}</h3>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-100">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => { setActiveTab(id); setPage(1); }} className="px-4 pt-2" />
        </div>
        
        <div className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input 
              type="text" 
              placeholder="Search by program title..." 
              className="pl-10 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="w-full sm:w-auto flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter Categories
          </Button>
        </div>

        {/* Enterprise Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 font-medium border-y border-gray-200">
              <tr>
                <th className="px-6 py-4">Program Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Duration & Fees</th>
                <th className="px-6 py-4 text-center">Featured</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-3">
                      <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                      Loading programs...
                    </div>
                  </td>
                </tr>
              ) : programs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No programs found.
                  </td>
                </tr>
              ) : (
                programs.map((program) => (
                  <motion.tr 
                    key={program._id} 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{program.title}</div>
                      <div className="text-xs text-gray-500">{program.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="default">{program.category}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-medium">{program.duration}</div>
                      <div className="text-xs text-gray-500">₹{program.fees?.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => toggleFeatureMutation.mutate(program._id)}
                        className={`p-1.5 rounded-full transition-colors ${program.isFeatured ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                        title={program.isFeatured ? "Remove from Featured" : "Feature on Homepage"}
                      >
                        <Star className={`w-4 h-4 ${program.isFeatured ? 'fill-current' : ''}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {program.isActive ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="warning">Archived</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          as={Link} 
                          to={`/programs/${program.slug}`}
                          target="_blank"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4 text-gray-500 hover:text-primary-600" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          as={Link} 
                          to={`/admin/programs/${program._id}/edit`}
                          title="Edit Program"
                        >
                          <Edit2 className="w-4 h-4 text-primary-600" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => toggleArchiveMutation.mutate(program._id)}
                          title={program.isActive ? "Archive Program" : "Unarchive Program"}
                        >
                          <Archive className={`w-4 h-4 ${program.isActive ? 'text-warning-500' : 'text-success-500'}`} />
                        </Button>

                        {!program.isActive && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setProgramToDelete(program);
                              setIsDeleteModalOpen(true);
                            }}
                            title="Delete Permanently"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
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
        title="Delete Program"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to permanently delete <strong className="text-gray-900">{programToDelete?.title}</strong>? 
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
