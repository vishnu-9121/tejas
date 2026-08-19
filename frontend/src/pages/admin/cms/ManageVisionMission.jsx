import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Save, 
  Send, 
  Target, 
  Compass, 
  Eye, 
  ShieldCheck,
  Plus,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

import { cmsService } from '@/services/cmsService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';

const defaultVisionMissionData = {
  title: 'Vision, Mission & Academic Philosophy',
  subtitle: 'Valour in Heart. Discipline in Habit. Vigilance in Mind. Resilience in Spirit.',
  vision: 'To develop visionary individuals who embody intellectual innovation, emotional balance, ethical responsibility, courageous leadership, and meaningful contribution to the nation and the world.',
  mission: 'To advance human excellence through transformative education, applied research, responsible entrepreneurship, ethical technology, and principled leadership development that creates enduring societal value.',
  philosophy: 'Knowledge → Practice → Feedback → Iteration → Mastery. Education at Tejas Academy transcends information transfer to cultivate holistic human capability, character, and lifelong leadership.',
  virtues: [
    { name: 'Integrity', description: 'Unyielding adherence to moral courage, ethical honesty, and accountability in thought, word, and deed.' },
    { name: 'Discipline', description: 'Systematic habits, focused diligence, and consistent daily execution essential for compounding capability.' },
    { name: 'Courage', description: 'The boldness to question dogma, embrace intellectual challenges, take calculated risks, and pioneer positive change.' },
    { name: 'Curiosity', description: 'Inquisitive pursuit of deep knowledge, lifelong learning, and innovative multidisciplinary exploration.' },
    { name: 'Service', description: 'Commitment to servant leadership, community upliftment, and creating enduring value for society and the nation.' },
    { name: 'Excellence', description: 'Relentless striving for the highest standards in character, craft, intellect, and professional mastery.' }
  ]
};

export default function ManageVisionMission() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('vision-mission');

  const { data: cmsResponse, isLoading } = useQuery({
    queryKey: ['cms', 'vision-mission', 'DRAFT'],
    queryFn: () => cmsService.getCmsData('vision-mission', 'DRAFT'),
  });

  const entry = cmsResponse?.data;
  const isDraft = entry?.status === 'DRAFT';
  const liveVersion = entry?.publishedVersionNumber || 1;

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: defaultVisionMissionData
  });

  const { fields: virtueFields, append: appendVirtue, remove: removeVirtue } = useFieldArray({
    control,
    name: 'virtues'
  });

  useEffect(() => {
    const data = entry?.data && Object.keys(entry.data).length > 0 ? entry.data : entry?.publishedData;
    if (data && (data.vision || data.mission || (data.virtues && data.virtues.length > 0))) {
      reset(data);
    } else {
      reset(defaultVisionMissionData);
    }
  }, [entry, reset]);

  const saveDraftMutation = useMutation({
    mutationFn: async (data) => {
      await cmsService.updateCmsData('vision-mission', data);
      await cmsService.updateCmsData('vision_mission', data);
    },
    onSuccess: () => {
      toast.success('Vision & Mission draft saved successfully');
      queryClient.invalidateQueries(['cms', 'vision-mission']);
      queryClient.invalidateQueries(['cms', 'about']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to save draft')
  });

  const publishMutation = useMutation({
    mutationFn: async (formData) => {
      await cmsService.updateCmsData('vision-mission', formData);
      await cmsService.updateCmsData('vision_mission', formData);
      await cmsService.publishCmsData('vision-mission', `Published Vision & Mission update v${liveVersion + 1}`);
      return await cmsService.publishCmsData('vision_mission', `Published Vision & Mission update v${liveVersion + 1}`);
    },
    onSuccess: () => {
      toast.success('Vision, Mission & Academic Philosophy published live!');
      queryClient.invalidateQueries(['cms', 'vision-mission']);
      queryClient.invalidateQueries(['cms', 'about']);
      queryClient.invalidateQueries(['cms', 'homepage']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to publish')
  });

  const onSubmitDraft = (data) => saveDraftMutation.mutate(data);
  const onSubmitPublish = (data) => publishMutation.mutate(data);

  if (isLoading) return <div className="p-16 text-center text-gray-500 bg-white rounded-3xl">Loading Vision & Mission CMS...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 font-inter">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-outfit">
              Vision, Mission & Academic Philosophy CMS
            </h1>
            <p className="text-xs text-gray-500">
              Manage strategic vision, mission statements, institutional motto, and the 6 foundational virtues.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={isDraft ? "warning" : "success"} className="text-xs mr-2">
            {isDraft ? "Draft" : `Live v${liveVersion}`}
          </Badge>
          <Button variant="outline" size="sm" as="a" href="/about/vision-mission" target="_blank" className="text-xs flex items-center gap-1.5">
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
          onClick={() => setActiveTab('vision-mission')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'vision-mission' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Vision, Mission & Philosophy
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('virtues')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'virtues' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Six Core Virtues ({virtueFields.length})
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmitPublish)} className="space-y-6">
        {activeTab === 'vision-mission' && (
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Page Title" {...register('title')} required />
              <Input label="Institutional Motto" {...register('subtitle')} required />
            </div>

            <Textarea 
              label="Our Institutional Vision" 
              rows={4} 
              {...register('vision')} 
              placeholder="To develop visionary individuals who embody intellectual innovation..." 
              required 
            />

            <Textarea 
              label="Our Institutional Mission" 
              rows={4} 
              {...register('mission')} 
              placeholder="To advance human excellence through transformative education..." 
              required 
            />

            <Textarea 
              label="Academic Philosophy Core Narrative" 
              rows={4} 
              {...register('philosophy')} 
              placeholder="Knowledge → Practice → Feedback → Iteration → Mastery..." 
              required 
            />
          </div>
        )}

        {activeTab === 'virtues' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Six Foundational Core Virtues</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendVirtue({ name: 'New Virtue', description: 'Virtue description and embodiment.' })}
                className="text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Virtue
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {virtueFields.map((field, idx) => (
                <div key={field.id} className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600">
                      Virtue #{idx + 1}
                    </span>
                    <button type="button" onClick={() => removeVirtue(idx)} className="text-gray-400 hover:text-red-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <Input label="Virtue Name" {...register(`virtues.${idx}.name`)} required />
                  <Textarea label="Description" rows={3} {...register(`virtues.${idx}.description`)} required />
                </div>
              ))}
            </div>
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
