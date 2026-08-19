import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Save, Share2, ExternalLink, CheckCircle2, AlertCircle, 
  Linkedin, Twitter, Instagram, Youtube, Facebook, MessageCircle, 
  Globe, Send, Github, Sparkles, RefreshCw, Eye
} from 'lucide-react';
import { toast } from 'sonner';

import { cmsService } from '@/services/cmsService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const SOCIAL_PLATFORMS = [
  {
    id: 'linkedin',
    name: 'LinkedIn Organization',
    description: 'Official corporate & professional showcase page for programs, faculty, and executive insights.',
    icon: Linkedin,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    placeholder: 'https://linkedin.com/company/unlocktejas',
    field: 'socialLinks.linkedin',
    defaultUrl: 'https://linkedin.com/company/unlocktejas'
  },
  {
    id: 'twitter',
    name: 'Twitter / X Profile',
    description: 'Institutional announcements, campus live updates, and thought leadership threads.',
    icon: Twitter,
    color: 'text-sky-500',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    placeholder: 'https://twitter.com/unlocktejas',
    field: 'socialLinks.twitter',
    defaultUrl: 'https://twitter.com/unlocktejas'
  },
  {
    id: 'instagram',
    name: 'Instagram Campus Feed',
    description: 'Visual stories, student life highlights, hackathons, and cultural festivities.',
    icon: Instagram,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    placeholder: 'https://instagram.com/unlocktejas',
    field: 'socialLinks.instagram',
    defaultUrl: 'https://instagram.com/unlocktejas'
  },
  {
    id: 'youtube',
    name: 'YouTube Channel',
    description: 'Recorded masterclasses, webinars, student testimonials, and convocation broadcasts.',
    icon: Youtube,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    placeholder: 'https://youtube.com/@unlocktejas',
    field: 'socialLinks.youtube',
    defaultUrl: 'https://youtube.com/@unlocktejas'
  },
  {
    id: 'facebook',
    name: 'Facebook Page',
    description: 'Parent community, general announcements, and institutional accreditations.',
    icon: Facebook,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    placeholder: 'https://facebook.com/unlocktejas',
    field: 'socialLinks.facebook',
    defaultUrl: 'https://facebook.com/unlocktejas'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Community & Support',
    description: 'Direct inquiry channel and student applicant advisory support line.',
    icon: MessageCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    placeholder: 'https://wa.me/918331051327?text=Hello%20Tejas%20Academy',
    field: 'socialLinks.whatsapp',
    defaultUrl: 'https://wa.me/918331051327?text=Hello%20Tejas%20Academy%2C%20I%20would%20like%20to%20learn%20more.'
  },
  {
    id: 'telegram',
    name: 'Telegram Channel (Optional)',
    description: 'Broadcast channel for study materials, entrance alerts, and scholarship notices.',
    icon: Send,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    placeholder: 'https://t.me/unlocktejas',
    field: 'socialLinks.telegram',
    defaultUrl: ''
  },
  {
    id: 'github',
    name: 'GitHub Organization (Optional)',
    description: 'Open-source curriculum code, student lab repositories, and developer initiatives.',
    icon: Github,
    color: 'text-slate-800',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    placeholder: 'https://github.com/unlocktejas',
    field: 'socialLinks.github',
    defaultUrl: ''
  }
];

export default function ManageSocialLinks() {
  const queryClient = useQueryClient();

  const { data: cmsData, isLoading } = useQuery({
    queryKey: ['cms', 'site_settings'],
    queryFn: () => cmsService.getCMSData('site_settings'),
  });

  const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm({
    defaultValues: {
      socialLinks: {
        linkedin: 'https://linkedin.com/company/unlocktejas',
        twitter: 'https://twitter.com/unlocktejas',
        instagram: 'https://instagram.com/unlocktejas',
        youtube: 'https://youtube.com/@unlocktejas',
        facebook: 'https://facebook.com/unlocktejas',
        whatsapp: 'https://wa.me/918331051327?text=Hello%20Tejas%20Academy%2C%20I%20would%20like%20to%20learn%20more.',
        telegram: '',
        github: ''
      }
    }
  });

  const currentSettings = cmsData?.data?.data || {};

  useEffect(() => {
    if (currentSettings) {
      reset({
        ...currentSettings,
        socialLinks: {
          linkedin: currentSettings.socialLinks?.linkedin ?? 'https://linkedin.com/company/unlocktejas',
          twitter: currentSettings.socialLinks?.twitter ?? 'https://twitter.com/unlocktejas',
          instagram: currentSettings.socialLinks?.instagram ?? 'https://instagram.com/unlocktejas',
          youtube: currentSettings.socialLinks?.youtube ?? 'https://youtube.com/@unlocktejas',
          facebook: currentSettings.socialLinks?.facebook ?? 'https://facebook.com/unlocktejas',
          whatsapp: currentSettings.socialLinks?.whatsapp ?? 'https://wa.me/918331051327?text=Hello%20Tejas%20Academy%2C%20I%20would%20like%20to%20learn%20more.',
          telegram: currentSettings.socialLinks?.telegram ?? '',
          github: currentSettings.socialLinks?.github ?? ''
        }
      });
    }
  }, [cmsData, reset]);

  const watchedLinks = watch('socialLinks') || {};

  const mutation = useMutation({
    mutationFn: async (formData) => {
      // Merge with existing site_settings so other settings remain intact
      const updatedPayload = {
        ...currentSettings,
        ...formData,
        socialLinks: {
          ...currentSettings.socialLinks,
          ...formData.socialLinks
        }
      };

      // 1. Save draft
      await cmsService.updateCMSData('site_settings', updatedPayload);
      // 2. Publish live so changes reflect everywhere immediately
      return await cmsService.publishCmsData('site_settings', 'Updated social media links via Admin CMS');
    },
    onSuccess: () => {
      toast.success('Social media links saved & published live across the website!');
      queryClient.invalidateQueries(['cms', 'site_settings']);
      queryClient.invalidateQueries(['cms', 'footer']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update social media links');
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const handleTestLink = (url) => {
    if (!url || url.trim() === '') {
      toast.info('Please enter a valid URL first to test.');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-12 text-center text-gray-500 flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-primary-600" />
        <p className="text-sm font-medium">Loading Social Media CMS Configuration...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-28">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-primary-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/20 text-amber-300 rounded-full text-xs font-bold uppercase tracking-wider border border-primary-400/30 mb-3">
            <Share2 className="w-3.5 h-3.5" />
            Social Media & Community Channels
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-outfit tracking-tight">
            Manage Social Media Links
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Configure official social network URLs, WhatsApp advisory channels, and community links displayed on the Footer, Contact, and Join Us pages.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-right">
            <p className="text-xs text-slate-400 font-medium">Live Website Sync</p>
            <p className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 justify-end">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real-time
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Social Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SOCIAL_PLATFORMS.map((platform) => {
            const Icon = platform.icon;
            const currentUrl = watchedLinks[platform.id] || '';
            const isConfigured = Boolean(currentUrl && currentUrl.trim() !== '');

            return (
              <div 
                key={platform.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${platform.bgColor} border ${platform.borderColor} flex items-center justify-center ${platform.color} shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">{platform.name}</h3>
                        <span className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                          isConfigured 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-gray-100 text-gray-500 border border-gray-200'
                        }`}>
                          {isConfigured ? 'Active & Linked' : 'Optional / Not Set'}
                        </span>
                      </div>
                    </div>

                    {isConfigured && (
                      <button
                        type="button"
                        onClick={() => handleTestLink(currentUrl)}
                        className="text-xs font-semibold text-primary-600 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                        title="Test link in new tab"
                      >
                        <span>Test</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                    {platform.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-gray-100">
                  <label className="text-xs font-semibold text-gray-700 flex items-center justify-between">
                    <span>Profile / Channel URL</span>
                  </label>
                  <Input
                    type="url"
                    {...register(platform.field)}
                    placeholder={platform.placeholder}
                    className="w-full text-xs font-mono"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Website Preview Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Eye className="w-5 h-5 text-primary-600" />
            <h3 className="text-base font-bold text-gray-900">Live Website Footer Preview</h3>
          </div>
          <p className="text-xs text-gray-500">
            This is how your updated social badges will render for visitors in the footer of every page:
          </p>

          <div className="bg-[#1b2a1c] p-6 rounded-2xl flex flex-wrap items-center gap-3">
            {SOCIAL_PLATFORMS.map((platform) => {
              const Icon = platform.icon;
              const linkUrl = watchedLinks[platform.id];
              if (!linkUrl || linkUrl.trim() === '') return null;

              return (
                <a
                  key={platform.id}
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-emerald-200 hover:bg-amber-500 hover:text-white hover:border-amber-400 transition-all duration-300 shadow-sm"
                  title={`${platform.name}: ${linkUrl}`}
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg md:pl-64 flex items-center justify-between z-20">
          <p className="hidden sm:block text-xs text-gray-500 font-medium">
            Changes will publish live to https://unlocktejas.com instantly upon saving.
          </p>
          <div className="flex items-center gap-3 ml-auto">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || mutation.isPending}
              className="min-w-[180px] font-bold shadow-md shadow-primary-600/20 flex items-center justify-center gap-2"
            >
              {mutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Publishing Live...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save & Publish Live</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
