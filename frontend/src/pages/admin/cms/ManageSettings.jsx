import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Phone, Link as LinkIcon, Settings } from 'lucide-react';
import { toast } from 'sonner';

import { cmsService } from '@/services/cmsService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

export default function ManageSettings() {
  const queryClient = useQueryClient();

  const { data: cmsData, isLoading } = useQuery({
    queryKey: ['cms', 'site_settings'],
    queryFn: () => cmsService.getCMSData('site_settings'),
  });

  const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm({
    defaultValues: {
      contactEmail: 'admissions@tejasacademy.edu',
      contactPhone: '+91 800 123 4567',
      physicalAddress: '123 Education Drive, Tech Park, Bangalore, 560001, India',
      socialLinks: {
        linkedin: '',
        twitter: '',
        instagram: '',
        youtube: ''
      },
      branding: {
        logoUrl: '',
        faviconUrl: ''
      }
    }
  });

  useEffect(() => {
    if (cmsData?.data?.data) {
      reset(cmsData.data.data);
    }
  }, [cmsData, reset]);

  const mutation = useMutation({
    mutationFn: (data) => cmsService.updateCMSData('site_settings', data),
    onSuccess: () => {
      toast.success('Website settings saved successfully');
      queryClient.invalidateQueries(['cms', 'site_settings']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to save settings');
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const watchLogo = watch('branding.logoUrl');
  const watchFavicon = watch('branding.faviconUrl');

  if (isLoading) return <div className="p-12 text-center text-gray-500">Loading Site Settings...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Website Settings</h1>
        <p className="text-sm text-gray-500">Manage global contact information, branding, and social links.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Branding */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <Settings className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-bold text-gray-900">Branding Assets</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Logo Image URL</label>
              <div className="flex gap-4">
                <Input type="url" {...register('branding.logoUrl')} placeholder="https://..." className="flex-1" />
                {watchLogo && (
                  <div className="w-16 h-10 rounded flex items-center justify-center shrink-0 bg-gray-100 border border-gray-200">
                    <img src={watchLogo} alt="Logo" className="max-h-full max-w-full object-contain" onError={(e) => e.target.style.display='none'} />
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Favicon URL (.ico or .png)</label>
              <div className="flex gap-4">
                <Input type="url" {...register('branding.faviconUrl')} placeholder="https://..." className="flex-1" />
                {watchFavicon && (
                  <div className="w-10 h-10 rounded shrink-0 bg-gray-100 border border-gray-200 p-1">
                    <img src={watchFavicon} alt="Favicon" className="w-full h-full object-contain" onError={(e) => e.target.style.display='none'} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <Phone className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-bold text-gray-900">Contact Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Primary Email</label>
              <Input type="email" {...register('contactEmail')} placeholder="admissions@tejasacademy.edu" />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <Input type="tel" {...register('contactPhone')} placeholder="+91 800 123 4567" />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Physical Address</label>
              <Textarea {...register('physicalAddress')} rows={2} placeholder="Campus Address..." />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <LinkIcon className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-bold text-gray-900">Social Media Links</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">LinkedIn URL</label>
              <Input type="url" {...register('socialLinks.linkedin')} placeholder="https://linkedin.com/..." />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Twitter URL</label>
              <Input type="url" {...register('socialLinks.twitter')} placeholder="https://twitter.com/..." />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Instagram URL</label>
              <Input type="url" {...register('socialLinks.instagram')} placeholder="https://instagram.com/..." />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">YouTube Channel URL</label>
              <Input type="url" {...register('socialLinks.youtube')} placeholder="https://youtube.com/..." />
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-sm md:pl-64 flex justify-end z-10">
          <Button type="submit" variant="primary" disabled={isSubmitting} className="min-w-[150px]">
            {isSubmitting ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />Save Settings</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
