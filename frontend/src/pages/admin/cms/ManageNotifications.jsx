import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Bell } from 'lucide-react';
import { toast } from 'sonner';

import { cmsService } from '@/services/cmsService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ManageNotifications() {
  const queryClient = useQueryClient();

  const { data: cmsData, isLoading } = useQuery({
    queryKey: ['cms', 'global_notification'],
    queryFn: () => cmsService.getCMSData('global_notification'),
  });

  const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm({
    defaultValues: {
      isActive: false,
      message: 'Admissions for 2026 Batch are now open! Apply before March 31st.',
      ctaText: 'Apply Now',
      ctaLink: '/admissions',
    }
  });

  useEffect(() => {
    if (cmsData?.data?.data) {
      reset(cmsData.data.data);
    }
  }, [cmsData, reset]);

  const mutation = useMutation({
    mutationFn: (data) => cmsService.updateCMSData('global_notification', data),
    onSuccess: () => {
      toast.success('Notification bar updated successfully');
      queryClient.invalidateQueries(['cms', 'global_notification']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to save notification');
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const isActive = watch('isActive');
  const message = watch('message');
  const ctaText = watch('ctaText');

  if (isLoading) return <div className="p-12 text-center text-gray-500">Loading Notification Settings...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Announcement Bar</h1>
        <p className="text-sm text-gray-500">Manage the global alert banner shown at the top of the website.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Live Preview */}
          <div className="bg-gray-50 border-b border-gray-100 p-6 flex flex-col items-center justify-center min-h-[160px] relative">
            <span className="absolute top-2 left-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Live Preview</span>
            
            {isActive ? (
              <div className="w-full max-w-3xl bg-primary-900 text-white py-2.5 px-4 text-sm font-medium flex items-center justify-center gap-4 rounded shadow-lg transform scale-95 shadow-primary-900/20">
                <span>{message || 'Your announcement message goes here.'}</span>
                {ctaText && (
                  <span className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded-full text-xs transition-colors cursor-pointer whitespace-nowrap">
                    {ctaText}
                  </span>
                )}
              </div>
            ) : (
              <div className="text-gray-400 text-sm italic">Announcement bar is currently hidden.</div>
            )}
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <Bell className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-bold text-gray-900">Configuration</h3>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Show Announcement Bar</p>
                <p className="text-xs text-gray-500">Enable this to display the banner on all public pages.</p>
              </div>
              <input 
                type="checkbox" 
                {...register('isActive')} 
                className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500 cursor-pointer" 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Announcement Message <span className="text-red-500">*</span></label>
              <Input {...register('message', { required: true })} placeholder="e.g. Admissions are now open!" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Button Label (Optional)</label>
                <Input {...register('ctaText')} placeholder="e.g. Apply Now" />
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Button URL (Optional)</label>
                <Input {...register('ctaLink')} placeholder="e.g. /admissions" />
                <p className="text-xs text-gray-500">Use relative paths (e.g., /contact) or full URLs (https://...).</p>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-sm md:pl-64 flex justify-end z-10">
          <Button type="submit" variant="primary" disabled={isSubmitting} className="min-w-[150px]">
            {isSubmitting ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />Save Announcement</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
