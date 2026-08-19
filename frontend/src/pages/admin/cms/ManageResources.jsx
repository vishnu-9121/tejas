import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Save, 
  Send, 
  Plus, 
  Trash2, 
  FileText, 
  Eye, 
  Download 
} from 'lucide-react';
import { toast } from 'sonner';

import { cmsService } from '@/services/cmsService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';

const defaultResourcesData = {
  title: 'Student & Academic Resources',
  subtitle: 'Explore downloadable guides, research whitepapers, brochures, and foundational curriculum overviews.',
  items: [
    {
      id: 'res-1',
      title: 'Official Academic Prospectus 2026',
      category: 'Brochure',
      format: 'PDF (3.2 MB)',
      description: 'Complete institutional handbook detailing pedagogy, faculties, labs, and degree curricula.',
      downloadUrl: '/brochure.pdf'
    },
    {
      id: 'res-2',
      title: 'The Tejas Imperative of Human Excellence',
      category: 'Whitepaper',
      format: 'PDF (1.8 MB)',
      description: 'Comprehensive research paper outlining our 5-dimensional framework for character and competence.',
      downloadUrl: '/brochure.pdf'
    },
    {
      id: 'res-3',
      title: 'Foundations of Applied Artificial Intelligence',
      category: 'Curriculum Guide',
      format: 'PDF (2.4 MB)',
      description: 'Syllabus and prerequisite roadmap for undergraduate and professional deeptech certifications.',
      downloadUrl: '/brochure.pdf'
    }
  ]
};

export default function ManageResources() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('items');

  const { data: cmsResponse, isLoading } = useQuery({
    queryKey: ['cms', 'resources', 'DRAFT'],
    queryFn: () => cmsService.getCmsData('resources', 'DRAFT'),
  });

  const entry = cmsResponse?.data;
  const isDraft = entry?.status === 'DRAFT';
  const liveVersion = entry?.publishedVersionNumber || 1;

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: defaultResourcesData
  });

  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
    control,
    name: 'items'
  });

  useEffect(() => {
    const data = entry?.data && Object.keys(entry.data).length > 0 ? entry.data : entry?.publishedData;
    if (data && (data.title || (data.items && data.items.length > 0))) {
      reset(data);
    } else {
      reset(defaultResourcesData);
    }
  }, [entry, reset]);

  const saveDraftMutation = useMutation({
    mutationFn: (data) => cmsService.updateCmsData('resources', data),
    onSuccess: () => {
      toast.success('Resources draft saved successfully');
      queryClient.invalidateQueries(['cms', 'resources']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to save draft')
  });

  const publishMutation = useMutation({
    mutationFn: async (formData) => {
      await cmsService.updateCmsData('resources', formData);
      return await cmsService.publishCmsData('resources', `Published Resources update v${liveVersion + 1}`);
    },
    onSuccess: () => {
      toast.success('Resources published live!');
      queryClient.invalidateQueries(['cms', 'resources']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to publish')
  });

  const onSubmitDraft = (data) => saveDraftMutation.mutate(data);
  const onSubmitPublish = (data) => publishMutation.mutate(data);

  if (isLoading) return <div className="p-16 text-center text-gray-500 bg-white rounded-3xl">Loading Resources CMS...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 font-inter">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-outfit">
              Student & Academic Resources CMS
            </h1>
            <p className="text-xs text-gray-500">
              Manage downloadable brochures, curriculum guides, research whitepapers, and academic PDFs.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={isDraft ? "warning" : "success"} className="text-xs mr-2">
            {isDraft ? "Draft" : `Live v${liveVersion}`}
          </Badge>
          <Button variant="outline" size="sm" as="a" href="/resources" target="_blank" className="text-xs flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> View Public Page
          </Button>
          <Button variant="outline" size="sm" onClick={handleSubmit(onSubmitDraft)} disabled={saveDraftMutation.isPending} className="text-xs">
            <Save className="w-3.5 h-3.5 mr-1" /> Save Draft
          </Button>
          <Button type="button" variant="primary" size="sm" onClick={handleSubmit(onSubmitPublish)} disabled={publishMutation.isPending} className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
            <Send className="w-3.5 h-3.5 mr-1" /> Publish Live
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('items')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'items' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Downloadable Items ({itemFields.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('header')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'header' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Page Header
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmitPublish)} className="space-y-6">
        {activeTab === 'items' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Resources Catalog</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendItem({
                  id: `res-${Date.now()}`,
                  title: 'New Academic Guide',
                  category: 'Curriculum Guide',
                  format: 'PDF (2.0 MB)',
                  description: 'Resource overview and academic utility.',
                  downloadUrl: '/brochure.pdf'
                })}
                className="text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Resource
              </Button>
            </div>

            <div className="space-y-4">
              {itemFields.map((field, idx) => (
                <div key={field.id} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-gray-800">
                      Resource #{idx + 1}
                    </span>
                    <button type="button" onClick={() => removeItem(idx)} className="text-gray-400 hover:text-red-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Input label="Resource Title" {...register(`items.${idx}.title`)} required />
                    </div>
                    <div>
                      <Input label="Category" {...register(`items.${idx}.category`)} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Format / Size" {...register(`items.${idx}.format`)} placeholder="PDF (2.5 MB)" required />
                    <Input label="Download Target URL / PDF Path" {...register(`items.${idx}.downloadUrl`)} placeholder="/brochure.pdf" required />
                  </div>
                  <Textarea label="Description" rows={3} {...register(`items.${idx}.description`)} required />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'header' && (
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Page Header</h2>
            <Input label="Main Title" {...register('title')} required />
            <Textarea label="Subtitle" rows={3} {...register('subtitle')} required />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={handleSubmit(onSubmitDraft)} disabled={saveDraftMutation.isPending}>
            <Save className="w-4 h-4 mr-1.5" /> Save Draft
          </Button>
          <Button type="submit" variant="primary" disabled={publishMutation.isPending} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
            <Send className="w-4 h-4 mr-1.5" /> Publish Live
          </Button>
        </div>
      </form>
    </div>
  );
}
