import React from 'react';
import { Quote } from 'lucide-react';

export const TestimonialCard = React.memo(({ name, role, company, content, image }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative h-full flex flex-col">
      <Quote className="absolute top-6 right-6 w-10 h-10 text-gray-100" />
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <img 
          src={image ? (image.includes('?') ? image : `${image}?auto=format&w=120&h=120&fit=crop&q=80`) : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&w=120&h=120&fit=crop&q=80'} 
          alt={`${name} - Student & Alumni Testimonial | Tejas Academy`} 
          width="56"
          height="56"
          loading="lazy" 
          decoding="async"
          className="w-14 h-14 rounded-full object-cover shrink-0" 
        />
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
