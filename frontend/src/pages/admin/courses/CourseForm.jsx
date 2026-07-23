import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Plus, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

import { courseService } from '@/services/courseService';
import { programService } from '@/services/programService';
import { facultyService } from '@/services/facultyService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Tabs } from '@/components/ui/Tabs';

const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  category: z.string().min(1, 'Category is required'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  duration: z.string().min(1, 'Duration is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  credits: z.number().min(1, 'Credits must be at least 1'),
  prerequisites: z.string().optional(),
  program: z.string().min(1, 'Program is required'),
  faculty: z.array(z.string()).optional(),
  curriculum: z.array(z.object({
    moduleName: z.string().min(1, 'Module name is required'),
    topics: z.string().min(1, 'Topics must be listed (comma separated)')
  })).optional(),
  status: z.enum(['draft', 'published']),
});

export default function CourseForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('basic');

  const { data: courseData, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: () => courseService.getCourseBySlug(id),
    enabled: isEditing,
  });

  const { data: programsData } = useQuery({
    queryKey: ['programs'],
    queryFn: () => programService.getPrograms({ limit: 100 }),
  });

  const { data: facultyData } = useQuery({
    queryKey: ['faculty'],
    queryFn: () => facultyService.getFaculty({ limit: 100 }),
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      category: '',
      level: 'Beginner',
      description: '',
      duration: '',
      price: 0,
      credits: 3,
      prerequisites: '',
      program: '',
      faculty: [],
      curriculum: [],
      status: 'draft',
    }
  });

  const { fields: moduleFields, append: appendModule, remove: removeModule } = useFieldArray({
    control,
    name: "curriculum"
  });

  useEffect(() => {
    if (courseData?.data) {
      const c = courseData.data;
      reset({
        title: c.title,
        category: c.category || '',
        level: c.level || 'Beginner',
        description: c.description,
        duration: c.duration,
        price: c.price || c.fee || 0, // Fallback for older data
        credits: c.credits || 3,
        prerequisites: c.prerequisites || '',
        program: c.program?._id || c.program || '',
        faculty: c.faculty?.map(f => f._id || f) || [],
        status: c.status || 'draft',
        curriculum: c.curriculum?.map(m => ({
          moduleName: m.moduleName,
          topics: m.topics.join(', ')
        })) || [],
      });
    }
  }, [courseData, reset]);

  const mutation = useMutation({
    mutationFn: (data) => isEditing ? courseService.updateCourse(courseData?.data?._id || id, data) : courseService.createCourse(data),
    onSuccess: () => {
      toast.success(isEditing ? 'Course updated successfully' : 'Course created successfully');
      queryClient.invalidateQueries(['courses']);
      navigate('/admin/courses');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  });

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      curriculum: data.curriculum?.map(m => ({
        moduleName: m.moduleName,
        topics: m.topics.split(',').map(topic => topic.trim()).filter(Boolean)
      })) || []
    };
    mutation.mutate(formattedData);
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'curriculum', label: 'Curriculum & Modules' },
  ];

  if (isLoading) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" as={Link} to="/admin/courses" className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Course' : 'Create New Course'}
            </h1>
            <p className="text-sm text-gray-500">Configure course modules, topics, and settings.</p>
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
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Course Title <span className="text-red-500">*</span></label>
                  <Input {...register('title')} placeholder="e.g. Advanced Leadership Principles" className={errors.title ? 'border-red-500' : ''} />
                  {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
                  <Input {...register('category')} placeholder="e.g. Management, Technology" />
                  {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Level <span className="text-red-500">*</span></label>
                  <select 
                    {...register('level')} 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  {errors.level && <p className="text-xs text-red-500">{errors.level.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Duration <span className="text-red-500">*</span></label>
                  <Input {...register('duration')} placeholder="e.g. 6 Weeks, 10 Hours" />
                  {errors.duration && <p className="text-xs text-red-500">{errors.duration.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Price (₹) <span className="text-red-500">*</span></label>
                  <Input type="number" {...register('price', { valueAsNumber: true })} placeholder="e.g. 15000 (0 for Free)" />
                  {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Credits <span className="text-red-500">*</span></label>
                  <Input type="number" {...register('credits', { valueAsNumber: true })} placeholder="e.g. 3" />
                  {errors.credits && <p className="text-xs text-red-500">{errors.credits.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Parent Program <span className="text-red-500">*</span></label>
                  <select 
                    {...register('program')} 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  >
                    <option value="">Select a Program</option>
                    {programsData?.data?.programs?.map(p => (
                      <option key={p._id} value={p._id}>{p.title}</option>
                    ))}
                  </select>
                  {errors.program && <p className="text-xs text-red-500">{errors.program.message}</p>}
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Prerequisites</label>
                  <Input {...register('prerequisites')} placeholder="e.g. Basic knowledge of Mathematics" />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                  <Textarea {...register('description')} rows={4} placeholder="Detailed course description..." />
                  {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                </div>
                
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Course Status</label>
                  <select 
                    {...register('status')} 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  >
                    <option value="draft">Draft (Hidden)</option>
                    <option value="published">Published (Visible)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tab: Curriculum */}
            <div className={activeTab === 'curriculum' ? 'block' : 'hidden'}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">Course Modules</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendModule({ moduleName: '', topics: '' })}>
                    <Plus className="w-4 h-4 mr-2" /> Add Module
                  </Button>
                </div>

                {moduleFields.length === 0 && (
                  <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-lg text-gray-500">
                    No modules added yet. Click "Add Module" to begin structuring the course.
                  </div>
                )}

                <div className="space-y-4">
                  {moduleFields.map((field, index) => (
                    <div key={field.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex gap-4">
                      <div className="mt-2 text-gray-400 cursor-grab">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-700">Module Name</label>
                          <Input {...register(`curriculum.${index}.moduleName`)} placeholder="e.g. Module 1: Introduction" className="bg-white" />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs font-medium text-gray-700">Topics (Comma separated)</label>
                          <Input {...register(`curriculum.${index}.topics`)} placeholder="e.g. Concept A, Concept B, Assignment" className="bg-white" />
                        </div>
                      </div>
                      <Button type="button" variant="ghost" className="text-gray-400 hover:text-red-500 self-center" onClick={() => removeModule(index)}>
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Actions */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:pl-64 flex justify-end gap-4 z-10">
          <Button type="button" variant="outline" as={Link} to="/admin/courses">
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting} className="min-w-[120px]">
            {isSubmitting ? 'Saving...' : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Update Course' : 'Save Course'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
