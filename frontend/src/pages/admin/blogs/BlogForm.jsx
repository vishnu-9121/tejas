import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

import { blogService } from '@/services/blogService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Tabs } from '@/components/ui/Tabs';

const blogSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  category: z.string().min(1, 'Please select a category'),
  excerpt: z.string().max(300, 'Excerpt cannot exceed 300 characters').optional(),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  coverImage: z.string().url('Must be a valid URL'),
  tags: z.string().optional(), // We'll split this by comma
  status: z.enum(['Draft', 'Published', 'Archived']),
  readingTime: z.number().min(1).default(5),
  publishedAt: z.string().optional(),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.string().optional(),
  }).optional(),
  relatedBlogs: z.array(z.string()).optional(),
});

export default function BlogForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('content');

  // Fetch blog data if editing
  const { data: blogData, isLoading } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogService.getBlogById(id),
    enabled: isEditing,
  });

  // Fetch all blogs for the "Related Blogs" dropdown
  const { data: allBlogsData } = useQuery({
    queryKey: ['blogs-list'],
    queryFn: () => blogService.getBlogs({ limit: 100 }),
  });
  
  const allBlogs = allBlogsData?.data?.blogs || [];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      category: 'General',
      excerpt: '',
      content: '',
      coverImage: '',
      tags: '',
      status: 'Draft',
      readingTime: 5,
      publishedAt: '',
      seo: { metaTitle: '', metaDescription: '', keywords: '' },
      relatedBlogs: [],
    }
  });

  const contentWatch = watch('content');

  // Auto calculate reading time based on word count
  useEffect(() => {
    if (contentWatch) {
      const words = contentWatch.trim().split(/\s+/).length;
      const time = Math.ceil(words / 200); // avg 200 words per minute
      setValue('readingTime', time || 1);
    }
  }, [contentWatch, setValue]);

  useEffect(() => {
    if (blogData?.data) {
      const b = blogData.data;
      reset({
        title: b.title,
        category: b.category || 'General',
        excerpt: b.excerpt || '',
        content: b.content,
        coverImage: b.coverImage,
        tags: b.tags?.join(', ') || '',
        status: b.status || 'Draft',
        readingTime: b.readingTime || 5,
        publishedAt: b.publishedAt ? new Date(b.publishedAt).toISOString().split('T')[0] : '',
        seo: b.seo || { metaTitle: '', metaDescription: '', keywords: '' },
        relatedBlogs: b.relatedBlogs?.map(rb => rb._id || rb) || [],
      });
    }
  }, [blogData, reset]);

  const mutation = useMutation({
    mutationFn: (data) => isEditing ? blogService.updateBlog(id, data) : blogService.createBlog(data),
    onSuccess: () => {
      toast.success(isEditing ? 'Blog updated successfully' : 'Blog created successfully');
      queryClient.invalidateQueries(['blogs']);
      navigate('/admin/blogs');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  });

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
    };
    
    if (data.status === 'Published' && !data.publishedAt) {
      formattedData.publishedAt = new Date().toISOString();
    } else if (data.publishedAt) {
      formattedData.publishedAt = new Date(data.publishedAt).toISOString();
    }

    mutation.mutate(formattedData);
  };

  const tabs = [
    { id: 'content', label: 'Content & Editor' },
    { id: 'publish', label: 'Publish Settings' },
    { id: 'seo', label: 'SEO & Metadata' },
  ];

  if (isLoading) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" as={Link} to="/admin/blogs" className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Blog Post' : 'Create New Post'}
            </h1>
            <p className="text-sm text-gray-500">Enterprise CMS blog editor with markdown support.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="px-6 pt-4" />
          </div>

          <div className="p-6">
            
            {/* Tab: Content & Editor */}
            <div className={activeTab === 'content' ? 'block' : 'hidden'}>
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Post Title <span className="text-red-500">*</span></label>
                  <Input {...register('title')} placeholder="Enter a compelling title..." className="font-bold text-lg" />
                  {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
                    <select 
                      {...register('category')} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="General">General</option>
                      <option value="Academics">Academics</option>
                      <option value="Campus Life">Campus Life</option>
                      <option value="Alumni">Alumni</option>
                      <option value="Research">Research</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Tags (Comma separated)</label>
                    <Input {...register('tags')} placeholder="e.g. Leadership, Innovation, Tech" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Short Excerpt</label>
                  <Textarea {...register('excerpt')} rows={2} placeholder="A brief summary of the post..." />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Cover Image URL <span className="text-red-500">*</span></label>
                  <Input {...register('coverImage')} type="url" placeholder="https://..." />
                  {errors.coverImage && <p className="text-xs text-red-500">{errors.coverImage.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 flex justify-between">
                    <span>Content (Markdown Supported) <span className="text-red-500">*</span></span>
                    <span className="text-xs text-gray-500 font-normal">Auto-calculated read time: {watch('readingTime')} min</span>
                  </label>
                  <Textarea 
                    {...register('content')} 
                    rows={15} 
                    className="font-mono text-sm" 
                    placeholder="## Introduction&#10;Write your post content here..." 
                  />
                  {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
                </div>
              </div>
            </div>

            {/* Tab: Publish Settings */}
            <div className={activeTab === 'publish' ? 'block' : 'hidden'}>
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Visibility Status</h3>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Post Status</label>
                      <select 
                        {...register('status')} 
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="Draft">Draft (Hidden)</option>
                        <option value="Published">Published (Live)</option>
                        <option value="Archived">Archived (Unlisted)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Schedule Date</label>
                      <Input {...register('publishedAt')} type="date" />
                      <p className="text-xs text-gray-500">Leave blank to publish immediately upon setting status to Published.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Related Articles</h3>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Select Related Blogs</label>
                      <p className="text-xs text-gray-500 mb-2">Hold Ctrl/Cmd to select multiple.</p>
                      <select 
                        multiple
                        {...register('relatedBlogs')} 
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[150px]"
                      >
                        {allBlogs.filter(b => b._id !== id).map(blog => (
                          <option key={blog._id} value={blog._id}>
                            {blog.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab: SEO & Metadata */}
            <div className={activeTab === 'seo' ? 'block' : 'hidden'}>
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Search Engine Optimization</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Meta Title</label>
                    <Input {...register('seo.metaTitle')} placeholder="Optimal title for search engines (default is post title)" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Meta Keywords</label>
                    <Input {...register('seo.keywords')} placeholder="Comma separated keywords" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Meta Description</label>
                    <Textarea {...register('seo.metaDescription')} rows={3} placeholder="Brief description for search engine snippets (default is excerpt)" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Floating Actions */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:pl-64 flex justify-end gap-4 z-10">
          <Button type="button" variant="outline" as={Link} to="/admin/blogs">
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting} className="min-w-[120px]">
            {isSubmitting ? 'Saving...' : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Update Post' : 'Save Post'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
