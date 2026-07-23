import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';
import { Target, Compass } from 'lucide-react';

export const VisionMission = () => {
  const { data: cmsData, isLoading } = useQuery({
    queryKey: ['cms', 'about'],
    queryFn: () => cmsService.getCmsData('about'),
  });

  const missionVision = cmsData?.data?.data?.missionVision || {
    mission: 'Provide accessible, world-class education. Encourage cutting-edge research and innovation. Cultivate an inclusive community of diverse talents.',
    vision: 'To be a globally recognized institution that nurtures intellectual curiosity, fosters innovation, and empowers individuals to make a meaningful impact on society.'
  };

  const values = cmsData?.data?.data?.values || [];

  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      {isLoading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 mb-24">
            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl shadow-primary-900/5 relative overflow-hidden group hover:border-primary-200 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-5 transform group-hover:scale-110 transition-transform duration-700">
                <Compass size={120} />
              </div>
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-6">
                <Compass className="w-7 h-7 text-primary-600" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-gray-600 text-lg leading-relaxed relative z-10">{missionVision.vision}</p>
            </div>
            
            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl shadow-accent-900/5 relative overflow-hidden group hover:border-accent-200 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-5 transform group-hover:scale-110 transition-transform duration-700">
                <Target size={120} />
              </div>
              <div className="w-14 h-14 bg-accent-50 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-accent-600" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed relative z-10">{missionVision.mission}</p>
            </div>
          </div>

          {values.length > 0 && (
            <div className="max-w-5xl mx-auto">
              <SectionHeader title="Core Values" description="The principles that guide our institutional culture" />
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((val, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{val.title}</h3>
                    <p className="text-sm text-gray-600">{val.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
