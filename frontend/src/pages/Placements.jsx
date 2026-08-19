import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useQuery } from '@tanstack/react-query';
import { sanityService } from '@/services/sanityService';
import { SEO } from '@/components/ui/SEO';

export const Placements = () => {
  const { data: homepageData } = useQuery({
    queryKey: ['sanity', 'homepage'],
    queryFn: () => sanityService.getHomepage(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: collabs } = useQuery({
    queryKey: ['sanity', 'collaborations'],
    queryFn: () => sanityService.getCollaborations(),
    staleTime: 5 * 60 * 1000,
  });

  const stats = homepageData?.impactMetrics || [
    { value: "98%", label: "Career Readiness Rate" },
    { value: "₹18.5 LPA", label: "Average Starting Potential" },
    { value: "500+", label: "Industry Network & Corporate Alliances" }
  ];

  const partners = collabs && collabs.length > 0 ? collabs : [
    { name: 'Microsoft' }, { name: 'Amazon Web Services' }, { name: 'Google Cloud' }, { name: 'NASSCOM' }
  ];

  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <SEO 
        title="Career Pathways & Industry Alliances" 
        description="Explore corporate partnerships, industry mentorship networks, and career development outcomes for Tejas Academy scholars."
        url="https://unlocktejas.com/placements"
      />
      <SectionHeader 
        title="Career Pathways & Industry Alliances" 
        description="Our scholars shape global organizations through rigorous practice, ethical leadership, and high-impact competence." 
      />

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-16">
        {stats.map((st, idx) => (
          <div key={idx} className="p-8 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-3xl shadow-sm">
            <div className="text-4xl font-bold text-amber-500 mb-2">{st.value}</div>
            <div className="text-gray-700 font-semibold text-sm">{st.label}</div>
          </div>
        ))}
      </div>

      <h3 className="text-2xl font-bold font-serif text-center mb-8 text-gray-900">Corporate Industry Partners & Alliances</h3>
      <div className="flex flex-wrap justify-center items-center gap-8 opacity-85">
        {partners.map((partner, idx) => (
          <div key={partner._id || idx} className="px-6 py-3 rounded-2xl bg-gray-50 border border-gray-200/80 font-bold text-gray-800 text-sm shadow-xs flex items-center gap-3">
            {partner.logoUrl && (
              <img 
                src={partner.logoUrl.includes('?') ? partner.logoUrl : `${partner.logoUrl}?auto=format&w=120&q=80`} 
                alt={`${partner.name} - Industry Corporate Partner | Tejas Academy Career Alliances`} 
                height="28"
                width="56"
                loading="lazy"
                decoding="async"
                className="h-7 w-auto object-contain" 
              />
            )}
            <span>{partner.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Placements;
