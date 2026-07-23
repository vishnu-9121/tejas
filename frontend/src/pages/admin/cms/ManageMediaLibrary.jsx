import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Upload, Folder, Image as ImageIcon, Tag, Trash2, Edit3, Search, Filter, HardDrive, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/utils/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';

export default function ManageMediaLibrary() {
  const queryClient = useQueryClient();
  const [selectedFolder, setSelectedFolder] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadData, setUploadData] = useState({ folder: 'General', altText: '', caption: '', tags: '' });
  const [isUploading, setIsUploading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['media-library', { folder: selectedFolder, search: searchQuery }],
    queryFn: async () => {
      const res = await api.get('/media', { params: { folder: selectedFolder, search: searchQuery } });
      return res.data?.data;
    }
  });

  const { data: storageStats } = useQuery({
    queryKey: ['media-stats'],
    queryFn: async () => {
      const res = await api.get('/media/stats');
      return res.data?.data;
    }
  });

  const assets = data?.assets || [];
  const folders = ['All', ...(data?.folders || ['General'])];

  const deleteBulkMutation = useMutation({
    mutationFn: (assetIds) => api.post('/media/delete-bulk', { assetIds }),
    onSuccess: () => {
      toast.success('Selected assets deleted');
      setSelectedAssets([]);
      queryClient.invalidateQueries(['media-library']);
      queryClient.invalidateQueries(['media-stats']);
    },
    onError: () => toast.error('Failed to delete assets')
  });

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      return toast.error('Please choose a file to upload');
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('files', selectedFile);
      formData.append('folder', uploadData.folder);
      formData.append('altText', uploadData.altText);
      formData.append('caption', uploadData.caption);
      formData.append('tags', uploadData.tags);

      await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Media asset uploaded successfully!');
      queryClient.invalidateQueries(['media-library']);
      queryClient.invalidateQueries(['media-stats']);
      setIsUploadModalOpen(false);
      setSelectedFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-outfit">Centralized Media Library</h1>
          <p className="text-sm text-gray-500">Manage, organize, and optimize all digital assets, images, and documents across your site.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700" onClick={() => setIsUploadModalOpen(true)}>
            <Upload className="w-4 h-4" /> Upload Asset
          </Button>
        </div>
      </div>

      {/* Storage Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Total Media Files</div>
            <div className="text-lg font-bold text-gray-900">{storageStats?.totalFiles || assets.length} Assets</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Storage Used</div>
            <div className="text-lg font-bold text-gray-900">{formatBytes(storageStats?.totalBytes)}</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Folder className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Active Folders</div>
            <div className="text-lg font-bold text-gray-900">{folders.length - 1} Folders</div>
          </div>
        </div>
      </div>

      {/* Folders & Search Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {folders.map(folder => (
            <button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFolder === folder
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {folder}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search by name or alt text..."
            className="pl-9 h-10 text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Bulk Delete Floating Bar */}
      {selectedAssets.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
          <span className="text-xs font-semibold text-red-800">{selectedAssets.length} assets selected</span>
          <Button
            variant="primary"
            size="sm"
            className="bg-red-600 hover:bg-red-700 h-8 text-xs flex items-center gap-1.5"
            onClick={() => deleteBulkMutation.mutate(selectedAssets)}
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete Selected
          </Button>
        </div>
      )}

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-gray-500 text-sm">Loading media assets...</div>
        ) : assets.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 text-sm">No media assets found in this folder.</div>
        ) : (
          assets.map(asset => {
            const isSelected = selectedAssets.includes(asset._id);
            const isImage = asset.mimeType?.startsWith('image/');
            return (
              <motion.div
                key={asset._id}
                layout
                className={`group bg-white rounded-2xl border overflow-hidden relative shadow-sm transition-all hover:shadow-md ${
                  isSelected ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-gray-100'
                }`}
              >
                <div className="aspect-square bg-gray-50 relative overflow-hidden flex items-center justify-center">
                  {isImage ? (
                    <img src={asset.url} alt={asset.altText || asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <FileText className="w-10 h-10 text-gray-400" />
                  )}
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {
                      if (isSelected) setSelectedAssets(selectedAssets.filter(id => id !== asset._id));
                      else setSelectedAssets([...selectedAssets, asset._id]);
                    }}
                    className="absolute top-2.5 left-2.5 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                  />
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 text-white rounded text-[10px] backdrop-blur-sm">
                    {formatBytes(asset.size)}
                  </div>
                </div>
                <div className="p-2.5">
                  <div className="text-xs font-semibold text-gray-900 truncate" title={asset.name}>{asset.name}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5 truncate">{asset.folder} • {asset.mimeType.split('/')[1]?.toUpperCase()}</div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Upload Media Modal */}
      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Upload Media Asset">
        <form onSubmit={handleFileUpload} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Select File</label>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer border border-gray-200 rounded-xl p-1"
              required
            />
          </div>

          <Input
            label="Folder Name"
            placeholder="General, Campus, Events, Hero"
            value={uploadData.folder}
            onChange={(e) => setUploadData({ ...uploadData, folder: e.target.value })}
          />

          <Input
            label="Alt Text (SEO)"
            placeholder="Description of image for accessibility"
            value={uploadData.altText}
            onChange={(e) => setUploadData({ ...uploadData, altText: e.target.value })}
          />

          <Input
            label="Tags (Comma separated)"
            placeholder="banner, hero, logo"
            value={uploadData.tags}
            onChange={(e) => setUploadData({ ...uploadData, tags: e.target.value })}
          />

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" type="button" onClick={() => setIsUploadModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" isLoading={isUploading}>Upload File</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
