import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Users, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { cmsService } from '@/services/cmsService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ManageSocialProof() {
  const queryClient = useQueryClient();

  const { data: cmsData, isLoading } = useQuery({
    queryKey: ['cms', 'global_social_proof'],
    queryFn: () => cmsService.getCMSData('global_social_proof'),
  });

  const { register, handleSubmit, reset, control, watch, formState: { isSubmitting } } = useForm({
    defaultValues: {
      isActive: true,
      notifications: [
        { id: 1, name: 'Priya D.', city: 'Mumbai', action: 'applied for B.Tech AI', time: '2 mins ago' },
        { id: 2, name: 'Rahul K.', city: 'Bangalore', action: 'downloaded the Career Guide', time: '5 mins ago' },
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "notifications"
  });

  useEffect(() => {
    if (cmsData?.data?.data) {
      reset(cmsData.data.data);
    }
  }, [cmsData, reset]);

  const mutation = useMutation({
    mutationFn: (data) => cmsService.updateCMSData('global_social_proof', data),
    onSuccess: () => {
      toast.success('Social proof toasts updated successfully');
      queryClient.invalidateQueries(['cms', 'global_social_proof']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to save settings');
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  if (isLoading) return <div className="p-12 text-center text-gray-500">Loading Social Proof Settings...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Social Proof Toasts</h1>
        <p className="text-sm text-gray-500">Manage the recent activity popups that appear in the bottom left corner.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <Users className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-bold text-gray-900">Configuration</h3>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Enable Social Proof Toasts</p>
                <p className="text-xs text-gray-500">Show floating toast notifications simulating recent user activity.</p>
              </div>
              <input 
                type="checkbox" 
                {...register('isActive')} 
                className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500 cursor-pointer" 
              />
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Notifications Pool</h4>
              <p className="text-sm text-gray-500 mb-4">The system will randomly pick notifications from this list to display to the user.</p>
              
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="md:col-span-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                      <Input {...register(`notifications.${index}.name`, { required: true })} placeholder="e.g. Rahul K." />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                      <Input {...register(`notifications.${index}.city`, { required: true })} placeholder="e.g. Bangalore" />
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Action</label>
                      <Input {...register(`notifications.${index}.action`, { required: true })} placeholder="e.g. downloaded the guide" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Time</label>
                      <Input {...register(`notifications.${index}.time`, { required: true })} placeholder="e.g. 5 mins ago" />
                    </div>
                    <div className="md:col-span-1 flex justify-end">
                      <button 
                        type="button" 
                        onClick={() => remove(index)}
                        className="p-2.5 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                type="button" 
                variant="outline" 
                onClick={() => append({ id: Date.now(), name: '', city: '', action: '', time: 'just now' })}
                className="mt-4 w-full md:w-auto"
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Notification
              </Button>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-sm md:pl-64 flex justify-end z-10">
          <Button type="submit" variant="primary" disabled={isSubmitting} className="min-w-[150px]">
            {isSubmitting ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />Save Changes</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
