import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';
import { Target, Compass } from 'lucide-react';

export function MissionVision() {
  const { data: cmsData } = useQuery({
    queryKey: ['cms', 'homepage'],
    queryFn: () => cmsService.getCmsData('homepage'),
    staleTime: 5 * 60 * 1000,
  });

  const mission = cmsData?.data?.data?.missionPreview || {
    title: 'Our Mission',
    content: 'To advance human excellence through transformative education, applied research, responsible entrepreneurship, ethical technology, and principled leadership development that creates enduring societal value.'
  };

  const vision = cmsData?.data?.data?.visionPreview || {
    title: 'Our Vision',
    content: 'To develop visionary individuals who embody intellectual innovation, emotional balance, ethical responsibility, courageous leadership, and meaningful contribution to the nation and the world.'
  };

  return (
    <section className="bg-warm-50 py-16 md:py-24 border-b border-neutral-100">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20 flex flex-col items-center text-center">
        <div className="h-0.5 w-12 bg-accent-500 mb-4" />
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-700 mb-2 select-none">
          Institutional Purpose
        </span>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 mb-2 tracking-tight">
          "Born from the Spark of Brilliance"
        </h2>
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-amber-700 mb-12 select-none">
          Valour in Heart &bull; Discipline in Habit &bull; Vigilance in Mind &bull; Resilience in Spirit
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start w-full text-left">
          {/* Mission */}
          <div className="flex gap-4 md:gap-6 group">
            <div className="shrink-0 mt-1">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 group-hover:bg-accent-500 group-hover:text-white transition-colors">
                <Target className="w-5 h-5 md:w-6 md:h-6" />
              </div>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-neutral-900 mb-2 md:mb-3">{mission.title}</h3>
              <p className="text-sm md:text-base text-neutral-600 leading-relaxed max-w-lg">
                {mission.content}
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="flex gap-4 md:gap-6 group">
            <div className="shrink-0 mt-1">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 group-hover:bg-primary-700 group-hover:text-white transition-colors">
                <Compass className="w-5 h-5 md:w-6 md:h-6" />
              </div>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-neutral-900 mb-2 md:mb-3">{vision.title}</h3>
              <p className="text-sm md:text-base text-neutral-600 leading-relaxed max-w-lg">
                {vision.content}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
