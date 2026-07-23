import React from 'react';
import { Button } from '../../../components/ui/Button';
import { motion } from 'framer-motion';

export default function HeroBlock({ data }) {
  const { title, subtitle, primaryCta, secondaryCta, backgroundImage } = data;

  return (
    <div className="relative bg-[#001524] text-white overflow-hidden py-32 lg:py-48 mt-[-100px]">
      {/* Dynamic Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img src={backgroundImage} alt="Hero Background" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001524] to-transparent"></div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight font-outfit mb-6">
            {title || 'Welcome to Tejas Academy'}
          </h1>
          <p className="text-xl text-gray-300 font-inter mb-10 max-w-2xl leading-relaxed">
            {subtitle || 'Empowering the next generation of leaders.'}
          </p>
          <div className="flex flex-wrap gap-4">
            {primaryCta && (
              <Button variant="primary" size="lg" className="rounded-full px-8 py-4 shadow-lg shadow-primary-500/30">
                {primaryCta.label}
              </Button>
            )}
            {secondaryCta && (
              <Button variant="outline-white" size="lg" className="rounded-full px-8 py-4">
                {secondaryCta.label}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
