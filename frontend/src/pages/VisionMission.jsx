import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useQuery } from '@tanstack/react-query';
import { sanityService } from '@/services/sanityService';
import { Target, Compass } from 'lucide-react';

export const VisionMission = () => {
  const { data: aboutData, isLoading } = useQuery({
    queryKey: ['sanity', 'aboutPage'],
    queryFn: () => sanityService.getAboutPage(),
    staleTime: 5 * 60 * 1000,
  });

  const visionText = aboutData?.leadershipMessage || 'To be a globally recognized institution that nurtures intellectual curiosity, fosters innovation, and empowers individuals to harmonize human excellence with technical mastery.';
  const missionText = aboutData?.description || 'Provide accessible, world-class education, encourage cutting-edge research, and cultivate an inclusive community of ethical future leaders.';

  const values = aboutData?.timeline || [
    { title: 'Academic Rigor', description: 'Uncompromising quality co-designed with corporate executives.' },
    { title: 'Ethical Integrity', description: 'Rooted in human values, responsibility, and moral leadership.' },
    { title: 'Global Innovation', description: 'Pioneering AI, research labs, and deep-tech incubators.' },
    { title: 'Inclusive Excellence', description: 'Empowering diverse talents from across the globe.' }
  ];

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 select-none">
      <SectionHeader 
        title="Vision & Mission" 
        description="The foundational philosophy and core institutional principles guiding Tejas Academy of Excellence." 
      />

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div></div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 mb-24 mt-12">
            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl shadow-amber-900/5 relative overflow-hidden group hover:border-amber-400/60 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-5 transform group-hover:scale-110 transition-transform duration-700">
                <Compass size={120} />
              </div>
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 text-amber-600 border border-amber-200">
                <Compass className="w-7 h-7" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-gray-600 text-lg leading-relaxed relative z-10">{visionText}</p>
            </div>
            
            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl shadow-emerald-900/5 relative overflow-hidden group hover:border-emerald-400/60 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-5 transform group-hover:scale-110 transition-transform duration-700">
                <Target size={120} />
              </div>
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 border border-emerald-200">
                <Target className="w-7 h-7" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed relative z-10">{missionText}</p>
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            <SectionHeader title="Core Values" description="The principles that guide our institutional culture" />
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((val, idx) => (
                <div key={idx} className="bg-gray-50 rounded-2xl p-6 border border-gray-200/80 text-center hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{val.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{val.description}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VisionMission;
