import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Trophy, ChevronLeft, ChevronRight, Sparkles, Clock, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { useQuery } from '@tanstack/react-query';
import { sanityService } from '@/services/sanityService';

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: slidesData } = useQuery({
    queryKey: ['sanity', 'hero-slides'],
    queryFn: () => sanityService.getHeroSlides(),
    staleTime: 5 * 60 * 1000,
  });

  const slides = slidesData && slidesData.length > 0 ? slidesData : [
    {
      _id: 'slide-1',
      title: 'Cultivating Human Excellence, Character & Competence',
      subtitle: '⚡ Born from the Spark of Brilliance',
      description: 'Developing visionary individuals who harmonize intellectual innovation, emotional resilience, ethical leadership, and purposeful societal value creation.',
      primaryCtaText: 'Explore Programs',
      primaryCtaLink: '/programs',
      secondaryCtaText: 'Apply for Admission',
      secondaryCtaLink: '/admissions',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1600'
    },
    {
      _id: 'slide-2',
      title: 'Practical Learning, Deep-Tech Mastery & Leadership',
      subtitle: 'Valour • Discipline • Vigilance • Resilience',
      description: 'Immerse in active case challenges, research simulations, and venture incubation guided by esteemed global faculty and industry leaders.',
      primaryCtaText: 'Discover Our Philosophy',
      primaryCtaLink: '/about/vision-mission',
      secondaryCtaText: 'Admissions 2026',
      secondaryCtaLink: '/admissions',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1600'
    }
  ];

  // Auto-slide transition every 6 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide] || slides[0];

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center bg-gradient-to-br from-[#0b140c] via-[#18281a] to-[#0d180e] text-white px-4 sm:px-6 lg:px-12 pt-20 pb-16 overflow-hidden select-none">
      
      {/* Decorative Brand Ambient Aura & Mesh Glows */}
      <div className="absolute -top-28 -right-28 w-[550px] h-[550px] bg-amber-500/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-28 -left-28 w-[650px] h-[650px] bg-[#274229]/50 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400/5 via-transparent to-transparent pointer-events-none" />

      {/* Background Image Carousel with Smooth Fade & Blend */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide._id || currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.25, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center mix-blend-soft-light"
          style={{ backgroundImage: `url(${slide.imageUrl ? (slide.imageUrl.includes('?') ? slide.imageUrl : `${slide.imageUrl}?auto=format&w=1600&q=80`) : 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1600'})` }}
        />
      </AnimatePresence>

      {/* Deep Olive Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b140c] via-[#18281a]/85 to-[#0d180e]/60 pointer-events-none" />

      {/* Main Grid Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Hero Slide Content */}
        <div className="lg:col-span-7 flex flex-col items-start text-left gap-6">
          
          {/* Glowing Tejas Emblem Logo Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-amber-400/60 bg-gradient-to-r from-[#122013]/90 via-[#1b2e1c]/90 to-[#122013]/90 backdrop-blur-xl shadow-2xl shadow-amber-500/20 ring-1 ring-amber-400/20"
          >
            <div className="w-7 h-7 rounded-full bg-white p-1 flex items-center justify-center shadow-lg ring-2 ring-amber-400/90 shrink-0">
              <img 
                src="/logo.png" 
                alt="Tejas Academy of Excellence Emblem" 
                width="28" 
                height="28" 
                loading="eager" 
                fetchPriority="high" 
                decoding="async" 
                className="w-full h-full object-contain" 
              />
            </div>
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400">
              Tejas Academy of Excellence
            </span>
          </motion.div>

          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-widest">
            <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{slide.subtitle || "India's Premier Center for Excellence"}</span>
          </div>

          {/* Slide Heading */}
          <AnimatePresence mode="wait">
            <motion.h1 
              key={slide._id + '-title'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold leading-[1.15] tracking-tight text-[#faf9f5]"
            >
              {slide.title}
            </motion.h1>
          </AnimatePresence>

          {/* Slide Description */}
          <AnimatePresence mode="wait">
            <motion.p 
              key={slide._id + '-desc'}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-xl font-normal"
            >
              {slide.description}
            </motion.p>
          </AnimatePresence>

          {/* Slide Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mt-2 w-full sm:w-auto">
            <Button
              size="lg"
              variant="gold"
              as={Link}
              to={slide.primaryCtaLink || '/admissions'}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="font-bold border border-amber-300/40 shadow-sm"
            >
              {slide.primaryCtaText || 'Apply for Admissions'}
            </Button>
            {slide.secondaryCtaText && (
              <Button
                size="lg"
                variant="outline"
                as={Link}
                to={slide.secondaryCtaLink || '/programs'}
                className="font-semibold border-amber-400/40 text-amber-300 hover:bg-[#1b321e]"
              >
                {slide.secondaryCtaText}
              </Button>
            )}
          </div>
        </div>

        {/* Right Column: Deep Olive & Gold Early Bird Admission Card */}
        <div className="lg:col-span-5 w-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-[#132214]/95 backdrop-blur-2xl text-white rounded-3xl p-6 sm:p-8 border border-amber-400/50 shadow-2xl shadow-amber-950/40 relative overflow-hidden ring-1 ring-amber-400/20"
          >
            {/* Top Promotion Ribbon */}
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-[11px] uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-current text-slate-950" /> Early Bird 2026-27
            </div>

            <div className="flex items-center gap-2 text-amber-300 font-extrabold text-xs uppercase tracking-widest mb-2">
              <Clock className="w-4 h-4 text-amber-400" /> Limited Seats Available
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold leading-tight mb-3 text-white">
              Admissions Open for Flagship Programs
            </h3>

            <p className="text-sm text-emerald-100/90 mb-6 leading-relaxed">
              Unlock up to <span className="font-bold text-amber-300">50% Merit Scholarship</span> for top qualifying entrance applicants.
            </p>

            {/* Campaign Perks Badges */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm font-semibold text-emerald-50">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Applied Industry Practice & Career Readiness</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-emerald-50">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Mentorship from Microsoft & Google Leaders</span>
              </div>
            </div>

            {/* Direct Flyer CTA */}
            <Button
              as={Link}
              to="/admissions"
              variant="gold"
              size="lg"
              fullWidth
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="text-base font-bold border border-amber-300/40 shadow-sm"
            >
              Start Admission Application
            </Button>
          </motion.div>
        </div>

      </div>

      {/* Manual Slider Navigation Controls */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          <button 
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="p-2 rounded-full bg-[#1b2e1c]/60 hover:bg-[#253f27] text-white backdrop-blur-md transition-colors border border-amber-400/30"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 text-amber-300" />
          </button>
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${idx === currentSlide ? 'w-8 bg-amber-400' : 'w-2 bg-white/30'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="p-2 rounded-full bg-[#1b2e1c]/60 hover:bg-[#253f27] text-white backdrop-blur-md transition-colors border border-amber-400/30"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      )}
    </section>
  );
}
