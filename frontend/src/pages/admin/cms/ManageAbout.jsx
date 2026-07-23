import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Plus, Trash2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

import { cmsService } from '@/services/cmsService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

const defaultAboutData = {
  overview: {
    title: 'A Legacy of Excellence',
    backgroundImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80',
    description: 'Tejas Academy of Excellence was founded with a singular vision: to create a transformative educational environment that bridges the gap between timeless wisdom and future-ready skills. For over two decades, we have been at the forefront of holistic education in India.',
    historyText: 'Starting as a small institute in 2005, Tejas Academy has grown into a premier institution recognized globally for its academic rigor, innovative research, and commitment to societal impact.'
  },
  missionVision: {
    mission: 'Our mission is to nurture ethically grounded, globally competitive leaders who drive positive change in society through excellence in education, research, and innovation. We believe in providing an environment that encourages critical thinking, creativity, and a spirit of inquiry.',
    vision: 'To be a premier global institution recognized for creating holistic leaders who harmonize human excellence with technological advancement. We envision a future where our alumni are the primary catalysts for sustainable global progress.'
  },
  messages: {
    chairman: {
      name: 'Dr. Vikram Sharma',
      title: 'Chairman, Board of Governors',
      imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=60',
      message: 'At Tejas Academy, we don\'t just impart knowledge; we shape character. Our goal is to empower the next generation with the skills, values, and resilience needed to navigate an increasingly complex world.'
    },
    founder: {
      name: 'Late Smt. Aruna Desai',
      title: 'Founder',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=60',
      message: 'Education is the ultimate equalizer. When we founded this institution, our dream was to create a sanctuary of learning where every student could discover their true potential and purpose.'
    }
  },
  timeline: [
    { year: '2005', title: 'Foundation', description: 'Tejas Academy established with an inaugural batch of 50 students.' },
    { year: '2010', title: 'Campus Expansion', description: 'Moved to the new 50-acre sustainable green campus.' },
    { year: '2018', title: 'Global Recognition', description: 'Ranked among the top 50 institutions in Asia for innovation.' }
  ],
  values: [
    { title: 'Integrity', description: 'Upholding the highest ethical standards in all endeavors.' },
    { title: 'Excellence', description: 'Striving for continuous improvement and outstanding results.' },
    { title: 'Innovation', description: 'Fostering creativity and embracing new technologies.' },
    { title: 'Inclusivity', description: 'Celebrating diversity and creating a welcoming community for all.' }
  ],
  awards: [
    { year: '2023', title: 'Best Innovation Campus', issuer: 'National Education Board' },
    { year: '2022', title: 'Green Campus Award', issuer: 'Ministry of Environment' }
  ]
};

export default function ManageAbout() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: cmsData, isLoading, isError } = useQuery({
    queryKey: ['cms', 'about'],
    queryFn: () => cmsService.getCmsData('about'),
    retry: 1,
  });

  const { register, control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: defaultAboutData
  });

  const { fields: timelineFields, append: appendTimeline, remove: removeTimeline } = useFieldArray({
    control,
    name: 'timeline'
  });

  const { fields: valueFields, append: appendValue, remove: removeValue } = useFieldArray({
    control,
    name: 'values'
  });

  const { fields: awardFields, append: appendAward, remove: removeAward } = useFieldArray({
    control,
    name: 'awards'
  });

  useEffect(() => {
    if (cmsData?.data?.data) {
      reset(cmsData.data.data);
    } else if (isError) {
      reset(defaultAboutData);
    }
  }, [cmsData, isError, reset]);

  const mutation = useMutation({
    mutationFn: (data) => cmsService.updateCmsData('about', data),
    onSuccess: () => {
      toast.success('About page content updated successfully');
      queryClient.invalidateQueries(['cms', 'about']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update content');
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const tabs = [
    { id: 'overview', label: 'Overview & History' },
    { id: 'mission', label: 'Mission & Vision' },
    { id: 'messages', label: 'Leadership Messages' },
    { id: 'timeline', label: 'Timeline / Journey' },
    { id: 'values', label: 'Core Values' },
    { id: 'awards', label: 'Awards & Achievements' }
  ];

  if (isLoading) return <div className="p-12 text-center text-gray-500">Loading CMS data...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary-600" />
            About Page CMS
          </h1>
          <p className="text-sm text-gray-500">Manage institutional history, values, and leadership content.</p>
        </div>
      </div>

      <div className="flex gap-6 items-start flex-col md:flex-row">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0 space-y-1 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={(e) => { e.preventDefault(); setActiveTab(tab.id); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
              
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in">
                  <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Overview Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Page Title</label>
                      <Input {...register('overview.title')} className="font-bold text-lg" />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Banner Image URL</label>
                      <Input {...register('overview.backgroundImage')} type="url" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Main Description</label>
                      <Textarea {...register('overview.description')} rows={4} />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">History Text</label>
                      <Textarea {...register('overview.historyText')} rows={6} />
                    </div>
                  </div>
                </div>
              )}

              {/* MISSION/VISION TAB */}
              {activeTab === 'mission' && (
                <div className="space-y-6 animate-in fade-in">
                  <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Mission & Vision</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Detailed Mission Statement</label>
                      <Textarea {...register('missionVision.mission')} rows={5} />
                    </div>
                    
                    <div className="space-y-1 pt-4 border-t border-gray-100">
                      <label className="text-sm font-medium text-gray-700">Detailed Vision Statement</label>
                      <Textarea {...register('missionVision.vision')} rows={5} />
                    </div>
                  </div>
                </div>
              )}

              {/* MESSAGES TAB */}
              {activeTab === 'messages' && (
                <div className="space-y-8 animate-in fade-in">
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Chairman's Message</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Name</label>
                        <Input {...register('messages.chairman.name')} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Title</label>
                        <Input {...register('messages.chairman.title')} />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Image URL</label>
                        <Input {...register('messages.chairman.imageUrl')} type="url" />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Message Content</label>
                        <Textarea {...register('messages.chairman.message')} rows={4} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Founder's Message</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Name</label>
                        <Input {...register('messages.founder.name')} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Title</label>
                        <Input {...register('messages.founder.title')} />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Image URL</label>
                        <Input {...register('messages.founder.imageUrl')} type="url" />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Message Content</label>
                        <Textarea {...register('messages.founder.message')} rows={4} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TIMELINE TAB */}
              {activeTab === 'timeline' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-lg font-bold text-gray-900">Journey Timeline</h2>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendTimeline({ year: '', title: '', description: '' })}>
                      <Plus className="w-4 h-4 mr-1" /> Add Milestone
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {timelineFields.map((field, index) => (
                      <div key={field.id} className="relative bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <button 
                          type="button" 
                          onClick={() => removeTimeline(index)}
                          className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-8">
                          <div className="space-y-1">
                            <label className="text-xs text-gray-500">Year</label>
                            <Input {...register(`timeline.${index}.year`)} required className="font-bold" />
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <label className="text-xs text-gray-500">Title</label>
                            <Input {...register(`timeline.${index}.title`)} required />
                          </div>
                          <div className="space-y-1 md:col-span-3">
                            <label className="text-xs text-gray-500">Description</label>
                            <Textarea {...register(`timeline.${index}.description`)} rows={2} required />
                          </div>
                        </div>
                      </div>
                    ))}
                    {timelineFields.length === 0 && <p className="text-sm text-gray-500">No milestones added.</p>}
                  </div>
                </div>
              )}

              {/* VALUES TAB */}
              {activeTab === 'values' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-lg font-bold text-gray-900">Core Values</h2>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendValue({ title: '', description: '' })}>
                      <Plus className="w-4 h-4 mr-1" /> Add Value
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {valueFields.map((field, index) => (
                      <div key={field.id} className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="flex-1 space-y-1">
                          <label className="text-xs text-gray-500">Value Title</label>
                          <Input {...register(`values.${index}.title`)} required className="font-bold" />
                        </div>
                        <div className="flex-[2] space-y-1">
                          <label className="text-xs text-gray-500">Description</label>
                          <Textarea {...register(`values.${index}.description`)} rows={2} required />
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeValue(index)}
                          className="mt-6 p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    {valueFields.length === 0 && <p className="text-sm text-gray-500">No values added.</p>}
                  </div>
                </div>
              )}

              {/* AWARDS TAB */}
              {activeTab === 'awards' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-lg font-bold text-gray-900">Awards & Achievements</h2>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendAward({ year: '', title: '', issuer: '' })}>
                      <Plus className="w-4 h-4 mr-1" /> Add Award
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {awardFields.map((field, index) => (
                      <div key={field.id} className="flex gap-4 items-center bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="w-24 space-y-1">
                          <label className="text-xs text-gray-500">Year</label>
                          <Input {...register(`awards.${index}.year`)} required />
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="text-xs text-gray-500">Award Title</label>
                          <Input {...register(`awards.${index}.title`)} required />
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="text-xs text-gray-500">Issuer / Organization</label>
                          <Input {...register(`awards.${index}.issuer`)} required />
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeAward(index)}
                          className="mt-5 p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    {awardFields.length === 0 && <p className="text-sm text-gray-500">No awards added.</p>}
                  </div>
                </div>
              )}
              
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-sm md:pl-64 flex justify-end z-10">
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Publish About Page</>}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
