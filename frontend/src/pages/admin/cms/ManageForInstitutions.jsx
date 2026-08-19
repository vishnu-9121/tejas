import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Save, 
  Send, 
  Plus, 
  Trash2, 
  Building2, 
  History, 
  Eye, 
  RotateCcw, 
  CheckCircle2,
  Sparkles,
  GripVertical,
  HelpCircle
} from 'lucide-react';
import { toast } from 'sonner';

import { cmsService } from '@/services/cmsService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';

const defaultForInstitutionsData = {
  title: 'Institutional Partnerships & Capacity Building',
  subtitle: 'Collaborate with Tejas Academy of Excellence on Faculty Development Programmes (FDP), applied research incubation, and student human excellence initiatives.',
  services: [
    {
      id: 'inst-1',
      title: 'Faculty Development Programs (FDP)',
      category: 'Faculty Upskilling',
      description: 'Comprehensive workshops empowering educators with the latest pedagogical tools, AI research methods, and industry case studies.',
      keyBenefits: ['AI Curriculum Integration', 'Research Paper Publishing Support', 'Certificates of Academic Mastery']
    },
    {
      id: 'inst-2',
      title: 'Institutional Career Development & Skill Bootcamps',
      category: 'Student Competence',
      description: 'Customized bootcamp modules designed to elevate student interview readiness, coding benchmarks, and professional skills.',
      keyBenefits: ['Mock Technical Interviews', 'Career Readiness Assessment Engine', 'Direct Corporate Alliances']
    },
    {
      id: 'inst-3',
      title: 'Academic MoUs & Innovation Lab Setup',
      category: 'Campus Infrastructure',
      description: 'Establish state-of-the-art AI, IoT, and Robotics laboratories on your campus backed by industry mentorship.',
      keyBenefits: ['Hardware & Software Setup', 'Industry Project Licences', 'Joint Certification Programs']
    }
  ],
  contactBanner: {
    title: 'Partner Your University with Tejas Academy',
    description: 'Schedule a consultation with our Institutional Partnerships Director today.',
    buttonText: 'Contact Partnerships Desk',
    buttonLink: '/contact'
  }
};

export default function ManageForInstitutions() {
  const queryClient = useQueryClient();
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('services');

  // Fetch working draft data from MongoDB
  const { data: cmsResponse, isLoading } = useQuery({
    queryKey: ['cms', 'for-institutions', 'DRAFT'],
    queryFn: () => cmsService.getCmsData('for-institutions', 'DRAFT'),
  });

  const entry = cmsResponse?.data;
  const isDraft = entry?.status === 'DRAFT';
  const liveVersion = entry?.publishedVersionNumber || 1;

  const { register, control, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm({
    defaultValues: defaultForInstitutionsData
  });

  const { fields: serviceFields, append: appendService, remove: removeService } = useFieldArray({
    control,
    name: 'services'
  });

  useEffect(() => {
    const data = entry?.data && Object.keys(entry.data).length > 0 ? entry.data : entry?.publishedData;
    if (data && (data.title || (data.services && data.services.length > 0))) {
      reset(data);
    } else {
      reset(defaultForInstitutionsData);
    }
  }, [entry, reset]);

  // Mutation: Save Working Draft
  const saveDraftMutation = useMutation({
    mutationFn: (data) => cmsService.updateCmsData('for-institutions', data),
    onSuccess: () => {
      toast.success('For Institutions draft saved successfully to database');
      queryClient.invalidateQueries(['cms', 'for-institutions']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to save draft');
    }
  });

  // Mutation: Publish Live
  const publishMutation = useMutation({
    mutationFn: async (formData) => {
      await cmsService.updateCmsData('for-institutions', formData);
      return await cmsService.publishCmsData('for-institutions', `Published For Institutions update v${liveVersion + 1}`);
    },
    onSuccess: () => {
      toast.success('For Institutions content published live to public website!');
      queryClient.invalidateQueries(['cms', 'for-institutions']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to publish live');
    }
  });

  const onSubmitDraft = (data) => saveDraftMutation.mutate(data);
  const onSubmitPublish = (data) => publishMutation.mutate(data);

  if (isLoading) {
    return (
      <div className="p-16 text-center text-gray-500 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-3" />
        Loading For Institutions CMS...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 font-inter">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-outfit">
                For Institutions & Corporate CMS
              </h1>
              <p className="text-xs text-gray-500">
                Manage university partnerships, FDP programs, institutional offerings, and contact banners.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={isDraft ? "warning" : "success"} className="text-xs mr-2">
            {isDraft ? "Draft (Unsaved to Live)" : `Live Version v${liveVersion}`}
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            as="a" 
            href="/for-institutions" 
            target="_blank" 
            className="text-xs flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" /> View Public Page
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSubmit(onSubmitDraft)} 
            disabled={saveDraftMutation.isPending}
            className="text-xs flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" /> Save Draft
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleSubmit(onSubmitPublish)} 
            disabled={publishMutation.isPending}
            className="text-xs flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
          >
            <Send className="w-3.5 h-3.5" /> Publish Live
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'services' ? 'bg-primary-600 text-white shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Institutional Offerings & Services ({serviceFields.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('header')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'header' ? 'bg-primary-600 text-white shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Page Header & Intro
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('banner')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'banner' ? 'bg-primary-600 text-white shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Partnerships CTA Banner
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmitPublish)} className="space-y-6">
        {/* Tab 1: Services List */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Programs & Institutional Offerings
                </h2>
                <p className="text-xs text-gray-500">
                  Each offering is rendered as a modular card with badge, benefits checklist, and proposal CTA.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendService({
                  id: `inst-${Date.now()}`,
                  title: 'New Institutional Program',
                  category: 'Corporate Solutions',
                  description: 'Comprehensive program description tailored for academic and enterprise institutions.',
                  keyBenefits: ['Live Project Access', 'Corporate Certifications', 'Faculty Mentorship']
                })}
                className="text-xs flex items-center gap-1.5 font-bold"
              >
                <Plus className="w-3.5 h-3.5" /> Add Program / Service
              </Button>
            </div>

            <div className="space-y-4">
              {serviceFields.map((field, idx) => (
                <div key={field.id} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4 relative group hover:border-primary-200 transition-all">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-gray-800">
                        Service #{idx + 1}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeService(idx)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-1"
                      title="Remove Program"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Program / Service Title"
                      {...register(`services.${idx}.title`)}
                      placeholder="e.g. Faculty Development Programs (FDP)"
                      required
                    />
                    <Input
                      label="Category / Badge"
                      {...register(`services.${idx}.category`)}
                      placeholder="e.g. Faculty Upskilling"
                      required
                    />
                  </div>

                  <Textarea
                    label="Description / Scope"
                    rows={3}
                    {...register(`services.${idx}.description`)}
                    placeholder="Describe curriculum, workshop format, and institutional impact..."
                    required
                  />

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Key Highlights & Benefits (Comma or line separated)
                    </label>
                    <Input
                      placeholder="AI Curriculum Integration, Research Paper Publishing Support, Certificates of Academic Mastery"
                      value={Array.isArray(watch(`services.${idx}.keyBenefits`)) ? watch(`services.${idx}.keyBenefits`).join(', ') : ''}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const splitItems = raw.split(/,\s*|\n/).map(s => s.trim()).filter(Boolean);
                        reset({
                          ...watch(),
                          services: watch('services').map((s, i) => i === idx ? { ...s, keyBenefits: splitItems } : s)
                        });
                      }}
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      Separate each benefit with a comma (e.g. Benefit 1, Benefit 2, Benefit 3).
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Header & Intro */}
        {activeTab === 'header' && (
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Page Header & Intro Settings</h2>
            <Input
              label="Page Main Title"
              {...register('title')}
              placeholder="Institutional Partnerships & Capacity Building"
              required
            />
            <Textarea
              label="Page Subtitle & Overview"
              rows={4}
              {...register('subtitle')}
              placeholder="Collaborate with Tejas Academy of Excellence on Faculty Development Programmes..."
              required
            />
          </div>
        )}

        {/* Tab 3: Contact Banner */}
        {activeTab === 'banner' && (
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Bottom Partnerships Banner</h2>
            <Input
              label="Banner Title"
              {...register('contactBanner.title')}
              placeholder="Partner Your University with Tejas Academy"
              required
            />
            <Textarea
              label="Banner Description"
              rows={3}
              {...register('contactBanner.description')}
              placeholder="Schedule a consultation with our Institutional Partnerships Director today."
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Button CTA Text"
                {...register('contactBanner.buttonText')}
                placeholder="Contact Partnerships Desk"
              />
              <Input
                label="Button Target Link"
                {...register('contactBanner.buttonLink')}
                placeholder="/contact"
              />
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleSubmit(onSubmitDraft)} 
            disabled={saveDraftMutation.isPending}
            className="font-bold"
          >
            <Save className="w-4 h-4 mr-1.5" /> Save Draft
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={publishMutation.isPending}
            className="bg-emerald-600 hover:bg-emerald-700 font-bold text-white shadow-md"
          >
            <Send className="w-4 h-4 mr-1.5" /> Publish Live Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
