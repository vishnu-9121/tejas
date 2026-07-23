import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, LayoutGrid, List as ListIcon, Image as ImageIcon, Video, Star } from 'lucide-react';
import { toast } from 'sonner';

import { galleryService } from '@/services/galleryService';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Pagination } from '@/components/ui/Pagination';

export default function ManageGallery() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  
  const [formData, setFormData] = useState({ 
    title: '', 
    mediaType: 'image',
    imageUrl: '', 
    videoUrl: '',
    album: 'General',
    description: '',
    category: 'campus',
    isFeatured: false,
    isActive: true
  });

  const { data, isLoading } = useQuery({
    queryKey: ['gallery', { page, category }],
    queryFn: () => galleryService.getGallery({ page, limit: 12, category }),
    keepPreviousData: true,
  });

  const mediaList = data?.data?.images || [];
  const totalPages = data?.data?.pagination?.totalPages || 1;

  const mutation = useMutation({
    mutationFn: (data) => selectedMedia ? galleryService.updateGalleryImage(selectedMedia._id, data) : galleryService.addGalleryImage(data),
    onSuccess: () => {
      toast.success(selectedMedia ? 'Media updated' : 'Media added');
      queryClient.invalidateQueries(['gallery']);
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: galleryService.deleteGalleryImage,
    onSuccess: () => {
      toast.success('Media deleted');
      queryClient.invalidateQueries(['gallery']);
      setIsDeleteModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete media');
    }
  });

  const resetForm = () => {
    setSelectedMedia(null);
    setFormData({ 
      title: '', 
      mediaType: 'image',
      imageUrl: '', 
      videoUrl: '',
      album: 'General',
      description: '',
      category: 'campus',
      isFeatured: false,
      isActive: true
    });
  };

  const handleEdit = (media) => {
    setSelectedMedia(media);
    setFormData({ 
      title: media.title, 
      mediaType: media.mediaType || 'image',
      imageUrl: media.imageUrl, 
      videoUrl: media.videoUrl || '',
      album: media.album || 'General',
      description: media.description || '',
      category: media.category,
      isFeatured: media.isFeatured || false,
      isActive: media.isActive !== false
    });
    setIsModalOpen(true);
  };

  const handleDelete = (media) => {
    setSelectedMedia(media);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery & Media</h1>
          <p className="text-sm text-gray-500">Manage albums, images, videos, and featured media.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" className="flex items-center gap-2" onClick={() => { resetForm(); setIsModalOpen(true); }}>
            <Plus className="w-4 h-4" /> Add Media
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center border-b border-gray-100">
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              value={category} 
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="flex h-10 w-full sm:w-auto rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              <option value="campus">Campus Life</option>
              <option value="events">Events</option>
              <option value="students">Students</option>
              <option value="alumni">Alumni</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <button 
              className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setViewMode('list')}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-gray-500">Loading media...</div>
        ) : mediaList.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No media found.</div>
        ) : viewMode === 'grid' ? (
          <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mediaList.map((media) => (
              <div key={media._id} className="group relative rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-50">
                <img src={media.imageUrl} alt={media.title} className="w-full h-full object-cover" />
                
                {/* Overlay Badges */}
                <div className="absolute top-2 left-2 flex gap-1">
                  {media.mediaType === 'video' ? (
                    <span className="bg-black/60 backdrop-blur text-white text-[10px] px-2 py-1 rounded flex items-center gap-1">
                      <Video className="w-3 h-3" /> Video
                    </span>
                  ) : (
                    <span className="bg-black/60 backdrop-blur text-white text-[10px] px-2 py-1 rounded flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" /> Image
                    </span>
                  )}
                  {media.isFeatured && (
                    <span className="bg-amber-500/80 backdrop-blur text-white text-[10px] px-2 py-1 rounded flex items-center gap-1">
                      <Star className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <h4 className="text-white font-medium text-sm truncate max-w-[120px]">{media.title}</h4>
                      <span className="text-xs text-primary-300 capitalize">{media.album || media.category}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(media)} className="p-1.5 bg-white/20 hover:bg-white/40 rounded backdrop-blur text-white transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(media)} className="p-1.5 bg-red-500/80 hover:bg-red-600 rounded backdrop-blur text-white transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-medium border-y border-gray-200">
                <tr>
                  <th className="px-6 py-4">Preview</th>
                  <th className="px-6 py-4">Media Info</th>
                  <th className="px-6 py-4">Album & Category</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mediaList.map((media) => (
                  <tr key={media._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 relative">
                        <img src={media.imageUrl} alt={media.title} className="w-full h-full object-cover" />
                        {media.mediaType === 'video' && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <Video className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        {media.title}
                        {media.isFeatured && <Star className="w-3.5 h-3.5 text-amber-500 fill-current" title="Featured Media" />}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">{media.mediaType || 'image'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{media.album || 'General'}</div>
                      <div className="text-xs text-gray-500 capitalize">{media.category}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${media.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {media.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(media)}>
                          <Edit2 className="w-4 h-4 text-primary-600" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDelete(media)}>
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
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedMedia ? 'Edit Media' : 'Add New Media'}
      >
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData); }} className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto pr-2">
          
          <div className="flex gap-4">
            <label className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${formData.mediaType === 'image' ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              <input type="radio" name="mediaType" value="image" checked={formData.mediaType === 'image'} onChange={(e) => setFormData({...formData, mediaType: e.target.value})} className="hidden" />
              <ImageIcon className="w-4 h-4" /> Image
            </label>
            <label className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${formData.mediaType === 'video' ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              <input type="radio" name="mediaType" value="video" checked={formData.mediaType === 'video'} onChange={(e) => setFormData({...formData, mediaType: e.target.value})} className="hidden" />
              <Video className="w-4 h-4" /> Video
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Media Title <span className="text-red-500">*</span></label>
            <Input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Annual Convocation 2026" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select 
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="campus">Campus</option>
                <option value="events">Events</option>
                <option value="students">Students</option>
                <option value="alumni">Alumni</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Album Name</label>
              <Input value={formData.album} onChange={(e) => setFormData({...formData, album: e.target.value})} placeholder="e.g. Convocation 2026" />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              {formData.mediaType === 'video' ? 'Video Thumbnail URL (Image)' : 'Image URL'} <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <Input required type="url" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." className="flex-1" />
              {formData.imageUrl && (
                <div className="w-12 h-10 rounded overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
                  <img src={formData.imageUrl} alt="preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                </div>
              )}
            </div>
          </div>

          {formData.mediaType === 'video' && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Video Embed URL (YouTube/Vimeo) <span className="text-red-500">*</span></label>
              <Input required={formData.mediaType === 'video'} type="url" value={formData.videoUrl} onChange={(e) => setFormData({...formData, videoUrl: e.target.value})} placeholder="https://www.youtube.com/embed/..." />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Description / Caption</label>
            <Textarea rows={2} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Add a caption..." />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Featured Media</p>
              <p className="text-xs text-gray-500">Highlight on the gallery homepage.</p>
            </div>
            <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500" />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Active Status</p>
              <p className="text-xs text-gray-500">Uncheck to hide from public view.</p>
            </div>
            <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500" />
          </div>
          
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={mutation.isLoading}>
              {mutation.isLoading ? 'Saving...' : selectedMedia ? 'Update Media' : 'Add Media'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Media"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong className="text-gray-900">{selectedMedia?.title}</strong>? 
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button 
              variant="primary" 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteMutation.mutate(selectedMedia._id)}
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
