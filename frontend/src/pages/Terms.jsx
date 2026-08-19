import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';
import { SEO } from '@/components/ui/SEO';

export const Terms = () => {
  const { data: cmsData, isLoading } = useQuery({
    queryKey: ['cms', 'terms'],
    queryFn: () => cmsService.getCmsData('terms'),
  });

  const termsContent = cmsData?.data?.data?.content || `
<h3>1. Acceptance of Terms</h3>
<p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
<h3>2. Provision of Services</h3>
<p>You agree and acknowledge that we are entitled to modify, improve or discontinue any of our services at our sole discretion.</p>
  `;
  
  const lastUpdated = cmsData?.data?.data?.lastUpdated || 'July 2026';

  return (
    <div className="py-20 max-w-4xl mx-auto px-4">
      <SEO 
        title="Terms of Service" 
        description="Official Terms of Service, academic enrollment conditions, and user agreement of Tejas Academy of Excellence."
        url="https://unlocktejas.com/terms"
      />
      <SectionHeader title="Terms of Service" align="left" />
      {isLoading ? (
        <div className="flex justify-start py-10 w-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-500 italic mb-8">Last updated: {lastUpdated}</p>
          <div dangerouslySetInnerHTML={{ __html: termsContent }} />
        </div>
      )}
    </div>
  );
};
