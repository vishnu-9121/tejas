import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ContactForm } from '@/components/forms/ContactForm';

export const Contact = () => {
  return (
    <div className="py-20 max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-start">
      <div>
        <SectionHeader title="Get in Touch" align="left" description="Have questions? We'd love to hear from you." />
        <div className="mt-8 aspect-square md:aspect-video bg-gray-200 rounded-xl overflow-hidden">
          <iframe width="100%" height="100%" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=1%20Grafton%20Street,%20Dublin,%20Ireland+(Tejas%20Academy)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"></iframe>
        </div>
      </div>
      <div className="bg-gray-50 p-6 rounded-2xl">
        <ContactForm />
      </div>
    </div>
  );
};
