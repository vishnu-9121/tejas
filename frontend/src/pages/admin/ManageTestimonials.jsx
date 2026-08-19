import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Star, Quote, CheckCircle, XCircle, Clock, Check, X, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

import { testimonialService } from '@/services/testimonialService';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

export default function ManageTestimonials() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'approved', 'rejected'
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    role: '', 
    program: '', 
    content: '', 
    rating: 5, 
    imageUrl: '', 
    status: 'approved' 
  });

  // Query all testimonials from backend (admin endpoint)
  const { data, isLoading } = useQuery({
    queryKey: ['admin-testimonials', activeTab],
    queryFn: () => testimonialService.getAdminTestimonials({ status: activeTab }),
  });

  const testimonialList = data?.data || [];
  const pendingCount = testimonialList.filter(t => t.status === 'pending').length;

  const mutation = useMutation({
    mutationFn: (payload) => selectedItem ? testimonialService.updateTestimonial(selectedItem._id, payload) : testimonialService.createTestimonial(payload),
    onSuccess: () => {
      toast.success(selectedItem ? 'Testimonial updated' : 'Testimonial created');
      queryClient.invalidateQueries(['admin-testimonials']);
      queryClient.invalidateQueries(['public-testimonials']);
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => testimonialService.updateStatus(id, status),
    onSuccess: (_, variables) => {
      toast.success(`Review ${variables.status === 'approved' ? 'Approved & Published' : 'Rejected'}`);
      queryClient.invalidateQueries(['admin-testimonials']);
      queryClient.invalidateQueries(['public-testimonials']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: testimonialService.deleteTestimonial,
    onSuccess: () => {
      toast.success('Testimonial deleted');
      queryClient.invalidateQueries(['admin-testimonials']);
      queryClient.invalidateQueries(['public-testimonials']);
      setIsDeleteModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete testimonial');
    }
  });

  const resetForm = () => {
    setSelectedItem(null);
    setFormData({ 
      name: '', 
      email: '', 
      role: '', 
      program: '', 
      content: '', 
      rating: 5, 
      imageUrl: '', 
      status: 'approved' 
    });
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({ 
      name: item.name, 
      email: item.email || '', 
      role: item.role, 
      program: item.program || '', 
      content: item.content, 
      rating: item.rating, 
      imageUrl: item.imageUrl || '',
      status: item.status || 'approved'
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const tabs = [
    { id: 'all', label: 'All Reviews' },
    { id: 'pending', label: 'Pending Moderation', countBadge: pendingCount },
    { id: 'approved', label: 'Approved & Live' },
    { id: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Manage Student Reviews & Testimonials</h1>
          <p className="text-sm text-gray-500 mt-1">Review, moderate, and publish verified alumni and student transformations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" className="flex items-center gap-2 font-semibold" onClick={() => { resetForm(); setIsModalOpen(true); }}>
            <Plus className="w-4 h-4" /> Add Testimonial
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2",
              activeTab === tab.id
                ? "border-primary-600 text-primary-700 bg-primary-50/40 rounded-t-lg"
                : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
            )}
          >
            <span>{tab.label}</span>
            {tab.id === 'pending' && pendingCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] bg-amber-500 text-white rounded-full font-extrabold animate-pulse">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-3"></div>
          <span>Loading reviews...</span>
        </div>
      ) : testimonialList.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-base font-semibold text-gray-700">No {activeTab !== 'all' ? activeTab : ''} reviews found.</p>
          <p className="text-xs text-gray-400 mt-1">Submitted student reviews will appear here for moderation.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonialList.map((item) => {
            const status = item.status || 'approved';
            return (
              <div key={item._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < item.rating ? 'fill-current' : 'text-gray-200'}`} />
                      ))}
                    </div>

                    {/* Status Badge */}
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border",
                      status === 'approved' && "bg-emerald-50 text-emerald-700 border-emerald-200",
                      status === 'pending' && "bg-amber-50 text-amber-700 border-amber-200 animate-pulse",
                      status === 'rejected' && "bg-red-50 text-red-700 border-red-200"
                    )}>
                      {status}
                    </span>
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed mb-5 line-clamp-4 italic">
                    "{item.content}"
                  </p>
                  
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm shrink-0">
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500 truncate">{item.role}</p>
                      {item.program && <p className="text-[11px] text-primary-600 font-semibold truncate">{item.program}</p>}
                    </div>
                  </div>
                </div>
                
                {/* Action Bar */}
                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                  {status === 'pending' ? (
                    <div className="flex items-center gap-2 w-full">
                      <Button
                        size="xs"
                        variant="primary"
                        onClick={() => statusMutation.mutate({ id: item._id, status: 'approved' })}
                        disabled={statusMutation.isLoading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex-1 flex items-center justify-center gap-1 py-1.5"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </Button>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => statusMutation.mutate({ id: item._id, status: 'rejected' })}
                        disabled={statusMutation.isLoading}
                        className="border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold flex-1 flex items-center justify-center gap-1 py-1.5"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px] text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(item)} 
                          className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item)} 
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Testimonial' : 'Add Testimonial'}
      >
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData); }} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Name <span className="text-red-500">*</span></label>
              <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. John Doe" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Role/Batch <span className="text-red-500">*</span></label>
              <Input required value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} placeholder="e.g. Alumni 2023" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Email (Optional)</label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Program / Degree</label>
              <Input value={formData.program} onChange={(e) => setFormData({...formData, program: e.target.value})} placeholder="e.g. B.Tech CS" />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Image URL (Optional)</label>
            <div className="flex gap-4">
              <Input type="url" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." className="flex-1" />
              {formData.imageUrl && (
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
                  <img src={formData.imageUrl} alt="preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Rating (1-5) <span className="text-red-500">*</span></label>
              <Input required type="number" min="1" max="5" value={formData.rating} onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Moderation Status</label>
              <select 
                value={formData.status} 
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="approved">Approved & Published</option>
                <option value="pending">Pending Moderation</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Content <span className="text-red-500">*</span></label>
            <Textarea required rows={4} value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} placeholder="Their testimonial..." />
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={mutation.isLoading}>
              {mutation.isLoading ? 'Saving...' : selectedItem ? 'Update' : 'Add'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Testimonial"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete the testimonial by <strong className="text-gray-900">{selectedItem?.name}</strong>? 
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button 
              variant="primary" 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => deleteMutation.mutate(selectedItem._id)}
              disabled={deleteMutation.isLoading}
            >
              {deleteMutation.isLoading ? 'Deleting...' : 'Yes, Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
