import React from "react";
import { motion } from "framer-motion";
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';

const fallbackStats = [
  { value: "100%", label: "Placement Success" },
  { value: "4.9/5", label: "Student Satisfaction" },
  { value: "50+", label: "Industry Mentors" },
  { value: "12,000+", label: "Global Alumni Network" },
];

export function Stats() {
  const { data: cmsData } = useQuery({
    queryKey: ['cms', 'homepage'],
    queryFn: () => cmsService.getCmsData('homepage'),
    staleTime: 5 * 60 * 1000,
  });

  const stats = cmsData?.data?.data?.stats?.length > 0 ? cmsData.data.data.stats : fallbackStats;

  return (
    <section className="bg-neutral-0 border-b border-neutral-100 py-10 md:py-16 select-none">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
            className="flex flex-col items-center text-center gap-1.5 md:gap-2"
          >
            <span className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-primary-700 tracking-tight leading-none">
              {stat.value}
            </span>
            <span className="text-xxs md:text-xs font-semibold uppercase tracking-widest text-neutral-500">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
