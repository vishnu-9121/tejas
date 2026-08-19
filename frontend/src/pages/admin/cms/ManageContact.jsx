import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Send, PhoneCall, Eye, MapPin, Mail, Clock } from 'lucide-react';
import { toast } from 'sonner';

import { cmsService } from '@/services/cmsService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';

const defaultContactData = {
  heroTitle: 'Get in Touch with Our Academic Admissions Desk',
  heroSubtitle: 'Have questions about admissions, campus life, scholarships, or institutional partnerships? Our counselors are here to help.',
  phone: '+91 83310 51327',
  email: 'support@unlocktejas.com',
  address: 'Beside L K Towers, Roy Nagar, Gannavaram, Vijayawada, Amaravathi - 521101',
  officeHours: 'Monday – Saturday: 9:00 AM – 6:00 PM IST',
  googleMapsEmbedUrl: 'https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Gannavaram+(Tejas%20Academy)&t=&z=14&ie=UTF8&iwloc=B&output=embed'
};

export default function ManageContact() {
  const queryClient = useQueryClient();

  const { data: cmsResponse, isLoading } = useQuery({
    queryKey: ['cms', 'contact', 'DRAFT'],
    queryFn: () => cmsService.getCmsData('contact', 'DRAFT'),
  });

  const entry = cmsResponse?.data;
  const isDraft = entry?.status === 'DRAFT';
  const liveVersion = entry?.publishedVersionNumber || 1;

  const { register, handleSubmit, reset } = useForm({
    defaultValues: defaultContactData
  });

  useEffect(() => {
    const data = entry?.data && Object.keys(entry.data).length > 0 ? entry.data : entry?.publishedData;
    if (data && (data.phone || data.email || data.address)) {
      reset(data);
    } else {
      reset(defaultContactData);
    }
  }, [entry, reset]);

  const saveDraftMutation = useMutation({
    mutationFn: (data) => cmsService.updateCmsData('contact', data),
    onSuccess: () => {
      toast.success('Contact page draft saved successfully');
      queryClient.invalidateQueries(['cms', 'contact']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to save draft')
  });

  const publishMutation = useMutation({
    mutationFn: async (formData) => {
      await cmsService.updateCmsData('contact', formData);
      return await cmsService.publishCmsData('contact', `Published Contact page update v${liveVersion + 1}`);
    },
    onSuccess: () => {
      toast.success('Contact page published live to public website!');
      queryClient.invalidateQueries(['cms', 'contact']);
      queryClient.invalidateQueries(['cms', 'site_settings']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to publish')
  });

  const onSubmitDraft = (data) => saveDraftMutation.mutate(data);
  const onSubmitPublish = (data) => publishMutation.mutate(data);

  if (isLoading) return <div className="p-16 text-center text-gray-500 bg-white rounded-3xl">Loading Contact CMS...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24 font-inter">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold">
            <PhoneCall className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-outfit">
              Contact Page & Campus Desk CMS
            </h1>
            <p className="text-xs text-gray-500">
              Manage official admissions contact numbers, campus physical location, working hours, and map iframe.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={isDraft ? "warning" : "success"} className="text-xs mr-2">
            {isDraft ? "Draft" : `Live v${liveVersion}`}
          </Badge>
          <Button variant="outline" size="sm" as="a" href="/contact" target="_blank" className="text-xs flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> View Public Page
          </Button>
          <Button variant="outline" size="sm" onClick={handleSubmit(onSubmitDraft)} disabled={saveDraftMutation.isPending} className="text-xs">
            <Save className="w-3.5 h-3.5 mr-1" /> Save Draft
          </Button>
          <Button type="button" variant="primary" size="sm" onClick={handleSubmit(onSubmitPublish)} disabled={publishMutation.isPending} className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
            <Send className="w-3.5 h-3.5 mr-1" /> Publish Live
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmitPublish)} className="space-y-6 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Contact Page Banner & Info</h2>

        <div className="space-y-4">
          <Input label="Hero Banner Title" {...register('heroTitle')} required />
          <Textarea label="Hero Subtitle" rows={3} {...register('heroSubtitle')} required />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Admissions Helpline Phone" {...register('phone')} placeholder="+91 83310 51327" required />
            <Input label="Official Contact Email" {...register('email')} placeholder="support@unlocktejas.com" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Office & Counseling Working Hours" {...register('officeHours')} placeholder="Monday – Saturday: 9:00 AM – 6:00 PM IST" required />
            <Input label="Google Maps Embed URL / Iframe src" {...register('googleMapsEmbedUrl')} placeholder="https://maps.google.com/..." required />
          </div>

          <Textarea label="Full Campus Physical Address" rows={3} {...register('address')} placeholder="Beside L K Towers, Roy Nagar, Gannavaram, Vijayawada, Amaravathi - 521101" required />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={handleSubmit(onSubmitDraft)} disabled={saveDraftMutation.isPending}>
            <Save className="w-4 h-4 mr-1.5" /> Save Draft
          </Button>
          <Button type="submit" variant="primary" disabled={publishMutation.isPending} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
            <Send className="w-4 h-4 mr-1.5" /> Publish Live
          </Button>
        </div>
      </form>
    </div>
  );
}
