import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Search, Plus, Edit2, Trash2, LayoutGrid, List as ListIcon, Star, Briefcase
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { mentorService } from '@/services/mentorService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';

export default function ManageMentors() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [mentorToDelete, setMentorToDelete] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['mentors', { page, search }],
    queryFn: () => mentorService.getMentors({ page, limit: 10, search }),
    keepPreviousData: true,
  });

  const mentorList = data?.data?.mentors || [];
  const totalPages = data?.data?.pagination?.pages || 1;
  const totalMentors = data?.data?.pagination?.total || 0;

  const toggleFeatureMutation = useMutation({
    mutationFn: mentorService.toggleFeature,
    onSuccess: () => {
      toast.success('Feature status updated');
      queryClient.invalidateQueries(['mentors']);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: mentorService.deleteMentor,
    onSuccess: () => {
      toast.success('Mentor profile deleted');
      queryClient.invalidateQueries(['mentors']);
      setIsDeleteModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete mentor');
    }
  });

  const handleDeleteConfirm = () => {
    if (mentorToDelete) deleteMutation.mutate(mentorToDelete._id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Industry Mentors</h1>
          <p className="text-sm text-gray-500">Manage industry leaders guiding the students.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" className="flex items-center gap-2" as={Link} to="/admin/mentors/new">
            <Plus className="w-4 h-4" /> Add Mentor
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Mentors</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalMentors}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center border-b border-gray-100">
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input 
              type="text" 
              placeholder="Search by name, company, or industry..." 
              className="pl-10 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white shadow text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white shadow text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setViewMode('list')}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="flex justify-center items-center gap-3">
              <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              Loading mentor profiles...
            </div>
          </div>
        ) : mentorList.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No mentors found.
          </div>
        ) : viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-medium border-y border-gray-200">
                <tr>
                  <th className="px-6 py-4">Mentor</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Industry</th>
                  <th className="px-6 py-4 text-center">Featured</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mentorList.map((mentor) => (
                  <tr key={mentor._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                        {mentor.user?.name?.[0] || 'M'}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{mentor.user?.name}</div>
                        <div className="text-xs text-gray-500">{mentor.designation}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{mentor.company}</td>
                    <td className="px-6 py-4 text-gray-700">{mentor.industry}</td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => toggleFeatureMutation.mutate(mentor._id)}
                        className={`p-1.5 rounded-full transition-colors ${mentor.isFeatured ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                      >
                        <Star className={`w-4 h-4 ${mentor.isFeatured ? 'fill-current' : ''}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" as={Link} to={`/admin/mentors/${mentor._id}/edit`}>
                          <Edit2 className="w-4 h-4 text-primary-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => { setMentorToDelete(mentor); setIsDeleteModalOpen(true); }}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mentorList.map((mentor) => (
              <motion.div 
                key={mentor._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group relative"
              >
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => toggleFeatureMutation.mutate(mentor._id)}
                    className={`p-1.5 rounded-full bg-white shadow-sm transition-colors ${mentor.isFeatured ? 'text-amber-500' : 'text-gray-400 hover:text-amber-500'}`}
                  >
                    <Star className={`w-4 h-4 ${mentor.isFeatured ? 'fill-current' : ''}`} />
                  </button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 bg-white shadow-sm text-primary-600 hover:bg-primary-50" as={Link} to={`/admin/mentors/${mentor._id}/edit`}>
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0 bg-white shadow-sm text-red-600 hover:bg-red-50"
                    onClick={() => { setMentorToDelete(mentor); setIsDeleteModalOpen(true); }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
                
                <div className="p-6 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-2xl mb-4">
                    {mentor.user?.name?.[0] || 'M'}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{mentor.user?.name}</h3>
                  <p className="text-sm font-medium text-gray-600">{mentor.designation}</p>
                  <p className="text-sm font-bold text-primary-600 mb-4">at {mentor.company}</p>
                  <div className="flex flex-wrap justify-center gap-1 mb-4">
                    {mentor.expertise?.slice(0, 3).map((exp, i) => (
                      <span key={i} className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
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
        title="Delete Mentor Profile"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to permanently delete <strong className="text-gray-900">{mentorToDelete?.user?.name}</strong>? 
            This action will also remove their underlying user account. It cannot be undone.
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
