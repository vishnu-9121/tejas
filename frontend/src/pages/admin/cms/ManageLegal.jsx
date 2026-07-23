import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Shield } from 'lucide-react';
import { toast } from 'sonner';

import { cmsService } from '@/services/cmsService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

const defaultPrivacyData = {
  lastUpdated: 'July 2026',
  content: '<h3>1. Information We Collect</h3><p>We collect information you provide directly to us...</p>'
};

const defaultTermsData = {
  lastUpdated: 'July 2026',
  content: '<h3>1. Acceptance of Terms</h3><p>By accessing and using this website, you accept and agree to be bound by the terms...</p>'
};

export default function ManageLegal() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('privacy');

  // Fetch Privacy Data
  const { data: privacyData, isLoading: isLoadingPrivacy } = useQuery({
    queryKey: ['cms', 'privacy'],
    queryFn: () => cmsService.getCmsData('privacy'),
    retry: 1,
  });

  // Fetch Terms Data
  const { data: termsData, isLoading: isLoadingTerms } = useQuery({
    queryKey: ['cms', 'terms'],
    queryFn: () => cmsService.getCmsData('terms'),
    retry: 1,
  });

  const { register: registerPrivacy, handleSubmit: handlePrivacySubmit, reset: resetPrivacy, formState: { isSubmitting: isSubmittingPrivacy } } = useForm({
    defaultValues: defaultPrivacyData
  });

  const { register: registerTerms, handleSubmit: handleTermsSubmit, reset: resetTerms, formState: { isSubmitting: isSubmittingTerms } } = useForm({
    defaultValues: defaultTermsData
  });

  useEffect(() => {
    if (privacyData?.data?.data) resetPrivacy(privacyData.data.data);
    else resetPrivacy(defaultPrivacyData);
  }, [privacyData, resetPrivacy]);

  useEffect(() => {
    if (termsData?.data?.data) resetTerms(termsData.data.data);
    else resetTerms(defaultTermsData);
  }, [termsData, resetTerms]);

  const mutation = useMutation({
    mutationFn: ({ key, data }) => cmsService.updateCmsData(key, data),
    onSuccess: (_, variables) => {
      toast.success(`${variables.key === 'privacy' ? 'Privacy Policy' : 'Terms of Service'} updated successfully`);
      queryClient.invalidateQueries(['cms', variables.key]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update content');
    }
  });

  const onPrivacySubmit = (data) => mutation.mutate({ key: 'privacy', data });
  const onTermsSubmit = (data) => mutation.mutate({ key: 'terms', data });

  if (isLoadingPrivacy || isLoadingTerms) return <div className="p-12 text-center text-gray-500">Loading CMS data...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary-600" />
            Legal Pages CMS
          </h1>
          <p className="text-sm text-gray-500">Manage Privacy Policy and Terms of Service content.</p>
        </div>
      </div>

      <div className="flex gap-6 items-start flex-col md:flex-row">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0 space-y-1 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'privacy' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'terms' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Terms of Service
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full">
          {activeTab === 'privacy' && (
            <form onSubmit={handlePrivacySubmit(onPrivacySubmit)} className="space-y-6 animate-in fade-in">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Privacy Policy Settings</h2>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Last Updated Date String</label>
                    <Input {...registerPrivacy('lastUpdated')} required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">HTML Content</label>
                    <Textarea {...registerPrivacy('content')} rows={15} required className="font-mono text-sm" />
                    <p className="text-xs text-gray-500 mt-1">Use standard HTML tags like &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt; for formatting.</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" variant="primary" disabled={isSubmittingPrivacy || mutation.isPending}>
                  {(isSubmittingPrivacy || mutation.isPending) ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Publish Privacy Policy</>}
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'terms' && (
            <form onSubmit={handleTermsSubmit(onTermsSubmit)} className="space-y-6 animate-in fade-in">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Terms of Service Settings</h2>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Last Updated Date String</label>
                    <Input {...registerTerms('lastUpdated')} required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">HTML Content</label>
                    <Textarea {...registerTerms('content')} rows={15} required className="font-mono text-sm" />
                    <p className="text-xs text-gray-500 mt-1">Use standard HTML tags like &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt; for formatting.</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" variant="primary" disabled={isSubmittingTerms || mutation.isPending}>
                  {(isSubmittingTerms || mutation.isPending) ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Publish Terms of Service</>}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
