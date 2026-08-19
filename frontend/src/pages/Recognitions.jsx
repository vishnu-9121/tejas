import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Trophy, Award, Medal, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';
import { sanityService } from '@/services/sanityService';
import { SEO } from '@/components/ui/SEO';

const fallbackRecognitions = [
  {
    _id: 'rec-1',
    id: 'rec-1',
    title: 'Excellence in AI Curriculum & Pedagogy',
    issuingBody: 'National EdTech Council',
    year: '2025',
    description: 'Honored for pioneering hands-on GPU labs and industry-integrated artificial intelligence syllabi.'
  },
  {
    _id: 'rec-2',
    id: 'rec-2',
    title: 'Top 10 Higher Education Centers in Telangana',
    issuingBody: 'Higher Education Review India',
    year: '2025',
    description: 'Awarded for exceptional graduate career readiness and modern campus infrastructure.'
  },
  {
    _id: 'rec-3',
    id: 'rec-3',
    title: 'National Skill Development Charter',
    issuingBody: 'NSDC Certified Training Partner',
    year: '2024',
    description: 'Certified institutional training partner advancing youth digital skilling and technical competence.'
  }
];

export default function Recognitions() {
  const { data: cmsResponse } = useQuery({
    queryKey: ['cms', 'recognitions'],
    queryFn: () => cmsService.getCmsData('recognitions'),
    staleTime: 60 * 1000,
  });

  const { data: sanityData } = useQuery({
    queryKey: ['sanity', 'recognitions'],
    queryFn: () => sanityService.getRecognitions(),
    staleTime: 5 * 60 * 1000,
  });

  const cmsData = cmsResponse?.data?.publishedData || cmsResponse?.data?.data || cmsResponse?.data;
  const pageTitle = cmsData?.title || "Institutional Accreditations & Recognitions";
  const pageSubtitle = cmsData?.subtitle || "Demonstrating pedagogical integrity, academic excellence, and national industry alignment.";

  const recognitions = (cmsData?.items && cmsData.items.length > 0)
    ? cmsData.items
    : (sanityData && sanityData.length > 0 ? sanityData : fallbackRecognitions);

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Recognitions, Awards & Academic Credibility" 
        description="Tejas Academy of Excellence is recognized by leading national accreditation bodies, academic councils, and government skill initiatives." 
        url="https://unlocktejas.com/recognitions"
      />
      <SectionHeader 
        title={pageTitle} 
        description={pageSubtitle} 
      />

      {/* Grid of Recognitions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {recognitions.map((item) => (
          <div 
            key={item._id} 
            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center justify-center mb-6 shadow-sm p-2 shrink-0">
                {item.logoUrl ? (
                  <img 
                    src={item.logoUrl.includes('?') ? item.logoUrl : `${item.logoUrl}?auto=format&w=160&q=80`} 
                    alt={`${item.title} - Tejas Academy Accreditation & Recognition Award`} 
                    width="64"
                    height="64"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain" 
                  />
                ) : (
                  <Trophy className="w-8 h-8 text-amber-500" />
                )}
              </div>

              <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-300 font-bold text-xs uppercase tracking-wider inline-block mb-3">
                {item.year || '2025'} Award
              </span>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                {item.title}
              </h3>

              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                {item.issuingBody}
              </p>

              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 mt-6 flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" /> Verified Credentials
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
