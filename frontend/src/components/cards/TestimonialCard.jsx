import React from 'react';
import { Quote } from 'lucide-react';

export const TestimonialCard = React.memo(({ name, role, company, content, image }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative h-full flex flex-col">
      <Quote className="absolute top-6 right-6 w-10 h-10 text-gray-100" />
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <img src={image || 'https://via.placeholder.com/100'} alt={name} loading="lazy" className="w-14 h-14 rounded-full object-cover" />
        <div>
          <h4 className="font-bold text-gray-900">{name}</h4>
          <p className="text-sm text-gray-500">{role}{company ? `, ${company}` : ''}</p>
        </div>
      </div>
      <p className="text-gray-600 italic flex-grow relative z-10">"{content}"</p>
    </div>
  );
});
TestimonialCard.displayName = 'TestimonialCard';
