import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { ArrowRight, BookOpen, Clock, Layers, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { sanityService } from '@/services/sanityService';
import { SEO } from '@/components/ui/SEO';

export default function FreePrograms() {
  const { data: programsData, isLoading } = useQuery({
    queryKey: ['sanity', 'free-programs'],
    queryFn: () => sanityService.getFreePrograms(),
    staleTime: 5 * 60 * 1000,
  });

  const programs = programsData && programsData.length > 0 ? programsData : [
    {
      _id: 'fp-1',
      title: 'Foundations of Generative AI & Prompt Engineering',
      category: 'AI & Data',
      duration: '3 Hours',
      shortDescription: 'Learn to leverage Large Language Models, prompt patterns, and AI tools for engineering productivity.',
      modulesCount: 4,
      enrollLink: '/admissions'
    },
    {
      _id: 'fp-2',
      title: 'Executive Leadership & Strategic Decision Making',
      category: 'Leadership',
      duration: '5 Hours',
      shortDescription: 'Frameworks for executive decision making, negotiation, and high-performance team culture.',
      modulesCount: 6,
      enrollLink: '/admissions'
    },
    {
      _id: 'fp-3',
      title: 'Full-Stack Web Architecture Bootcamp',
      category: 'Software Tech',
      duration: '4 Hours',
      shortDescription: 'Build scalable modern web applications using React, Node.js, and cloud data APIs.',
      modulesCount: 5,
      enrollLink: '/admissions'
    }
  ];

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
      <SEO 
        title="Free Learning Programs & Open Resources" 
        description="Access complimentary masterclasses, open modules, and skill certifications curated by Tejas Academy faculty." 
        canonical="https://unlocktejas.com/free-programs"
      />
      <SectionHeader 
        title="Free Learning Programs & Open Resources" 
        description="Access complimentary masterclasses, open modules, and skill certifications curated by Tejas Academy faculty." 
      />

      {/* Grid of Free Programs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {programs.map((prog) => (
          <div 
            key={prog._id} 
            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 fill-current" /> Free Course
                </span>
                <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {prog.duration || 'Self-Paced'}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors mb-2">
                {prog.title}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {prog.shortDescription}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                <Layers className="w-4 h-4 text-amber-500" /> {prog.modulesCount || 4} Modules
              </span>

              <Button 
                as={Link} 
                to={prog.enrollLink || '/admissions'} 
                variant="primary" 
                size="sm"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="font-bold text-xs shadow-md shadow-amber-500/20"
              >
                Access Free
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
