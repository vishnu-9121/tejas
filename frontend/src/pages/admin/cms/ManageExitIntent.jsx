import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, MousePointerClick } from 'lucide-react';
import { toast } from 'sonner';

import { cmsService } from '@/services/cmsService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ManageExitIntent() {
  const queryClient = useQueryClient();

  const { data: cmsData, isLoading } = useQuery({
    queryKey: ['cms', 'global_exit_intent'],
    queryFn: () => cmsService.getCMSData('global_exit_intent'),
  });

  const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm({
    defaultValues: {
      isActive: true,
      headline: 'Wait! Before you go...',
      subtext: "Don't leave without our exclusive 2026 Future of Tech & Leadership Report.",
      description: 'Discover the skills top employers are looking for this year and how our programs guarantee your placement in leading MNCs.',
      buttonText: 'Download Free Report',
    }
  });

  useEffect(() => {
    if (cmsData?.data?.data) {
      reset(cmsData.data.data);
    }
  }, [cmsData, reset]);

  const mutation = useMutation({
    mutationFn: (data) => cmsService.updateCMSData('global_exit_intent', data),
    onSuccess: () => {
      toast.success('Exit Intent Modal updated successfully');
      queryClient.invalidateQueries(['cms', 'global_exit_intent']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to save exit intent');
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  if (isLoading) return <div className="p-12 text-center text-gray-500">Loading Exit Intent Settings...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Exit Intent Modal</h1>
        <p className="text-sm text-gray-500">Manage the popup that appears when users try to leave the website.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <MousePointerClick className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-bold text-gray-900">Configuration</h3>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Enable Exit Intent Popup</p>
                <p className="text-xs text-gray-500">Show this modal when the user moves their mouse to close the tab.</p>
              </div>
              <input 
                type="checkbox" 
                {...register('isActive')} 
                className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500 cursor-pointer" 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Headline <span className="text-red-500">*</span></label>
              <Input {...register('headline', { required: true })} placeholder="e.g. Wait! Before you go..." />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Subtext <span className="text-red-500">*</span></label>
              <Input {...register('subtext', { required: true })} placeholder="e.g. Don't leave without our exclusive report." />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
              <textarea 
                {...register('description', { required: true })} 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[100px]"
                placeholder="Detailed description here..." 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Button Text <span className="text-red-500">*</span></label>
              <Input {...register('buttonText', { required: true })} placeholder="e.g. Download Free Report" />
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
