import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, Edit2, Trash2, Calendar as CalendarIcon, MapPin, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { workshopService } from '@/services/workshopService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';

export default function ManageWorkshops() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [workshopToDelete, setWorkshopToDelete] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['workshops', { page, search }],
    queryFn: () => workshopService.getWorkshops({ page, limit: 10, search }),
    keepPreviousData: true,
  });

  const workshopList = data?.data?.workshops || [];
  const totalPages = data?.data?.pagination?.pages || 1;
  const totalWorkshops = data?.data?.pagination?.total || 0;

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }) => workshopService.toggleStatus(id, status),
    onSuccess: () => {
      toast.success('Workshop status updated');
      queryClient.invalidateQueries(['workshops']);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: workshopService.deleteWorkshop,
    onSuccess: () => {
      toast.success('Workshop deleted');
      queryClient.invalidateQueries(['workshops']);
      setIsDeleteModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete workshop');
    }
  });

  const handleDeleteConfirm = () => {
    if (workshopToDelete) deleteMutation.mutate(workshopToDelete._id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workshops Management</h1>
          <p className="text-sm text-gray-500">Create and manage skill-building workshops.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" className="flex items-center gap-2" as={Link} to="/admin/workshops/new">
            <Plus className="w-4 h-4" /> Add Workshop
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center border-b border-gray-100">
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input 
              type="text" 
              placeholder="Search workshops..." 
              className="pl-10 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="text-sm font-medium text-gray-500">
            Total: {totalWorkshops} Workshops
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="flex justify-center items-center gap-3">
              <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              Loading workshops...
            </div>
          </div>
        ) : workshopList.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No workshops found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-medium border-y border-gray-200">
                <tr>
                  <th className="px-6 py-4">Title & Details</th>
                  <th className="px-6 py-4">Schedule & Location</th>
                  <th className="px-6 py-4">Capacity</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {workshopList.map((workshop) => (
                  <tr key={workshop._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{workshop.title}</div>
                      <div className="text-xs text-gray-500 mt-1">Speaker: {workshop.speaker}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-gray-400" />
                          <span>{new Date(workshop.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span>{workshop.location}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{workshop.bookedSeats} / {workshop.totalSeats} booked</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 max-w-[120px]">
                        <div 
                          className="bg-primary-600 h-1.5 rounded-full" 
                          style={{ width: `${Math.min((workshop.bookedSeats / workshop.totalSeats) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select 
                        value={workshop.status}
                        onChange={(e) => toggleStatusMutation.mutate({ id: workshop._id, status: e.target.value })}
                        className={`text-xs font-bold px-3 py-1 rounded-full outline-none cursor-pointer appearance-none ${
                          workshop.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                          workshop.status === 'ongoing' ? 'bg-amber-100 text-amber-700' :
                          workshop.status === 'completed' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" as={Link} to={`/admin/workshops/${workshop._id}/edit`}>
                          <Edit2 className="w-4 h-4 text-primary-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => { setWorkshopToDelete(workshop); setIsDeleteModalOpen(true); }}
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
        title="Delete Workshop"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong className="text-gray-900">{workshopToDelete?.title}</strong>? 
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
              {deleteMutation.isLoading ? 'Deleting...' : 'Yes, Delete Workshop'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
