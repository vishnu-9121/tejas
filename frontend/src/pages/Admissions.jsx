import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AdmissionsForm } from '@/components/forms/AdmissionsForm';
import { SEO } from '@/components/ui/SEO';

export const Admissions = () => {
  return (
    <div className="py-16 md:py-24 bg-gray-50 min-h-screen">
      <SEO 
        title="Admissions Application"
        description="Apply for professional, certificate, and executive programs at Tejas Academy of Excellence. Submit your online application."
        url="https://unlocktejas.com/admissions"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <SectionHeader 
          title="Admissions Application" 
          description="Submit your online application for our certificate, professional, and executive capability-development programmes." 
        />

        <div className="mt-10 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 md:p-10">
          <AdmissionsForm />
        </div>
      </div>
    </div>
  );
};

export default Admissions;
