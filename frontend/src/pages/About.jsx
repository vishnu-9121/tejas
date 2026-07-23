import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';

export const About = () => {
  const { data: cmsData, isLoading } = useQuery({
    queryKey: ['cms', 'about'],
    queryFn: () => cmsService.getCmsData('about'),
  });

  const aboutContent = cmsData?.data?.data?.overview || {
    title: 'A Legacy of Excellence',
    description: 'Tejas Academy of Excellence was founded with a singular vision: to cultivate leaders who are academically brilliant and ethically grounded.',
    historyText: 'Over the decades, our institution has grown from a humble learning center to a sprawling campus that houses state-of-the-art facilities.',
    backgroundImage: ''
  };

  const timeline = cmsData?.data?.data?.timeline || [];

  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      {aboutContent.backgroundImage && (
        <div className="w-full h-[400px] mb-16 rounded-3xl overflow-hidden relative shadow-lg">
          <img src={aboutContent.backgroundImage} alt="About Campus" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent flex items-end p-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white font-serif">{aboutContent.title}</h1>
          </div>
        </div>
      )}
      
      {!aboutContent.backgroundImage && (
        <SectionHeader title={aboutContent.title} description={aboutContent.description} />
      )}

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
      ) : (
        <>
          <div className="mt-10 prose lg:prose-xl mx-auto text-gray-700 leading-relaxed text-center">
            {aboutContent.backgroundImage && (
              <p className="text-2xl font-serif text-gray-900 mb-8">{aboutContent.description}</p>
            )}
            <p>{aboutContent.historyText}</p>
          </div>

          {timeline.length > 0 && (
            <div className="mt-24 max-w-4xl mx-auto">
              <SectionHeader title="Our Journey" description="Milestones that define our legacy" />
              <div className="mt-12 space-y-8">
                {timeline.map((item, idx) => (
                  <div key={idx} className="flex gap-6 items-start bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-3xl font-bold text-primary-200 shrink-0">{item.year}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
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
