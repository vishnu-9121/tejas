import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';

export function Hero() {
  const { data: cmsData } = useQuery({
    queryKey: ['cms', 'homepage'],
    queryFn: () => cmsService.getCmsData('homepage'),
    staleTime: 5 * 60 * 1000,
  });

  const heroData = cmsData?.data?.data?.hero || {
    title: 'Developing Leaders, Innovators & Entrepreneurs',
    subtitle: 'Tejas Academy of Excellence cultivates human potential, real-world skills, and character fortitude to accelerate your career and personal growth.',
    backgroundImage: '',
    primaryCta: { text: 'Apply for Admissions', link: '/admissions' },
    secondaryCta: { text: 'Explore Programs', link: '/programs' }
  };
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-primary-900 text-neutral-0 px-6 md:px-10 lg:px-20 overflow-hidden select-none">
      {/* Background Image / Pattern */}
      {heroData.backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
          style={{ backgroundImage: `url(${heroData.backgroundImage})` }}
        />
      )}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent-500 via-transparent to-transparent scale-150" />
      </div>

      <div className="max-w-[1200px] w-full mx-auto flex flex-col items-center text-center gap-6 md:gap-8 relative z-10">
        {/* Quality indicator */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-800 bg-primary-800/40 backdrop-blur-xs shadow-sm"
        >
          <Trophy className="w-4 h-4 text-accent-400" />
          <span className="text-xxs md:text-xs font-semibold uppercase tracking-widest text-primary-200">
            India's Premium Center for Excellence
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-semibold leading-tight max-w-4xl"
        >
          {heroData.title}
        </motion.h1>

        {/* Subhead */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-base sm:text-lg md:text-xl text-primary-100/90 leading-relaxed max-w-2xl"
        >
          {heroData.subtitle}
        </motion.p>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto"
        >
          {heroData.primaryCta?.text && (
            <Button
              size="lg"
              variant="gold"
              as={Link}
              to={heroData.primaryCta.link || '/admissions'}
              rightIcon={<ArrowRight />}
              className="w-full sm:w-auto font-semibold shadow-md hover:scale-105 transition-transform"
            >
              {heroData.primaryCta.text}
            </Button>
          )}
          {heroData.secondaryCta?.text && (
            <Button
              size="lg"
              variant="outline"
              as={Link}
              to={heroData.secondaryCta.link || '/programs'}
              className="w-full sm:w-auto text-neutral-0 border-neutral-0/30 hover:bg-primary-800 hover:border-neutral-0 font-semibold hover:scale-105 transition-transform"
            >
              {heroData.secondaryCta.text}
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
