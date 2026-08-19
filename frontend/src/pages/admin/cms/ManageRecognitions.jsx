import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Save, 
  Send, 
  Plus, 
  Trash2, 
  Award, 
  Eye, 
  GripVertical 
} from 'lucide-react';
import { toast } from 'sonner';

import { cmsService } from '@/services/cmsService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';

const defaultRecognitionsData = {
  title: 'Institutional Accreditations & Recognitions',
  subtitle: 'Demonstrating pedagogical integrity, academic excellence, and national industry alignment.',
  items: [
    {
      id: 'rec-1',
      title: 'Excellence in AI Curriculum & Pedagogy',
      issuingBody: 'National EdTech Council',
      year: '2025',
      description: 'Honored for pioneering hands-on GPU labs and industry-integrated artificial intelligence syllabi.'
    },
    {
      id: 'rec-2',
      title: 'Top 10 Higher Education Centers in Telangana',
      issuingBody: 'Higher Education Review India',
      year: '2025',
      description: 'Awarded for exceptional graduate career readiness and modern campus infrastructure.'
    },
    {
      id: 'rec-3',
      title: 'National Skill Development Charter',
      issuingBody: 'NSDC Certified Training Partner',
      year: '2024',
      description: 'Certified institutional training partner advancing youth digital skilling and technical competence.'
    }
  ]
};

export default function ManageRecognitions() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('items');

  const { data: cmsResponse, isLoading } = useQuery({
    queryKey: ['cms', 'recognitions', 'DRAFT'],
    queryFn: () => cmsService.getCmsData('recognitions', 'DRAFT'),
  });

  const entry = cmsResponse?.data;
  const isDraft = entry?.status === 'DRAFT';
  const liveVersion = entry?.publishedVersionNumber || 1;

  const { register, control, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm({
    defaultValues: defaultRecognitionsData
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
      reset(defaultRecognitionsData);
    }
  }, [entry, reset]);

  const saveDraftMutation = useMutation({
    mutationFn: (data) => cmsService.updateCmsData('recognitions', data),
    onSuccess: () => {
      toast.success('Recognitions draft saved successfully');
      queryClient.invalidateQueries(['cms', 'recognitions']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to save draft')
  });

  const publishMutation = useMutation({
    mutationFn: async (formData) => {
      await cmsService.updateCmsData('recognitions', formData);
      return await cmsService.publishCmsData('recognitions', `Published Recognitions update v${liveVersion + 1}`);
    },
    onSuccess: () => {
      toast.success('Recognitions published live!');
      queryClient.invalidateQueries(['cms', 'recognitions']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to publish')
  });

  const onSubmitDraft = (data) => saveDraftMutation.mutate(data);
  const onSubmitPublish = (data) => publishMutation.mutate(data);

  if (isLoading) return <div className="p-16 text-center text-gray-500 bg-white rounded-3xl">Loading Recognitions CMS...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 font-inter">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-outfit">
              Recognitions & Accreditations CMS
            </h1>
            <p className="text-xs text-gray-500">
              Manage official institutional standing, government bodies, quality charters, and national awards.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={isDraft ? "warning" : "success"} className="text-xs mr-2">
            {isDraft ? "Draft" : `Live v${liveVersion}`}
          </Badge>
          <Button variant="outline" size="sm" as="a" href="/recognitions" target="_blank" className="text-xs flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> View Public Page
          </Button>
          <Button variant="outline" size="sm" onClick={handleSubmit(onSubmitDraft)} disabled={saveDraftMutation.isPending} className="text-xs">
            <Save className="w-3.5 h-3.5 mr-1" /> Save Draft
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit(onSubmitPublish)} disabled={publishMutation.isPending} className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
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
          Recognitions List ({itemFields.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('header')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'header' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Page Header Settings
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmitPublish)} className="space-y-6">
        {activeTab === 'items' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Accreditations & Awards</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendItem({
                  id: `rec-${Date.now()}`,
                  title: 'New Institutional Honor',
                  issuingBody: 'National Council / University Partner',
                  year: new Date().getFullYear().toString(),
                  description: 'Award description and verified academic credentials.'
                })}
                className="text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Recognition
              </Button>
            </div>

            <div className="space-y-4">
              {itemFields.map((field, idx) => (
                <div key={field.id} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-gray-800">
                      Award #{idx + 1}
                    </span>
                    <button type="button" onClick={() => removeItem(idx)} className="text-gray-400 hover:text-red-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Input label="Award / Honor Title" {...register(`items.${idx}.title`)} placeholder="e.g. Excellence in AI Curriculum" required />
                    </div>
                    <div>
                      <Input label="Year" {...register(`items.${idx}.year`)} placeholder="2026" required />
                    </div>
                  </div>
                  <Input label="Issuing Authority / Organization" {...register(`items.${idx}.issuingBody`)} placeholder="e.g. National EdTech Council" required />
                  <Textarea label="Description" rows={3} {...register(`items.${idx}.description`)} placeholder="Description of recognition..." required />
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
