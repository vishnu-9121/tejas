import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Star, Quote } from 'lucide-react';
import { toast } from 'sonner';

import { testimonialService } from '@/services/testimonialService';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Pagination } from '@/components/ui/Pagination';

export default function ManageTestimonials() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', role: '', content: '', rating: 5, imageUrl: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['testimonials', { page }],
    queryFn: () => testimonialService.getTestimonials({ page, limit: 12 }),
    keepPreviousData: true,
  });

  const testimonialList = data?.data || [];
  // The backend might not support pagination for testimonials yet according to what I saw. I'll check its length.
  // Actually getTestimonials returns an array directly inside data.data based on the backend getTestimonialsService. Let's assume pagination might be added later, for now we just map.

  const mutation = useMutation({
    mutationFn: (data) => selectedItem ? testimonialService.updateTestimonial(selectedItem._id, data) : testimonialService.createTestimonial(data),
    onSuccess: () => {
      toast.success(selectedItem ? 'Testimonial updated' : 'Testimonial created');
      queryClient.invalidateQueries(['testimonials']);
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: testimonialService.deleteTestimonial,
    onSuccess: () => {
      toast.success('Testimonial deleted');
      queryClient.invalidateQueries(['testimonials']);
      setIsDeleteModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete testimonial');
    }
  });

  const resetForm = () => {
    setSelectedItem(null);
    setFormData({ name: '', role: '', content: '', rating: 5, imageUrl: '' });
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({ name: item.name, role: item.role, content: item.content, rating: item.rating, imageUrl: item.imageUrl || '' });
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Testimonials</h1>
          <p className="text-sm text-gray-500">Add, edit, and organize alumni/student testimonials.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" className="flex items-center gap-2" onClick={() => { resetForm(); setIsModalOpen(true); }}>
            <Plus className="w-4 h-4" /> Add Testimonial
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-gray-500">Loading testimonials...</div>
      ) : testimonialList.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-white rounded-xl shadow-sm">No testimonials found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonialList.map((item) => (
            <div key={item._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group">
              <div>
                <Quote className="w-8 h-8 text-primary-200 mb-4" />
                <p className="text-gray-700 italic text-sm line-clamp-4 leading-relaxed mb-6">"{item.content}"</p>
                
                <div className="flex items-center gap-3">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center">
                      {item.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500">{item.role}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < item.rating ? 'fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(item)} className="p-1.5 text-primary-600 hover:bg-primary-50 rounded transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item)} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
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
              <label className="text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
              <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. John Doe" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Role/Batch <span className="text-red-500">*</span></label>
              <Input required value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} placeholder="e.g. Alumni 2023" />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Image URL (Optional)</label>
            <div className="flex gap-4">
              <Input type="url" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." className="flex-1" />
              {formData.imageUrl && (
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
                  <img src={formData.imageUrl} alt="preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Rating (1-5) <span className="text-red-500">*</span></label>
            <Input required type="number" min="1" max="5" value={formData.rating} onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})} />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Content <span className="text-red-500">*</span></label>
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
              className="bg-red-600 hover:bg-red-700"
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
