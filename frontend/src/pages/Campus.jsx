import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';

const DEFAULT_FACILITIES = [
  { image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=400&fit=crop', title: 'Main Library' },
  { image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop', title: 'Innovation Labs' },
  { image: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=600&h=400&fit=crop', title: 'Sports Complex' }
];

export const Campus = () => {
  const { data: cmsData, isLoading } = useQuery({
    queryKey: ['cms', 'campus'],
    queryFn: () => cmsService.getCmsData('campus'),
  });

  const campusData = cmsData?.data?.data || {
    title: 'Our Campus',
    description: 'Take a virtual tour of our modern facilities designed for collaborative learning.',
    facilities: DEFAULT_FACILITIES
  };

  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
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
                  src={facility.image || `https://via.placeholder.com/600x400?text=Facility+${i+1}`} 
                  alt={facility.title || `Campus ${i+1}`} 
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
