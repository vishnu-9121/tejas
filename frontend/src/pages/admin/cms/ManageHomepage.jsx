import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Save, Plus, Trash2, LayoutTemplate, History, Globe, 
  Send, RotateCcw, TrendingUp, Compass, Building2, 
  Layers, CheckCircle2, ArrowUp, ArrowDown, Eye, Sparkles 
} from 'lucide-react';
import { toast } from 'sonner';

import { cmsService } from '@/services/cmsService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

const defaultHomepageData = {
  hero: { 
    title: 'Cultivating Human Excellence, Character & Competence', 
    subtitle: 'Developing visionary individuals who harmonize intellectual innovation, emotional resilience, and ethical leadership.', 
    backgroundImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80', 
    videoUrl: '', 
    primaryCta: { text: 'Explore Programs', link: '/programs' }, 
    secondaryCta: { text: 'Apply for Admission', link: '/admissions' } 
  },
  stats: [
    { label: 'Active Programmes', value: '7+', enabled: true },
    { label: 'Corporate Partners', value: '250+', enabled: true },
    { label: 'Distinguished Mentors', value: '150+', enabled: true },
    { label: 'Practical Work Ratio', value: '70%', enabled: true }
  ],
  missionPreview: { 
    title: 'Our Purpose', 
    content: 'To empower learners with practical skills, future-ready capabilities, and leadership mindsets through hands-on learning.' 
  },
  visionPreview: { 
    title: 'Our Vision', 
    content: 'To build a global centre of excellence for transformative technology, business innovation, and responsible leadership.' 
  },
  partners: [
    { name: 'Google Cloud Partner', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { name: 'Microsoft Enterprise', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
    { name: 'Amazon Web Services', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' }
  ],
  footerCta: { 
    title: 'Begin Your Learning Journey with Tejas Academy', 
    subtitle: 'Enrolment for our upcoming certificate and professional batches is currently active.', 
    buttonText: 'Submit Application', 
    buttonLink: '/admissions' 
  }
};

export default function ManageHomepage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('stats');
  const [showHistory, setShowHistory] = useState(false);

  // Fetch Draft Data
  const { data: cmsResponse, isLoading } = useQuery({
    queryKey: ['cms', 'homepage', 'DRAFT'],
    queryFn: () => cmsService.getCmsData('homepage', 'DRAFT'),
  });
  
  // Fetch Version History
  const { data: versionHistory } = useQuery({
    queryKey: ['cms', 'homepage', 'versions'],
    queryFn: () => cmsService.getVersionHistory('homepage'),
    enabled: showHistory
  });

  const entry = cmsResponse?.data;
  const isDraft = entry?.status === 'DRAFT';
  const liveVersion = entry?.publishedVersionNumber || 0;

  const { register, control, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm({
    defaultValues: defaultHomepageData
  });

  const { fields: statFields, append: appendStat, remove: removeStat, move: moveStat } = useFieldArray({ 
    control, 
    name: 'stats' 
  });
  
  const { fields: partnerFields, append: appendPartner, remove: removePartner } = useFieldArray({ 
    control, 
    name: 'partners' 
  });

  useEffect(() => {
    if (entry?.data && Object.keys(entry.data).length > 0) {
      const merged = { ...defaultHomepageData, ...entry.data };
      if (!merged.stats || merged.stats.length === 0) {
        merged.stats = defaultHomepageData.stats;
      }
      reset(merged);
    } else if (entry?.publishedData && Object.keys(entry.publishedData).length > 0) {
      const merged = { ...defaultHomepageData, ...entry.publishedData };
      if (!merged.stats || merged.stats.length === 0) {
        merged.stats = defaultHomepageData.stats;
      }
      reset(merged);
    }
  }, [entry, reset]);

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (data) => cmsService.updateCmsData('homepage', data),
    onSuccess: () => {
      toast.success('Draft saved successfully to database');
      queryClient.invalidateQueries(['cms', 'homepage']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to save draft')
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      const currentValues = watch();
      await cmsService.updateCmsData('homepage', currentValues);
      return cmsService.publishCmsData('homepage', `Published version ${liveVersion + 1}`);
    },
    onSuccess: () => {
      toast.success('Homepage content published live to https://unlocktejas.com !');
      queryClient.invalidateQueries(['cms', 'homepage']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to publish live')
  });

  const rollbackMutation = useMutation({
    mutationFn: (versionNumber) => cmsService.rollbackCmsData('homepage', versionNumber),
    onSuccess: (data, variables) => {
      toast.success(`Rolled back to version ${variables}`);
      setShowHistory(false);
      queryClient.invalidateQueries(['cms', 'homepage']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to rollback')
  });

  const onSubmitDraft = (data) => saveDraftMutation.mutate(data);
  const onPublish = () => publishMutation.mutate();

  const tabs = [
    { id: 'stats', label: 'Homepage Metrics', icon: TrendingUp },
    { id: 'hero', label: 'Hero Banner', icon: Sparkles },
    { id: 'content', label: 'Mission & Vision', icon: Compass },
    { id: 'partners', label: 'Corporate Partners', icon: Building2 },
    { id: 'cta', label: 'Footer CTA', icon: Layers }
  ];

  const watchedStats = watch('stats') || [];

  if (isLoading) return <div className="p-12 text-center text-neutral-500 font-medium">Loading Homepage CMS Content...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24 flex relative">
      <div className="flex-1 space-y-6 transition-all">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-6 rounded-2xl shadow-xs border border-neutral-200/80 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-serif font-extrabold text-neutral-900 flex items-center gap-2">
                <Globe className="w-6 h-6 text-primary-700" /> Homepage CMS Editor
              </h1>
              {isDraft ? (
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Draft (Unpublished Changes)
                </span>
              ) : (
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Live (v{liveVersion})
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Changes saved and published here immediately update the live public website at unlocktejas.com.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setShowHistory(!showHistory)} 
              className="flex items-center gap-2 text-xs font-semibold"
            >
              <History className="w-4 h-4" /> Version History ({entry?.versions?.length || 0})
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleSubmit(onSubmitDraft)}
              disabled={saveDraftMutation.isPending || isSubmitting}
              className="text-xs font-semibold"
            >
              <Save className="w-4 h-4 mr-1.5" /> Save Draft
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={onPublish}
              disabled={publishMutation.isPending || isSubmitting}
              className="text-xs font-bold shadow-sm"
            >
              <Send className="w-4 h-4 mr-1.5" /> Publish Live
            </Button>
          </div>
        </div>

        <div className="flex gap-6 items-start flex-col md:flex-row">
          {/* Navigation Sidebar */}
          <div className="w-full md:w-64 bg-white rounded-2xl shadow-xs border border-neutral-200/80 p-2 space-y-1 shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700 shadow-xs'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </span>
                {activeTab === tab.id && <span className="w-1.5 h-1.5 rounded-full bg-primary-600"></span>}
              </button>
            ))}
          </div>

          {/* Form Content Area */}
          <div className="flex-1 w-full">
            <form id="cms-form" onSubmit={handleSubmit(onSubmitDraft)} className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xs border border-neutral-200/80 p-6 min-h-[500px]">
                
                {/* 1. HOMEPAGE METRICS & STATS TAB */}
                {activeTab === 'stats' && (
                  <div className="space-y-6 animate-in fade-in">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                      <div>
                        <h2 className="text-lg font-bold text-neutral-900">Homepage Metrics & Statistics</h2>
                        <p className="text-xs text-neutral-500">Edit values (e.g. 7+, 250+, 150+, 70%), labels, visibility, and display order.</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendStat({ value: '10+', label: 'New Metric', enabled: true })}
                        className="text-xs"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Metric Card
                      </Button>
                    </div>

                    {/* Live Preview Bar */}
                    <div className="p-5 bg-neutral-900 text-white rounded-2xl">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">
                        <Eye className="w-3.5 h-3.5" /> Live Homepage Preview
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        {watchedStats.filter(s => s.enabled !== false).map((st, i) => (
                          <div key={i} className="p-3 bg-neutral-800/80 rounded-xl border border-neutral-700">
                            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-sans">{st.value || '0'}</div>
                            <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-300 mt-1">{st.label || 'Label'}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metric Cards Editor */}
                    <div className="space-y-4">
                      {statFields.map((field, index) => (
                        <div 
                          key={field.id} 
                          className="p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/50 hover:bg-neutral-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between"
                        >
                          <div className="flex items-center gap-3 w-full sm:w-auto">
                            <span className="w-6 h-6 rounded-full bg-neutral-200 text-neutral-700 text-xs font-bold flex items-center justify-center shrink-0">
                              {index + 1}
                            </span>
                            <div className="space-y-1 flex-1 sm:w-32">
                              <label className="text-[11px] font-bold text-neutral-600 uppercase">Value</label>
                              <Input 
                                {...register(`stats.${index}.value`, { required: true })} 
                                placeholder="e.g. 7+ or 250+" 
                                className="font-bold text-base"
                              />
                            </div>
                            <div className="space-y-1 flex-2 sm:w-64">
                              <label className="text-[11px] font-bold text-neutral-600 uppercase">Label</label>
                              <Input 
                                {...register(`stats.${index}.label`, { required: true })} 
                                placeholder="e.g. ACTIVE PROGRAMMES" 
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-200">
                            <label className="flex items-center gap-2 text-xs font-medium text-neutral-700 cursor-pointer">
                              <input 
                                type="checkbox" 
                                {...register(`stats.${index}.enabled`)} 
                                defaultChecked={field.enabled !== false}
                                className="rounded text-primary-600 w-4 h-4"
                              />
                              Visible
                            </label>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => moveStat(index, index - 1)}
                                className="p-1.5 rounded hover:bg-neutral-200 text-neutral-600 disabled:opacity-30"
                                title="Move Up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={index === statFields.length - 1}
                                onClick={() => moveStat(index, index + 1)}
                                className="p-1.5 rounded hover:bg-neutral-200 text-neutral-600 disabled:opacity-30"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeStat(index)}
                              className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 p-1.5"
                              title="Delete Metric"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. HERO TAB */}
                {activeTab === 'hero' && (
                  <div className="space-y-6 animate-in fade-in">
                    <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-2">Hero Banner Content</h2>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-neutral-700">Main Title</label>
                        <Input {...register('hero.title')} className="font-bold text-base" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-neutral-700">Subtitle / Description</label>
                        <Textarea {...register('hero.subtitle')} rows={3} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-neutral-700">Background Image URL</label>
                        <Input {...register('hero.backgroundImage')} type="url" placeholder="https://..." />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 bg-neutral-50 rounded-xl space-y-2 border border-neutral-200/80">
                          <span className="text-xs font-bold uppercase text-neutral-700">Primary Button</span>
                          <Input {...register('hero.primaryCta.text')} placeholder="Button Text (e.g. Explore Programs)" />
                          <Input {...register('hero.primaryCta.link')} placeholder="Button URL (e.g. /programs)" />
                        </div>
                        <div className="p-4 bg-neutral-50 rounded-xl space-y-2 border border-neutral-200/80">
                          <span className="text-xs font-bold uppercase text-neutral-700">Secondary Button</span>
                          <Input {...register('hero.secondaryCta.text')} placeholder="Button Text (e.g. Apply for Admission)" />
                          <Input {...register('hero.secondaryCta.link')} placeholder="Button URL (e.g. /admissions)" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. MISSION & VISION TAB */}
                {activeTab === 'content' && (
                  <div className="space-y-6 animate-in fade-in">
                    <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-2">Mission & Vision Preview</h2>
                    <div className="space-y-4">
                      <div className="p-4 bg-neutral-50 rounded-xl space-y-2 border border-neutral-200/80">
                        <label className="text-xs font-bold text-neutral-700">Mission Title</label>
                        <Input {...register('missionPreview.title')} />
                        <label className="text-xs font-bold text-neutral-700">Mission Statement</label>
                        <Textarea {...register('missionPreview.content')} rows={3} />
                      </div>
                      <div className="p-4 bg-neutral-50 rounded-xl space-y-2 border border-neutral-200/80">
                        <label className="text-xs font-bold text-neutral-700">Vision Title</label>
                        <Input {...register('visionPreview.title')} />
                        <label className="text-xs font-bold text-neutral-700">Vision Statement</label>
                        <Textarea {...register('visionPreview.content')} rows={3} />
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. CORPORATE PARTNERS TAB */}
                {activeTab === 'partners' && (
                  <div className="space-y-6 animate-in fade-in">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                      <div>
                        <h2 className="text-lg font-bold text-neutral-900">Corporate & Industry Partners</h2>
                        <p className="text-xs text-neutral-500">Logos shown on the homepage collaboration marquee.</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendPartner({ name: 'New Partner', logo: 'https://...' })}
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Partner
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {partnerFields.map((field, idx) => (
                        <div key={field.id} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
                          <Input {...register(`partners.${idx}.name`)} placeholder="Company Name" className="flex-1" />
                          <Input {...register(`partners.${idx}.logo`)} placeholder="Logo URL" className="flex-1" />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removePartner(idx)}
                            className="text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. FOOTER CTA TAB */}
                {activeTab === 'cta' && (
                  <div className="space-y-6 animate-in fade-in">
                    <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-2">Homepage Bottom Call to Action</h2>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-neutral-700">Headline Title</label>
                        <Input {...register('footerCta.title')} className="font-bold" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-neutral-700">Subtitle / Call to Action Copy</label>
                        <Textarea {...register('footerCta.subtitle')} rows={3} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-neutral-700">Button Text</label>
                          <Input {...register('footerCta.buttonText')} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-neutral-700">Button Target URL</label>
                          <Input {...register('footerCta.buttonLink')} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Version History Sidebar */}
      {showHistory && (
        <div className="w-80 ml-6 shrink-0 bg-white border border-neutral-200 shadow-xl rounded-2xl p-5 animate-in slide-in-from-right-8 h-[calc(100vh-120px)] sticky top-24 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
            <h3 className="font-bold text-neutral-900 flex items-center gap-2 text-sm">
              <History className="w-4 h-4 text-primary-700" /> Version History
            </h3>
            <button 
              onClick={() => setShowHistory(false)} 
              className="text-neutral-400 hover:text-neutral-600 text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            {entry?.versions && entry.versions.length > 0 ? (
              [...entry.versions].reverse().map((ver, idx) => (
                <div key={idx} className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-800">Version {ver.versionNumber}</span>
                    <span className="text-[10px] text-neutral-500">{new Date(ver.publishedAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-neutral-600 italic">"{ver.commitMessage || 'Snapshot'}"</p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => rollbackMutation.mutate(ver.versionNumber)}
                    disabled={rollbackMutation.isPending}
                    className="w-full text-xs font-semibold mt-1"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" /> Restore This Version
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-500 text-center py-6">No previous versions found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
