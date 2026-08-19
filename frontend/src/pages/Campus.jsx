import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';
import { SEO } from '@/components/ui/SEO';

const DEFAULT_FACILITIES = [
  { image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=400&fit=crop', title: 'Main Knowledge Center & Digital Library', description: 'Curated repository of academic journals, research whitepapers, and quiet study pods.' },
  { image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop', title: 'AI & Deep-Tech Innovation Labs', description: 'Equipped with high-performance computing clusters and robotic simulation kits.' },
  { image: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=600&h=400&fit=crop', title: 'Executive Seminar Amphitheatre', description: 'Acoustically tuned for corporate masterclasses, keynote speeches, and student debates.' }
];

export const Campus = () => {
  const { data: cmsData, isLoading } = useQuery({
    queryKey: ['cms', 'campus'],
    queryFn: () => cmsService.getCmsData('campus'),
  });

  const campusData = cmsData?.data?.data || {
    title: 'Our Campus Infrastructure',
    description: 'Explore the modern academic facilities and tech labs designed for holistic capability development in Gannavaram.',
    facilities: DEFAULT_FACILITIES
  };

  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <SEO 
        title="Campus Facilities & Learning Infrastructure" 
        description="Take a virtual tour of Tejas Academy campus in Gannavaram, featuring advanced computing labs, auditoriums, and collaborative study spaces."
        url="https://unlocktejas.com/about/campus"
      />
      <SectionHeader title={campusData.title} description={campusData.description} />
      
      {isLoading ? (
        <div className="flex justify-center py-20 w-full">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {campusData.facilities?.map((facility, i) => (
            <div key={i} className="group rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 hover:shadow-xl transition-all">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={(facility.image || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f').includes('?') ? facility.image : `${facility.image}?auto=format&w=800&q=80`} 
                  alt={`${facility.title || 'Campus Facility'} - Tejas Academy Gannavaram Campus Infrastructure`} 
                  width="600"
                  height="338"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-lg">{facility.title}</h3>
                {facility.description && <p className="text-gray-500 text-sm mt-2">{facility.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
