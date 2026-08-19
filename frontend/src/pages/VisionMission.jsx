import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';
import { sanityService } from '@/services/sanityService';
import { Target, Compass } from 'lucide-react';
import { SEO } from '@/components/ui/SEO';

const fallbackVirtues = [
  { title: 'Integrity', name: 'Integrity', description: 'Unyielding commitment to truth, authenticity, transparent accountability, and moral conviction.' },
  { title: 'Discipline', name: 'Discipline', description: 'Cultivating daily habits of rigor, mental fortitude, focus, and unwavering execution excellence.' },
  { title: 'Courage', name: 'Courage', description: 'Embracing intellectual risk, speaking truth with conviction, and standing up for ethical principles.' },
  { title: 'Curiosity', name: 'Curiosity', description: 'Fostering deep inquiry, relentless exploration, critical questioning, and lifelong learning.' },
  { title: 'Service', name: 'Service', description: 'Practicing servant leadership, humility, societal upliftment, and active nation building.' },
  { title: 'Excellence', name: 'Excellence', description: 'Pursuing mastery across all five dimensions through continuous feedback, iteration, and high standards.' }
];

export const VisionMission = () => {
  const { data: cmsResponse } = useQuery({
    queryKey: ['cms', 'vision-mission'],
    queryFn: async () => {
      const res = await cmsService.getCmsData('vision-mission');
      if (res?.data?.publishedData || res?.data?.data) return res;
      return await cmsService.getCmsData('vision_mission');
    },
    staleTime: 60 * 1000,
  });

  const { data: aboutData, isLoading } = useQuery({
    queryKey: ['sanity', 'aboutPage'],
    queryFn: () => sanityService.getAboutPage(),
    staleTime: 5 * 60 * 1000,
  });

  const cmsData = cmsResponse?.data?.publishedData || cmsResponse?.data?.data || cmsResponse?.data;

  const pageTitle = cmsData?.title || "Vision & Mission";
  const pageSubtitle = cmsData?.subtitle || "The foundational philosophy and core institutional principles guiding Tejas Academy of Excellence.";

  const visionText = cmsData?.vision || aboutData?.leadershipMessage || 'To develop visionary individuals who embody intellectual innovation, emotional balance, ethical responsibility, courageous leadership, and meaningful contribution to the nation and the global society.';
  const missionText = cmsData?.mission || aboutData?.description || 'To advance human excellence through transformative education, applied research, responsible entrepreneurship, human-centered technology, and principled leadership development that creates enduring societal value.';

  const virtuesList = (cmsData?.virtues && cmsData.virtues.length > 0)
    ? cmsData.virtues.map(v => ({ title: v.name || v.title, description: v.description }))
    : (aboutData?.coreValues && aboutData.coreValues.length >= 6 ? aboutData.coreValues : fallbackVirtues);

  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <SEO 
        title="Vision & Mission" 
        description="The foundational philosophy, core institutional values, and academic mission of Tejas Academy of Excellence."
        url="https://unlocktejas.com/about/vision-mission"
      />
      <SectionHeader 
        title={pageTitle} 
        description={pageSubtitle} 
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
            <SectionHeader title="Core Values" description="Foundational virtues defining every scholar, faculty member, and leader at Tejas" />
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {virtuesList.map((val, idx) => (
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
