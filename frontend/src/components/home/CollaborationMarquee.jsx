import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { sanityService } from '@/services/sanityService';

export function CollaborationMarquee() {
  const [isPaused, setIsPaused] = useState(false);

  const { data: partnersData } = useQuery({
    queryKey: ['sanity', 'collaborations'],
    queryFn: () => sanityService.getCollaborations(),
    staleTime: 5 * 60 * 1000,
  });

  const partners = partnersData && partnersData.length > 0 ? partnersData : [
    { _id: '1', name: 'Microsoft for Startups', category: 'Technology Partner' },
    { _id: '2', name: 'AWS Educate', category: 'Cloud Alliance' },
    { _id: '3', name: 'Google Cloud Academic', category: 'AI Partner' },
    { _id: '4', name: 'National Skill Dev Corp', category: 'Government MoU' },
    { _id: '5', name: 'NASSCOM FutureSkills', category: 'Skill Partner' },
    { _id: '6', name: 'Oracle Academy', category: 'Database Partner' }
  ];

  // Duplicate for seamless infinite marquee loop
  const marqueeList = [...partners, ...partners];

  return (
    <section className="py-12 bg-gray-900 border-t border-b border-gray-800 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 mb-6 text-center">
        <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-amber-400">
          Industry Collaborations, MoUs & Academic Partners
        </h3>
      </div>

      <div 
        className="flex overflow-hidden relative w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left & Right Fade Shadows */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none" />

        <div 
          className={`flex gap-8 sm:gap-12 items-center shrink-0 ${isPaused ? '' : 'animate-marquee'}`}
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
        >
          {marqueeList.map((partner, index) => (
            <div 
              key={partner._id + '-' + index}
              className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-gray-800/80 border border-gray-700/80 backdrop-blur-md shrink-0 hover:border-amber-400/60 transition-colors"
            >
              {partner.logoUrl ? (
                <img src={partner.logoUrl} alt={partner.name} className="h-10 sm:h-12 w-auto object-contain shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-sm shrink-0">
                  {partner.name.charAt(0)}
                </div>
              )}
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-gray-100 whitespace-nowrap">{partner.name}</span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{partner.category || 'Strategic Partner'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
