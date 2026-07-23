import React from "react";
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';

const fallbackPartners = [
  { name: "Google" },
  { name: "Microsoft" },
  { name: "TCS" },
  { name: "Mahindra Group" },
  { name: "Infosys" },
  { name: "Wipro" }
];

export function PartnerLogos() {
  const { data: cmsData } = useQuery({
    queryKey: ['cms', 'homepage'],
    queryFn: () => cmsService.getCmsData('homepage'),
    staleTime: 5 * 60 * 1000,
  });

  const partners = cmsData?.data?.data?.partners?.length > 0 
    ? cmsData.data.data.partners 
    : fallbackPartners;

  return (
    <section className="bg-neutral-0 py-12 border-b border-neutral-200 select-none">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20 flex flex-col items-center gap-6 md:gap-8">
        <span className="text-xxs font-bold uppercase tracking-widest text-neutral-500">
          Inspired from
        </span>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 w-full opacity-60">
          {partners.map((partner, idx) => (
            <div key={idx} className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
              {partner.logoUrl ? (
                <img src={partner.logoUrl} alt={partner.name} loading="lazy" className="h-10 object-contain" />
              ) : (
                <span className="text-lg md:text-xl font-bold text-neutral-400 hover:text-neutral-900 transition-colors duration-200">
                  {partner.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
