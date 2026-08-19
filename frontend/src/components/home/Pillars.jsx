import React from "react";
import { Brain, Shield, Heart, Award, Globe } from "lucide-react";

const PILLARS = [
  {
    icon: <Brain />,
    title: "Intellectual",
    dimension: "Excellence",
    description: "Strategic thinking, analytical depth, critical inquiry, and systems-level problem solving.",
  },
  {
    icon: <Shield />,
    title: "Character",
    dimension: "Excellence",
    description: "Unyielding integrity, moral courage, personal discipline, and authentic ownership.",
  },
  {
    icon: <Heart />,
    title: "Emotional",
    dimension: "Excellence",
    description: "Resilience in spirit, emotional balance, empathy, and adaptive composure under pressure.",
  },
  {
    icon: <Award />,
    title: "Professional",
    dimension: "Excellence",
    description: "Rigorous competence, practical execution, responsible innovation, and AI mastery.",
  },
  {
    icon: <Globe />,
    title: "Societal",
    dimension: "Excellence",
    description: "Servant leadership, ethical value creation, nation building, and global responsibility.",
  },
];

export function Pillars() {
  return (
    <section className="bg-neutral-0 py-16 md:py-24 border-b border-neutral-100">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20 flex flex-col items-center">
        <div className="h-0.5 w-12 bg-accent-500 mb-4" />
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-700 mb-2 select-none">
          Institutional Pillars
        </span>
        <h2 className="text-3xl md:text-4xl font-semibold font-serif leading-tight text-neutral-900 mb-4 text-center">
          The Five Dimensions of Human Excellence
        </h2>
        <p className="text-base text-neutral-600 text-center max-w-2xl mb-16 leading-relaxed">
          Education at Tejas Academy transcends information transfer to cultivate holistic human capability, character, and lifelong leadership.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6 justify-center">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="flex flex-col items-center text-center gap-4 group"
            >
              <div className="w-16 h-16 rounded-full bg-primary-50 text-accent-600 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-200 [&_svg]:w-7 [&_svg]:h-7 border border-primary-100/70">
                {pillar.icon}
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-neutral-900 select-none">
                  {pillar.title}
                </h3>
                <span className="text-xs font-bold text-accent-600 uppercase tracking-wider">
                  {pillar.dimension}
                </span>
              </div>
              <p className="text-sm text-neutral-600 font-sans leading-relaxed max-w-[200px]">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
