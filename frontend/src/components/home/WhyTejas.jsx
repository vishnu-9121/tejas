import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Milestone, Target } from "lucide-react";

const HIGHLIGHTS = [
  {
    icon: <BookOpen />,
    title: "Practical Learning",
    description: "Learn by implementing. Acquire skills via live case challenges, simulations, and startup clinics.",
  },
  {
    icon: <Users />,
    title: "1-on-1 Executive Mentorship",
    description: "Get weekly coaching slots from leaders working at premium global corporations.",
  },
  {
    icon: <Milestone />,
    title: "Career Milestones Track",
    description: "Continuous placements readiness validation to secure placement transitions smoothly.",
  },
  {
    icon: <Target />,
    title: "Ethics & Integrity Core",
    description: "Ground yourself in human excellence values that define respected long-term leaders.",
  },
];

export function WhyTejas() {
  return (
    <section className="bg-neutral-50 py-16 md:py-24 border-b border-neutral-100">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20 flex flex-col items-center">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: 48 }}
          viewport={{ once: true }}
          className="h-0.5 bg-accent-500 mb-4" 
        />
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-semibold uppercase tracking-widest text-accent-700 mb-2 select-none"
        >
          Why Tejas Academy of Excellence
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-semibold font-serif leading-tight text-neutral-900 mb-16 text-center"
        >
          Redefining Professional Education
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full">
          {HIGHLIGHTS.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-neutral-0 border border-neutral-100 rounded-lg p-6 md:p-8 flex gap-5 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center shrink-0 [&_svg]:w-6 [&_svg]:h-6">
                {item.icon}
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
