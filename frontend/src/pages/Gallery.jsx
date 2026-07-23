import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const Gallery = () => {
  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <SectionHeader title="Gallery" description="Glimpses of life at Tejas Academy of Excellence." />
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 mt-10 space-y-4">
        {[1,2,3,4,5,6,7,8,9].map(i => (
          <div key={i} className="break-inside-avoid">
            <img src={`https://via.placeholder.com/${400 + (i%3)*100}x${300 + (i%2)*150}`} alt={`Gallery ${i}`} className="w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
};
