import React from "react";
import { motion } from "framer-motion";
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';

const fallbackStats = [
  { value: "7+", label: "Active Programmes" },
  { value: "250+", label: "Corporate Partners" },
  { value: "150+", label: "Distinguished Mentors" },
  { value: "70%", label: "Practical Work Ratio" },
];

export function Stats() {
  const { data: cmsData } = useQuery({
    queryKey: ['cms', 'homepage'],
    queryFn: () => cmsService.getCmsData('homepage'),
    staleTime: 60 * 1000,
  });

  const rawStats = cmsData?.data?.data?.stats || cmsData?.data?.publishedData?.stats || cmsData?.data?.stats;
  const stats = (Array.isArray(rawStats) && rawStats.length > 0)
    ? rawStats.filter(s => s.enabled !== false && s.value && s.label)
    : fallbackStats;

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

export default Stats;
