import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';
import { SEO } from '@/components/ui/SEO';

export const Privacy = () => {
  const { data: cmsData, isLoading } = useQuery({
    queryKey: ['cms', 'privacy'],
    queryFn: () => cmsService.getCmsData('privacy'),
  });

  const privacyContent = cmsData?.data?.data?.content || `
<h3>1. Information We Collect</h3>
<p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us.</p>
<h3>2. Use of Information</h3>
<p>We may use the information we collect about you to provide, maintain, and improve our services.</p>
  `;
  
  const lastUpdated = cmsData?.data?.data?.lastUpdated || 'July 2026';

  return (
    <div className="py-20 max-w-4xl mx-auto px-4">
      <SEO 
        title="Privacy Policy" 
        description="Official Privacy Policy and student data governance principles of Tejas Academy of Excellence."
        url="https://unlocktejas.com/privacy"
      />
      <SectionHeader title="Privacy Policy" align="left" />
      {isLoading ? (
        <div className="flex justify-start py-10 w-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-500 italic mb-8">Last updated: {lastUpdated}</p>
          <div dangerouslySetInnerHTML={{ __html: privacyContent }} />
        </div>
      )}
    </div>
  );
};
