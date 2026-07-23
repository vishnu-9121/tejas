import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Globe, Search, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

import { cmsService } from '@/services/cmsService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

export default function ManageSEO() {
  const queryClient = useQueryClient();

  const { data: cmsData, isLoading } = useQuery({
    queryKey: ['cms', 'seo_config'],
    queryFn: () => cmsService.getCMSData('seo_config'),
  });

  const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm({
    defaultValues: {
      globalMetaTitle: 'Tejas Academy of Excellence',
      globalMetaDescription: 'Empowering future leaders with world-class education.',
      globalKeywords: 'education, leadership, business, excellence',
      ogImageUrl: '',
      twitterHandle: '@tejasacademy',
      allowIndexing: true,
    }
  });

  useEffect(() => {
    if (cmsData?.data?.data) {
      reset(cmsData.data.data);
    }
  }, [cmsData, reset]);

  const mutation = useMutation({
    mutationFn: (data) => cmsService.updateCMSData('seo_config', data),
    onSuccess: () => {
      toast.success('SEO Configuration saved successfully');
      queryClient.invalidateQueries(['cms', 'seo_config']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to save SEO config');
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const watchOgImage = watch('ogImageUrl');

  if (isLoading) return <div className="p-12 text-center text-gray-500">Loading SEO Configuration...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">SEO Manager</h1>
        <p className="text-sm text-gray-500">Configure global search engine optimization, social graphs, and index rules.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Global Metadata */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <Search className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-bold text-gray-900">Global Search Meta</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Default Meta Title</label>
              <Input {...register('globalMetaTitle')} placeholder="e.g. Tejas Academy of Excellence" />
              <p className="text-xs text-gray-500">This title is used on pages that don't have a specific SEO title set.</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Default Meta Description</label>
              <Textarea {...register('globalMetaDescription')} rows={3} placeholder="A short, compelling description of the institution." />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Global Keywords</label>
              <Input {...register('globalKeywords')} placeholder="e.g. university, admissions, courses (comma separated)" />
            </div>
          </div>
        </div>

        {/* Social Graph Data */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <Globe className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-bold text-gray-900">Social Graph & Sharing</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Default OpenGraph Image URL</label>
              <div className="flex gap-4">
                <Input type="url" {...register('ogImageUrl')} placeholder="https://..." className="flex-1" />
                {watchOgImage && (
                  <div className="w-16 h-10 rounded overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
                    <img src={watchOgImage} alt="OG Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">The default image shown when sharing links on WhatsApp, LinkedIn, or Facebook.</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Twitter Handle</label>
              <Input {...register('twitterHandle')} placeholder="e.g. @tejasacademy" />
            </div>
          </div>
        </div>

        {/* Indexing Rules */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Search Engine Rules</h3>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Allow Search Engine Indexing</p>
              <p className="text-xs text-gray-500">If disabled, search engines will be asked not to index the site (noindex).</p>
            </div>
            <input 
              type="checkbox" 
              {...register('allowIndexing')} 
              className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500 cursor-pointer" 
            />
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-sm md:pl-64 flex justify-end z-10">
          <Button type="submit" variant="primary" disabled={isSubmitting} className="min-w-[150px]">
            {isSubmitting ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />Save Configuration</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
