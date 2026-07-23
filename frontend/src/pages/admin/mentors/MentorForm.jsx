import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { mentorService } from '@/services/mentorService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

const mentorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().min(2, 'Company is required'),
  designation: z.string().min(2, 'Designation is required'),
  industry: z.string().min(2, 'Industry is required'),
  experienceYears: z.number().min(0, 'Must be a positive number'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  expertise: z.array(z.object({
    topic: z.string().min(1, 'Expertise topic is required')
  })).optional(),
  socialLinks: z.object({
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    website: z.string().optional()
  }).optional(),
});

export default function MentorForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: mentorData, isLoading } = useQuery({
    queryKey: ['mentor', id],
    queryFn: () => mentorService.getMentorById(id),
    enabled: isEditing,
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(mentorSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      designation: '',
      industry: '',
      experienceYears: 0,
      bio: '',
      expertise: [],
      socialLinks: { linkedin: '', twitter: '', website: '' }
    }
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
    control,
    name: "expertise"
  });

  useEffect(() => {
    if (mentorData?.data) {
      const m = mentorData.data;
      reset({
        name: m.user?.name || '',
        email: m.user?.email || '',
        company: m.company || '',
        designation: m.designation || '',
        industry: m.industry || '',
        experienceYears: m.experienceYears || 0,
        bio: m.bio || '',
        expertise: m.expertise?.map(e => ({ topic: e })) || [],
        socialLinks: {
          linkedin: m.socialLinks?.linkedin || '',
          twitter: m.socialLinks?.twitter || '',
          website: m.socialLinks?.website || ''
        }
      });
    }
  }, [mentorData, reset]);

  const mutation = useMutation({
    mutationFn: (data) => isEditing ? mentorService.updateMentor(id, data) : mentorService.createMentor(data),
    onSuccess: () => {
      toast.success(isEditing ? 'Mentor profile updated' : 'Mentor profile created');
      queryClient.invalidateQueries(['mentors']);
      navigate('/admin/mentors');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  });

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      expertise: data.expertise?.map(e => e.topic).filter(Boolean) || []
    };
    mutation.mutate(formattedData);
  };

  if (isLoading) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" as={Link} to="/admin/mentors" className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Mentor Profile' : 'Add New Mentor'}
          </h1>
          <p className="text-sm text-gray-500">Enter personal details, industry experience, and expertise.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
              <Input {...register('name')} placeholder="e.g. John Doe" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
              <Input type="email" {...register('email')} placeholder="john@example.com" disabled={isEditing} className={isEditing ? "bg-gray-100 cursor-not-allowed" : ""} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              {isEditing && <p className="text-xs text-gray-500">Email cannot be changed after creation.</p>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Industry Profile</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Company <span className="text-red-500">*</span></label>
              <Input {...register('company')} placeholder="e.g. Google, Microsoft" />
              {errors.company && <p className="text-xs text-red-500">{errors.company.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Designation <span className="text-red-500">*</span></label>
              <Input {...register('designation')} placeholder="e.g. Senior Software Engineer" />
              {errors.designation && <p className="text-xs text-red-500">{errors.designation.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Industry <span className="text-red-500">*</span></label>
              <Input {...register('industry')} placeholder="e.g. Technology, Finance" />
              {errors.industry && <p className="text-xs text-red-500">{errors.industry.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Experience (Years) <span className="text-red-500">*</span></label>
              <Input type="number" {...register('experienceYears', { valueAsNumber: true })} />
              {errors.experienceYears && <p className="text-xs text-red-500">{errors.experienceYears.message}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Areas of Expertise</label>
              <Button type="button" variant="outline" size="sm" onClick={() => appendExp({ topic: '' })}>
                <Plus className="w-4 h-4 mr-1" /> Add Topic
              </Button>
            </div>
            {expFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input {...register(`expertise.${index}.topic`)} placeholder="e.g. System Design, Product Strategy" className="flex-grow" />
                <Button type="button" variant="ghost" className="text-red-500" onClick={() => removeExp(index)}>
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Professional Biography <span className="text-red-500">*</span></label>
            <Textarea {...register('bio')} rows={5} placeholder="Write a short biography..." />
            {errors.bio && <p className="text-xs text-red-500">{errors.bio.message}</p>}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Social Links (Optional)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">LinkedIn URL</label>
              <Input {...register('socialLinks.linkedin')} placeholder="https://linkedin.com/in/..." />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Twitter URL</label>
              <Input {...register('socialLinks.twitter')} placeholder="https://twitter.com/..." />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Personal Website</label>
              <Input {...register('socialLinks.website')} placeholder="https://..." />
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-sm md:pl-64 flex justify-end gap-4 z-10">
          <Button type="button" variant="outline" as={Link} to="/admin/mentors">Cancel</Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />{isEditing ? 'Update Profile' : 'Save Profile'}</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
