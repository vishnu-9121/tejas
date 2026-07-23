import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Plus, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

import { programService } from '@/services/programService';
import api from '@/utils/api'; // For fetching dropdown options
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Tabs } from '@/components/ui/Tabs';

const programSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  category: z.string().min(1, 'Please select a category'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  overview: z.string().optional(),
  duration: z.string().min(1, 'Duration is required'),
  fees: z.number().min(0, 'Fees must be a positive number'),
  eligibility: z.string().min(1, 'Eligibility is required'),
  intake: z.number().min(1, 'Intake must be at least 1'),
  curriculum: z.array(z.object({
    semester: z.string().min(1, 'Semester name is required'),
    courses: z.string().min(1, 'Courses must be listed (comma separated)')
  })).optional(),
  learningOutcomes: z.string().optional(),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).optional(),
  thumbnailUrl: z.string().url('Must be a valid URL').or(z.literal('')),
  bannerUrl: z.string().url('Must be a valid URL').or(z.literal('')),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.string().optional(),
  }).optional(),
  status: z.enum(['Draft', 'Published', 'Archived']),
  isFeatured: z.boolean().default(false),
  facultyMapping: z.array(z.string()).optional(),
  mentorMapping: z.array(z.string()).optional(),
});

export default function ProgramForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('basic');

  // Fetch program data if editing
  const { data: programData, isLoading } = useQuery({
    queryKey: ['program', id],
    queryFn: () => programService.getProgramById(id),
    enabled: isEditing,
  });

  // Fetch dropdown options for faculty and mentors
  const { data: facultyData } = useQuery({
    queryKey: ['faculty-list'],
    queryFn: () => api.get('/faculty').then(res => res.data),
  });

  const { data: mentorData } = useQuery({
    queryKey: ['mentor-list'],
    queryFn: () => api.get('/mentors').then(res => res.data),
  });

  const facultyOptions = facultyData?.data?.faculty || [];
  const mentorOptions = mentorData?.data?.mentors || [];

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(programSchema),
    defaultValues: {
      title: '',
      category: '',
      description: '',
      overview: '',
      duration: '',
      fees: 0,
      eligibility: '',
      intake: 0,
      curriculum: [],
      learningOutcomes: '',
      faqs: [],
      thumbnailUrl: '',
      bannerUrl: '',
      seo: { metaTitle: '', metaDescription: '', keywords: '' },
      status: 'Published',
      isFeatured: false,
      facultyMapping: [],
      mentorMapping: [],
    }
  });

  const { fields: curriculumFields, append: appendCurriculum, remove: removeCurriculum } = useFieldArray({
    control,
    name: "curriculum"
  });

  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
    control,
    name: "faqs"
  });

  useEffect(() => {
    if (programData?.data) {
      const p = programData.data;
      reset({
        title: p.title,
        category: p.category,
        description: p.description,
        overview: p.overview || '',
        duration: p.duration,
        fees: p.fees,
        eligibility: p.eligibility,
        intake: p.intake,
        status: p.status || (p.isActive ? 'Published' : 'Draft'),
        isFeatured: p.isFeatured || false,
        thumbnailUrl: p.thumbnailUrl || '',
        bannerUrl: p.bannerUrl || '',
        learningOutcomes: p.learningOutcomes?.join('\n') || '',
        seo: p.seo || { metaTitle: '', metaDescription: '', keywords: '' },
        facultyMapping: p.facultyMapping?.map(f => f._id || f) || [],
        mentorMapping: p.mentorMapping?.map(m => m._id || m) || [],
        curriculum: p.curriculum?.map(c => ({
          semester: c.semester,
          courses: c.courses.join(', ')
        })) || [],
        faqs: p.faqs || [],
      });
    }
  }, [programData, reset]);

  const mutation = useMutation({
    mutationFn: (data) => isEditing ? programService.updateProgram(id, data) : programService.createProgram(data),
    onSuccess: () => {
      toast.success(isEditing ? 'Program updated successfully' : 'Program created successfully');
      queryClient.invalidateQueries(['programs']);
      navigate('/admin/programs');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  });

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      isActive: data.status === 'Published',
      learningOutcomes: data.learningOutcomes.split('\n').filter(Boolean),
      curriculum: data.curriculum?.map(c => ({
        semester: c.semester,
        courses: c.courses.split(',').map(course => course.trim()).filter(Boolean)
      })) || []
    };
    mutation.mutate(formattedData);
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'content', label: 'Media & Content' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'relationships', label: 'Relationships' },
    { id: 'seo', label: 'SEO & FAQs' },
  ];

  if (isLoading) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" as={Link} to="/admin/programs" className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Program' : 'Create New Program'}
            </h1>
            <p className="text-sm text-gray-500">Configure enterprise program details, media, and mappings.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="px-6 pt-4" />
          </div>

          <div className="p-6">
            
            {/* Tab: Basic Info */}
            <div className={activeTab === 'basic' ? 'block' : 'hidden'}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Program Title <span className="text-red-500">*</span></label>
                  <Input {...register('title')} placeholder="e.g. Master of Business Administration" className={errors.title ? 'border-red-500' : ''} />
                  {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
                  <select 
                    {...register('category')} 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Executive">Executive</option>
                    <option value="Certification">Certification</option>
                  </select>
                  {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Program Status</label>
                  <select 
                    {...register('status')} 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div className="space-y-1 flex items-center justify-between pt-6 px-4 bg-gray-50 border border-gray-100 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-900 block">Featured Program</label>
                    <span className="text-xs text-gray-500">Highlight this program on the homepage</span>
                  </div>
                  <input type="checkbox" {...register('isFeatured')} className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Duration <span className="text-red-500">*</span></label>
                  <Input {...register('duration')} placeholder="e.g. 2 Years" />
                  {errors.duration && <p className="text-xs text-red-500">{errors.duration.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Fees (₹) <span className="text-red-500">*</span></label>
                  <Input type="number" {...register('fees', { valueAsNumber: true })} placeholder="e.g. 500000" />
                  {errors.fees && <p className="text-xs text-red-500">{errors.fees.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Intake / Seats <span className="text-red-500">*</span></label>
                  <Input type="number" {...register('intake', { valueAsNumber: true })} placeholder="e.g. 60" />
                  {errors.intake && <p className="text-xs text-red-500">{errors.intake.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Eligibility Criteria <span className="text-red-500">*</span></label>
                  <Input {...register('eligibility')} placeholder="e.g. Bachelor's Degree with minimum 50%" />
                  {errors.eligibility && <p className="text-xs text-red-500">{errors.eligibility.message}</p>}
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Short Description (Card View) <span className="text-red-500">*</span></label>
                  <Textarea {...register('description')} rows={2} placeholder="Brief summary for program cards..." />
                  {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                </div>
              </div>
            </div>

            {/* Tab: Media & Content */}
            <div className={activeTab === 'content' ? 'block' : 'hidden'}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Thumbnail URL (For Cards)</label>
                  <Input {...register('thumbnailUrl')} type="url" placeholder="https://..." />
                  {errors.thumbnailUrl && <p className="text-xs text-red-500">{errors.thumbnailUrl.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Banner URL (For Hero Header)</label>
                  <Input {...register('bannerUrl')} type="url" placeholder="https://..." />
                  {errors.bannerUrl && <p className="text-xs text-red-500">{errors.bannerUrl.message}</p>}
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Detailed Overview (Rich Text representation)</label>
                  <Textarea {...register('overview')} rows={6} placeholder="Comprehensive program overview..." />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Learning Outcomes (One per line)</label>
                  <Textarea {...register('learningOutcomes')} rows={6} placeholder="Students will learn how to...&#10;Students will master...&#10;Develop strong analytical skills..." />
                </div>
              </div>
            </div>

            {/* Tab: Curriculum */}
            <div className={activeTab === 'curriculum' ? 'block' : 'hidden'}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">Curriculum Structure</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendCurriculum({ semester: '', courses: '' })}>
                    <Plus className="w-4 h-4 mr-2" /> Add Semester/Term
                  </Button>
                </div>

                {curriculumFields.length === 0 && (
                  <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-lg text-gray-500">
                    No curriculum modules added yet. Click "Add Semester" to begin.
                  </div>
                )}

                <div className="space-y-4">
                  {curriculumFields.map((field, index) => (
                    <div key={field.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex gap-4">
                      <div className="mt-2 text-gray-400 cursor-grab">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-700">Semester/Term Name</label>
                          <Input {...register(`curriculum.${index}.semester`)} placeholder="e.g. Semester 1" className="bg-white" />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs font-medium text-gray-700">Courses (Comma separated)</label>
                          <Input {...register(`curriculum.${index}.courses`)} placeholder="e.g. Marketing, Finance, Ethics" className="bg-white" />
                        </div>
                      </div>
                      <Button type="button" variant="ghost" className="text-gray-400 hover:text-red-500 self-center" onClick={() => removeCurriculum(index)}>
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tab: Relationships (Faculty & Mentors) */}
            <div className={activeTab === 'relationships' ? 'block' : 'hidden'}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Faculty Mapping */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-900">Map Core Faculty</h3>
                  <p className="text-sm text-gray-500">Hold Ctrl/Cmd to select multiple faculty members.</p>
                  <select 
                    multiple
                    {...register('facultyMapping')} 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[200px]"
                  >
                    {facultyOptions.map(faculty => (
                      <option key={faculty._id} value={faculty._id}>
                        {faculty.firstName} {faculty.lastName} ({faculty.department})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mentor Mapping */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-900">Map Industry Mentors</h3>
                  <p className="text-sm text-gray-500">Hold Ctrl/Cmd to select multiple industry mentors.</p>
                  <select 
                    multiple
                    {...register('mentorMapping')} 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[200px]"
                  >
                    {mentorOptions.map(mentor => (
                      <option key={mentor._id} value={mentor._id}>
                        {mentor.firstName} {mentor.lastName} ({mentor.company})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Tab: SEO & FAQs */}
            <div className={activeTab === 'seo' ? 'block' : 'hidden'}>
              <div className="space-y-8">
                
                {/* SEO */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Search Engine Optimization</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Meta Title</label>
                      <Input {...register('seo.metaTitle')} placeholder="Optimized title for search engines" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Meta Keywords</label>
                      <Input {...register('seo.keywords')} placeholder="Comma separated keywords" />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Meta Description</label>
                      <Textarea {...register('seo.metaDescription')} rows={2} placeholder="Brief description for search engine snippets" />
                    </div>
                  </div>
                </div>

                {/* FAQs */}
                <div className="space-y-4 pt-6">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-lg font-bold text-gray-900">Program FAQs</h3>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendFaq({ question: '', answer: '' })}>
                      <Plus className="w-4 h-4 mr-2" /> Add FAQ
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {faqFields.map((field, index) => (
                      <div key={field.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex gap-4 items-start">
                        <div className="flex-grow space-y-3">
                          <Input {...register(`faqs.${index}.question`)} placeholder="Question" />
                          <Textarea {...register(`faqs.${index}.answer`)} rows={2} placeholder="Answer" />
                        </div>
                        <Button type="button" variant="ghost" className="text-gray-400 hover:text-red-500" onClick={() => removeFaq(index)}>
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Floating Actions */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:pl-64 flex justify-end gap-4 z-10">
          <Button type="button" variant="outline" as={Link} to="/admin/programs">
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting} className="min-w-[120px]">
            {isSubmitting ? 'Saving...' : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Update Program' : 'Publish Program'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
