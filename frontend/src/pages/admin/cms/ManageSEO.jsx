import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Save, Globe, Search, Image as ImageIcon, 
  ExternalLink, Layers, CheckCircle2, FileText 
} from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@/utils/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

const SEO_PAGES_LIST = [
  { key: 'homepage', label: 'Homepage (/)' },
  { key: 'career-readiness', label: 'Career Readiness (/career-readiness)' },
  { key: 'employability-skills', label: 'Employability Skills (/employability-skills)' },
  { key: 'ai-literacy', label: 'AI Literacy (/ai-literacy)' },
  { key: 'future-skills', label: 'Future Skills (/future-skills)' },
  { key: 'business-entrepreneurship', label: 'Business & Entrepreneurship (/business-entrepreneurship)' },
  { key: 'leadership-development', label: 'Leadership Development (/leadership-development)' },
  { key: 'financial-literacy', label: 'Financial Literacy (/financial-literacy)' },
  { key: 'human-excellence', label: 'Human Excellence (/human-excellence)' },
  { key: 'student-development', label: 'Student Development (/student-development)' },
  { key: 'professional-development', label: 'Professional Development (/professional-development)' },
  { key: 'programs', label: 'All Programs (/programs)' },
  { key: 'about', label: 'About Us (/about)' },
  { key: 'for-institutions', label: 'For Institutions (/for-institutions)' },
  { key: 'recognitions', label: 'Recognitions (/recognitions)' },
  { key: 'insights', label: 'Tejas Insights (/insights)' },
  { key: 'contact', label: 'Contact Us (/contact)' },
];

export default function ManageSEO() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('pages');
  const [selectedPageKey, setSelectedPageKey] = useState('homepage');

  // 1. Fetch Page-Specific SEO from MongoDB
  const { data: pageSeoData, isLoading: isPageLoading } = useQuery({
    queryKey: ['seo-page', selectedPageKey],
    queryFn: async () => {
      const res = await api.get(`/seo/${selectedPageKey}`);
      return res.data?.data;
    },
  });

  const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm({
    defaultValues: {
      title: '',
      h1: '',
      description: '',
      canonical: '',
      robots: 'index, follow',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      keywords: '',
    }
  });

  useEffect(() => {
    if (pageSeoData) {
      reset({
        title: pageSeoData.title || '',
        h1: pageSeoData.h1 || '',
        description: pageSeoData.description || '',
        canonical: pageSeoData.canonical || '',
        robots: pageSeoData.robots || 'index, follow',
        ogTitle: pageSeoData.ogTitle || '',
        ogDescription: pageSeoData.ogDescription || '',
        ogImage: pageSeoData.ogImage || '',
        keywords: Array.isArray(pageSeoData.keywords) ? pageSeoData.keywords.join(', ') : (pageSeoData.keywords || ''),
      });
    }
  }, [pageSeoData, reset]);

  const updatePageMutation = useMutation({
    mutationFn: async (formData) => {
      const payload = {
        ...formData,
        keywords: typeof formData.keywords === 'string' 
          ? formData.keywords.split(',').map(k => k.trim()).filter(Boolean) 
          : formData.keywords
      };
      const res = await api.put(`/seo/${selectedPageKey}`, payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success(`SEO metadata for ${selectedPageKey} updated successfully!`);
      queryClient.invalidateQueries(['seo-page', selectedPageKey]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update page SEO');
    }
  });

  const onSubmit = (data) => {
    updatePageMutation.mutate(data);
  };

  const watchOgImage = watch('ogImage');

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl font-serif font-extrabold text-neutral-900">SEO & Entity Metadata Manager</h1>
          <p className="text-sm text-neutral-500">Configure page titles, canonical URLs, meta descriptions, and Google entity signals.</p>
        </div>
        <div className="flex items-center gap-2">
          <a 
            href="/sitemap.xml" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View Live Sitemap.xml
          </a>
          <a 
            href="/robots.txt" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" /> Robots.txt
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Selector */}
        <div className="md:col-span-1 space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-2 px-2">Select Page</label>
          <div className="bg-white rounded-xl border border-neutral-200/80 p-1.5 space-y-0.5 max-h-[70vh] overflow-y-auto">
            {SEO_PAGES_LIST.map((page) => (
              <button
                key={page.key}
                type="button"
                onClick={() => setSelectedPageKey(page.key)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors truncate ${
                  selectedPageKey === page.key 
                    ? 'bg-primary-50 text-primary-700 font-bold' 
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {page.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="md:col-span-3">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Core Search Metadata */}
            <div className="bg-white rounded-xl shadow-xs border border-neutral-200/80 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-primary-600" />
                  <h3 className="text-base font-bold text-neutral-900">
                    Search Engine Meta: <span className="text-primary-700">{selectedPageKey}</span>
                  </h3>
                </div>
                <span className="text-[11px] font-mono bg-neutral-100 px-2 py-0.5 rounded text-neutral-600">
                  {pageSeoData?.route || `/${selectedPageKey}`}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">SEO Title Tag (60 chars max)</label>
                  <Input {...register('title')} placeholder="Page Title | Tejas Academy of Excellence" />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Primary Page H1 Heading</label>
                  <Input {...register('h1')} placeholder="Main H1 heading on page" />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Meta Description (150-160 chars)</label>
                  <Textarea {...register('description')} rows={3} placeholder="Engaging, keyword-rich summary of the page." />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Canonical URL</label>
                  <Input {...register('canonical')} placeholder="https://unlocktejas.com/..." />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Keywords (Comma Separated)</label>
                  <Input {...register('keywords')} placeholder="AI Literacy, Career Readiness, Tejas Academy" />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Robots Meta Rule</label>
                  <Input {...register('robots')} placeholder="index, follow" />
                </div>
              </div>
            </div>

            {/* Social Share Meta */}
            <div className="bg-white rounded-xl shadow-xs border border-neutral-200/80 p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                <Globe className="w-4 h-4 text-primary-600" />
                <h3 className="text-base font-bold text-neutral-900">Open Graph & Social Share Data</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">OG Title (Optional)</label>
                  <Input {...register('ogTitle')} placeholder="Leave blank to use SEO Title" />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">OG Description (Optional)</label>
                  <Textarea {...register('ogDescription')} rows={2} placeholder="Leave blank to use Meta Description" />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">OG Image URL (1200x630)</label>
                  <div className="flex gap-3 items-center">
                    <Input type="url" {...register('ogImage')} placeholder="https://images.unsplash.com/..." className="flex-1" />
                    {watchOgImage && (
                      <div className="w-14 h-10 rounded border border-neutral-200 overflow-hidden shrink-0">
                        <img src={watchOgImage} alt="OG Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="flex justify-end">
              <Button type="submit" variant="primary" disabled={isSubmitting || updatePageMutation.isPending} className="min-w-[160px] shadow-sm">
                {isSubmitting || updatePageMutation.isPending ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />Save Page SEO</>}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
