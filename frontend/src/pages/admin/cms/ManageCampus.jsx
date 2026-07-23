import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Plus, Trash2, Map } from 'lucide-react';
import { toast } from 'sonner';

import { cmsService } from '@/services/cmsService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

const defaultCampusData = {
  title: 'Our Campus',
  description: 'Take a virtual tour of our modern facilities designed for collaborative learning.',
  facilities: [
    { image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=400&fit=crop', title: 'Main Library', description: 'State of the art library.' }
  ]
};

export default function ManageCampus() {
  const queryClient = useQueryClient();

  const { data: cmsData, isLoading, isError } = useQuery({
    queryKey: ['cms', 'campus'],
    queryFn: () => cmsService.getCmsData('campus'),
    retry: 1,
  });

  const { register, control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: defaultCampusData
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'facilities'
  });

  useEffect(() => {
    if (cmsData?.data?.data) {
      reset(cmsData.data.data);
    } else if (isError) {
      reset(defaultCampusData);
    }
  }, [cmsData, isError, reset]);

  const mutation = useMutation({
    mutationFn: (data) => cmsService.updateCmsData('campus', data),
    onSuccess: () => {
      toast.success('Campus CMS updated successfully');
      queryClient.invalidateQueries(['cms', 'campus']);
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
            <Map className="w-6 h-6 text-primary-600" />
            Campus Page CMS
          </h1>
          <p className="text-sm text-gray-500">Manage the campus overview and facilities gallery.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Page Title</label>
              <Input {...register('title')} required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Page Description</label>
              <Textarea {...register('description')} rows={3} required />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-lg font-bold text-gray-900">Campus Facilities</h2>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ image: '', title: '', description: '' })}>
              <Plus className="w-4 h-4 mr-1" /> Add Facility
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
                    <label className="text-xs text-gray-500">Image URL</label>
                    <Input {...register(`facilities.${index}.image`)} required />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs text-gray-500">Title</label>
                    <Input {...register(`facilities.${index}.title`)} required />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs text-gray-500">Description (Optional)</label>
                    <Textarea {...register(`facilities.${index}.description`)} rows={2} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-sm md:pl-64 flex justify-end z-10">
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Publish Changes</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
