import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

import { cmsService } from '@/services/cmsService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ManageQuickConnect() {
  const queryClient = useQueryClient();

  const { data: cmsData, isLoading } = useQuery({
    queryKey: ['cms', 'global_quick_connect'],
    queryFn: () => cmsService.getCMSData('global_quick_connect'),
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      isActive: true,
      whatsappNumber: '918331051327',
      whatsappMessage: 'Hello, I would like to know more about Tejas Academy.',
      contactUrl: '/contact',
      brochureUrl: '/brochure.pdf',
    }
  });

  useEffect(() => {
    if (cmsData?.data?.data) {
      reset(cmsData.data.data);
    }
  }, [cmsData, reset]);

  const mutation = useMutation({
    mutationFn: (data) => cmsService.updateCMSData('global_quick_connect', data),
    onSuccess: () => {
      toast.success('Quick Connect settings updated successfully');
      queryClient.invalidateQueries(['cms', 'global_quick_connect']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to save settings');
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  if (isLoading) return <div className="p-12 text-center text-gray-500">Loading Quick Connect Settings...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quick Connect Widget</h1>
        <p className="text-sm text-gray-500">Manage the floating action button that appears in the bottom right corner.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <MessageCircle className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-bold text-gray-900">Configuration</h3>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Enable Quick Connect Widget</p>
                <p className="text-xs text-gray-500">Show the floating menu allowing users to WhatsApp, Call, or Download Brochure.</p>
              </div>
              <input 
                type="checkbox" 
                {...register('isActive')} 
                className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500 cursor-pointer" 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">WhatsApp Number</label>
              <Input {...register('whatsappNumber')} placeholder="e.g. 918331051327 (Include country code, no +)" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">WhatsApp Pre-filled Message</label>
              <Input {...register('whatsappMessage')} placeholder="e.g. Hi, I have an inquiry." />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Contact / Request a Call URL</label>
              <Input {...register('contactUrl')} placeholder="e.g. /contact" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Brochure PDF URL</label>
              <Input {...register('brochureUrl')} placeholder="e.g. /brochure.pdf" />
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
