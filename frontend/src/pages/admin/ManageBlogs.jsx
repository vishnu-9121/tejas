import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, Edit2, Trash2, Calendar as CalendarIcon, Tag, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { blogService } from '@/services/blogService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';

export default function ManageBlogs() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['blogs', { page, search }],
    queryFn: () => blogService.getAdminBlogs({ page, limit: 10, search }),
    keepPreviousData: true,
  });

  const blogList = data?.data?.blogs || [];
  const totalPages = data?.data?.pagination?.totalPages || 1;
  const totalBlogs = data?.data?.pagination?.total || 0;

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }) => blogService.updateBlog(id, { status }),
    onSuccess: () => {
      toast.success('Blog status updated');
      queryClient.invalidateQueries(['blogs']);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      toast.success('Blog deleted');
      queryClient.invalidateQueries(['blogs']);
      setIsDeleteModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete blog');
    }
  });

  const handleDeleteConfirm = () => {
    if (blogToDelete) deleteMutation.mutate(blogToDelete._id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blogs Management</h1>
          <p className="text-sm text-gray-500">Create, edit, and publish blog articles.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" className="flex items-center gap-2" as={Link} to="/admin/blogs/new">
            <Plus className="w-4 h-4" /> Add Blog Post
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center border-b border-gray-100">
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input 
              type="text" 
              placeholder="Search blogs..." 
              className="pl-10 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="text-sm font-medium text-gray-500">
            Total: {totalBlogs} Blogs
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="flex justify-center items-center gap-3">
              <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              Loading blogs...
            </div>
          </div>
        ) : blogList.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No blogs found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-medium border-y border-gray-200">
                <tr>
                  <th className="px-6 py-4">Title & Details</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Metrics</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {blogList.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 max-w-sm truncate">{blog.title}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <CalendarIcon className="w-3 h-3" />
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        {blog.tags && blog.tags.length > 0 && (
                          <>
                            <span className="text-gray-300">|</span>
                            <Tag className="w-3 h-3" />
                            <span>{blog.tags.slice(0, 2).join(', ')}{blog.tags.length > 2 ? '...' : ''}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{blog.author ? `${blog.author.firstName} ${blog.author.lastName}` : 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {blog.views} views
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select 
                        value={blog.status}
                        onChange={(e) => toggleStatusMutation.mutate({ id: blog._id, status: e.target.value })}
                        className={`text-xs font-bold px-3 py-1 rounded-full outline-none cursor-pointer appearance-none ${
                          blog.status === 'Published' ? 'bg-green-100 text-green-700' :
                          blog.status === 'Archived' ? 'bg-gray-100 text-gray-700' :
                          'bg-amber-100 text-amber-700'
                        }`}
                      >
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" as={Link} to={`/admin/blogs/${blog._id}/edit`}>
                          <Edit2 className="w-4 h-4 text-primary-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => { setBlogToDelete(blog); setIsDeleteModalOpen(true); }}
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
        title="Delete Blog Post"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong className="text-gray-900">{blogToDelete?.title}</strong>? 
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
              {deleteMutation.isLoading ? 'Deleting...' : 'Yes, Delete Blog'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
