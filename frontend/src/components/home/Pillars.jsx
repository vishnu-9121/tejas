import React from "react";
import { Crown, Lightbulb, MessageSquare, Briefcase, HeartHandshake } from "lucide-react";

const PILLARS = [
  {
    icon: <Crown />,
    title: "Leadership",
    description: "Develop vision, influence, delegation, and structural ownership required to guide organizations successfully.",
  },
  {
    icon: <Lightbulb />,
    title: "Innovation",
    description: "Cultivate design thinking, prompt validations, and creative problem-solving skills to build unique ideas.",
  },
  {
    icon: <MessageSquare />,
    title: "Communication",
    description: "Master executive presentations, public speaking, negotiation, and high-impact boardroom pitches.",
  },
  {
    icon: <Briefcase />,
    title: "Career Readiness",
    description: "Acquire real-world capabilities, prepare resume cases, and accelerate recruitment transitions.",
  },
  {
    icon: <HeartHandshake />,
    title: "Character Building",
    description: "Establish integrity, mental fortitude, mindfulness, and habits defining highly respected leaders.",
  },
];

export function Pillars() {
  return (
    <section className="bg-neutral-0 py-16 md:py-24 border-b border-neutral-100">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20 flex flex-col items-center">
        <div className="h-0.5 w-12 bg-accent-500 mb-4" />
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-700 mb-2 select-none">
          Pillars of Excellence
        </span>
        <h2 className="text-3xl md:text-4xl font-semibold font-serif leading-tight text-neutral-900 mb-16 text-center">
          The Foundation of Every Program
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6 justify-center">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="flex flex-col items-center text-center gap-4 group"
            >
              <div className="w-16 h-16 rounded-full bg-primary-50 text-accent-500 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-200 [&_svg]:w-7 [&_svg]:h-7">
                {pillar.icon}
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mt-2 select-none">
                {pillar.title}
              </h3>
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
