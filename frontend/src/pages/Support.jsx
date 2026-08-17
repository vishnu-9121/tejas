import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Accordion } from '@/components/ui/Accordion';

export const Support = () => {
  const faqs = [
    { title: 'How do I reset my portal password?', content: 'You can reset it using the "Forgot Password" link on the login page.' },
    { title: 'Where can I find the academic calendar?', content: 'The academic calendar is available under the Resources section.' },
    { title: 'Who do I contact for support and assistance?', content: 'Email support@unlocktejas.com or reach out directly on WhatsApp / Phone at +91 83310 51327.' }
  ];

  return (
    <div className="py-20 max-w-3xl mx-auto px-4">
      <SectionHeader title="Support & FAQ" description="Find answers to common questions." />
      <div className="mt-10">
        <Accordion items={faqs} />
      </div>
    </div>
  );
};
