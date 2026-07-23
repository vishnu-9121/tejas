import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Plus, Trash2, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

import { cmsService } from '@/services/cmsService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const defaultCareersData = {
  jobs: [
    { id: 1, title: 'Senior Professor - AI', dept: 'Academics', type: 'Full-time', location: 'On-campus', exp: '10+ Years' },
    { id: 2, title: 'Student Counselor', dept: 'Support', type: 'Part-time', location: 'On-campus', exp: '3+ Years' }
  ]
};

export default function ManageCareers() {
  const queryClient = useQueryClient();

  const { data: cmsData, isLoading, isError } = useQuery({
    queryKey: ['cms', 'careers'],
    queryFn: () => cmsService.getCmsData('careers'),
    retry: 1,
  });

  const { register, control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: defaultCareersData
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'jobs'
  });

  useEffect(() => {
    if (cmsData?.data?.data) {
      reset(cmsData.data.data);
    } else if (isError) {
      reset(defaultCareersData);
    }
  }, [cmsData, isError, reset]);

  const mutation = useMutation({
    mutationFn: (data) => cmsService.updateCmsData('careers', data),
    onSuccess: () => {
      toast.success('Careers CMS updated successfully');
      queryClient.invalidateQueries(['cms', 'careers']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update content');
    }
  });

  const onSubmit = (data) => mutation.mutate(data);

  if (isLoading) return <div className="p-12 text-center text-gray-500">Loading CMS data...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary-600" />
            Careers CMS
          </h1>
          <p className="text-sm text-gray-500">Manage open job positions displayed on the Careers page.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-lg font-bold text-gray-900">Job Openings</h2>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ id: Date.now(), title: '', dept: '', type: 'Full-time', location: 'On-campus', exp: '' })}>
              <Plus className="w-4 h-4 mr-1" /> Add Job
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="relative bg-gray-50 p-4 rounded-lg border border-gray-100">
                <button 
                  type="button" 
                  onClick={() => remove(index)}
                  className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-10">
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs text-gray-500">Job Title</label>
                    <Input {...register(`jobs.${index}.title`)} required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Department</label>
                    <Input {...register(`jobs.${index}.dept`)} required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Experience Required</label>
                    <Input {...register(`jobs.${index}.exp`)} placeholder="e.g. 5+ Years" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Employment Type</label>
                    <select {...register(`jobs.${index}.type`)} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500">
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Location</label>
                    <select {...register(`jobs.${index}.location`)} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500">
                      <option value="On-campus">On-campus</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            {fields.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No jobs currently listed.</p>}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-sm md:pl-64 flex justify-end z-10">
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Publish Careers</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
