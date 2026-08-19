import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Milestone, Target } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { sanityService } from '@/services/sanityService';

const fallbackHighlights = [
  {
    title: "Experiential Implementation",
    description: "Learn by implementing. Acquire skills via live case challenges, simulations, and startup clinics.",
  },
  {
    title: "1-on-1 Executive Mentorship",
    description: "Get weekly coaching slots from leaders working at premium global corporations.",
  },
  {
    title: "Continuous Mastery & Reflection",
    description: "Develop real-world capability through practice, mentorship, reflection, and continuous mastery.",
  },
  {
    title: "Human Excellence & Ethics",
    description: "Ground yourself in human excellence values that define respected long-term leaders.",
  },
];

const iconsMap = [<BookOpen key="1" />, <Users key="2" />, <Milestone key="3" />, <Target key="4" />];

export function WhyTejas() {
  const { data: homepageData } = useQuery({
    queryKey: ['sanity', 'homepage'],
    queryFn: () => sanityService.getHomepage(),
    staleTime: 5 * 60 * 1000,
  });

  const highlights = homepageData?.whyChooseUs && homepageData.whyChooseUs.length > 0 
    ? homepageData.whyChooseUs 
    : fallbackHighlights;

  return (
    <section className="bg-neutral-50 py-16 md:py-24 border-b border-neutral-100">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20 flex flex-col items-center">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: 48 }}
          viewport={{ once: true }}
          className="h-0.5 bg-amber-500 mb-4" 
        />
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-2 select-none"
        >
          Institutional Paradigm
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-semibold font-serif leading-tight text-neutral-900 mb-4 text-center"
        >
          Redefining Professional Education
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="text-base md:text-lg text-neutral-600 text-center max-w-2xl mb-16 leading-relaxed"
        >
          Learn by implementing. Acquire skills via live case challenges, simulations, and startup clinics.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full">
          {highlights.map((item, idx) => (
            <motion.div
              key={item.title || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-white border border-neutral-200/80 rounded-2xl p-6 md:p-8 flex gap-5 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 [&_svg]:w-6 [&_svg]:h-6 border border-amber-200/60">
                {iconsMap[idx % iconsMap.length]}
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-neutral-900 leading-none select-none">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-600 font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyTejas;
