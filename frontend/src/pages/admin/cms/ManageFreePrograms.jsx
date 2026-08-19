import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Save, 
  Send, 
  Plus, 
  Trash2, 
  BookOpen, 
  Eye, 
  GripVertical 
} from 'lucide-react';
import { toast } from 'sonner';

import { cmsService } from '@/services/cmsService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';

const defaultFreeProgramsData = {
  title: 'Free Knowledge & Open Masterclasses',
  subtitle: 'Access high-impact introductory courses, foundational workshops, and executive webinars open to all aspiring leaders.',
  programs: [
    {
      id: 'free-1',
      title: 'Generative AI & Prompt Engineering Masterclass',
      category: 'Artificial Intelligence',
      duration: '2 Hours Live',
      shortDescription: 'Hands-on introduction to Large Language Models, prompt crafting, and building practical AI workflow prototypes.',
      modulesCount: 4,
      enrollLink: '/contact'
    },
    {
      id: 'free-2',
      title: 'Foundations of Ethical Technology & Systems',
      category: 'Philosophy & Tech',
      duration: 'Self-Paced',
      shortDescription: 'Explore algorithmic governance, data privacy, and ethical frameworks defining tomorrow’s engineering leadership.',
      modulesCount: 6,
      enrollLink: '/contact'
    },
    {
      id: 'free-3',
      title: 'Executive Financial Literacy & Wealth Architecture',
      category: 'Finance',
      duration: '3 Hours Workshop',
      shortDescription: 'Master modern asset allocation, capital markets, and strategic personal financial planning.',
      modulesCount: 5,
      enrollLink: '/contact'
    }
  ]
};

export default function ManageFreePrograms() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('programs');

  const { data: cmsResponse, isLoading } = useQuery({
    queryKey: ['cms', 'free_programs', 'DRAFT'],
    queryFn: () => cmsService.getCmsData('free_programs', 'DRAFT'),
  });

  const entry = cmsResponse?.data;
  const isDraft = entry?.status === 'DRAFT';
  const liveVersion = entry?.publishedVersionNumber || 1;

  const { register, control, handleSubmit, reset, watch } = useForm({
    defaultValues: defaultFreeProgramsData
  });

  const { fields: programFields, append: appendProgram, remove: removeProgram } = useFieldArray({
    control,
    name: 'programs'
  });

  useEffect(() => {
    const data = entry?.data && Object.keys(entry.data).length > 0 ? entry.data : entry?.publishedData;
    if (data && (data.title || (data.programs && data.programs.length > 0))) {
      reset(data);
    } else {
      reset(defaultFreeProgramsData);
    }
  }, [entry, reset]);

  const saveDraftMutation = useMutation({
    mutationFn: async (data) => {
      await cmsService.updateCmsData('free_programs', data);
      await cmsService.updateCmsData('free-programs', data);
    },
    onSuccess: () => {
      toast.success('Free Programs draft saved successfully');
      queryClient.invalidateQueries(['cms', 'free_programs']);
      queryClient.invalidateQueries(['cms', 'free-programs']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to save draft')
  });

  const publishMutation = useMutation({
    mutationFn: async (formData) => {
      await cmsService.updateCmsData('free_programs', formData);
      await cmsService.updateCmsData('free-programs', formData);
      await cmsService.publishCmsData('free_programs', `Published Free Programs update v${liveVersion + 1}`);
      return await cmsService.publishCmsData('free-programs', `Published Free Programs update v${liveVersion + 1}`);
    },
    onSuccess: () => {
      toast.success('Free Programs published live!');
      queryClient.invalidateQueries(['cms', 'free_programs']);
      queryClient.invalidateQueries(['cms', 'free-programs']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to publish')
  });

  const onSubmitDraft = (data) => saveDraftMutation.mutate(data);
  const onSubmitPublish = (data) => publishMutation.mutate(data);

  if (isLoading) return <div className="p-16 text-center text-gray-500 bg-white rounded-3xl">Loading Free Programs CMS...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 font-inter">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-outfit">
              Free Programmes & Masterclasses CMS
            </h1>
            <p className="text-xs text-gray-500">
              Manage free courses, open masterclasses, trial workshops, and community learning resources.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={isDraft ? "warning" : "success"} className="text-xs mr-2">
            {isDraft ? "Draft" : `Live v${liveVersion}`}
          </Badge>
          <Button variant="outline" size="sm" as="a" href="/free-programs" target="_blank" className="text-xs flex items-center gap-1.5">
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
          onClick={() => setActiveTab('programs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'programs' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Free Masterclasses Catalog ({programFields.length})
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
        {activeTab === 'programs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Courses & Masterclasses</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendProgram({
                  id: `free-${Date.now()}`,
                  title: 'New Masterclass Title',
                  category: 'Technology',
                  duration: '2 Hours',
                  shortDescription: 'Masterclass syllabus and outcomes overview.',
                  modulesCount: 3,
                  enrollLink: '/contact'
                })}
                className="text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Masterclass
              </Button>
            </div>

            <div className="space-y-4">
              {programFields.map((field, idx) => (
                <div key={field.id} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-gray-800">
                      Masterclass #{idx + 1}
                    </span>
                    <button type="button" onClick={() => removeProgram(idx)} className="text-gray-400 hover:text-red-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Input label="Masterclass Title" {...register(`programs.${idx}.title`)} required />
                    </div>
                    <div>
                      <Input label="Category" {...register(`programs.${idx}.category`)} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Input label="Duration" {...register(`programs.${idx}.duration`)} placeholder="2 Hours Live" required />
                    </div>
                    <div>
                      <Input label="Modules Count" type="number" {...register(`programs.${idx}.modulesCount`)} placeholder="4" required />
                    </div>
                    <div>
                      <Input label="Enroll / Register Link" {...register(`programs.${idx}.enrollLink`)} placeholder="/contact" required />
                    </div>
                  </div>
                  <Textarea label="Short Description" rows={3} {...register(`programs.${idx}.shortDescription`)} required />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'header' && (
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Header Settings</h2>
            <Input label="Title" {...register('title')} required />
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
