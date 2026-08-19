import React from "react";
import { Compass, BookOpen, Users, Trophy } from "lucide-react";

const STEPS = [
  {
    icon: <Compass />,
    title: "Intellectual Awakening",
    description: "Engage with foundational knowledge, rigorous inquiry, and critical perspectives across disciplines.",
  },
  {
    icon: <BookOpen />,
    title: "Experiential Execution",
    description: "Immerse in live project challenges, simulation clinics, and prototype sprints to convert theory into capability.",
  },
  {
    icon: <Users />,
    title: "Mentored Iteration",
    description: "Receive continuous 1-on-1 feedback from seasoned leaders to refine decision-making and build resilience.",
  },
  {
    icon: <Trophy />,
    title: "Mastery & Leadership",
    description: "Graduate with character, professional competence, and the courage to create lasting societal value.",
  },
];

export function Journey() {
  return (
    <section className="bg-neutral-50 py-16 md:py-24 border-b border-neutral-100">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20 flex flex-col items-center">
        <div className="h-0.5 w-12 bg-accent-500 mb-4" />
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-700 mb-2 select-none">
          Knowledge → Practice → Feedback → Iteration → Mastery
        </span>
        <h2 className="text-3xl md:text-4xl font-semibold font-serif leading-tight text-neutral-900 mb-16 text-center">
          The Tejas Path to Human Excellence
        </h2>

        <div className="relative w-full">
          {/* Horizontal connecting line on desktop */}
          <div className="hidden md:block absolute top-8 left-12 right-12 h-[2px] bg-neutral-200 -z-0" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6 relative z-10">
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                className="flex flex-col items-center text-center gap-4 group"
              >
                <div className="w-16 h-16 rounded-full bg-neutral-0 border border-primary-100 text-primary-700 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200 [&_svg]:w-6 [&_svg]:h-6">
                  {step.icon}
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-primary-600 font-sans uppercase tracking-wider select-none">
                    Phase {index + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-neutral-900 leading-none">
                    {step.title}
                  </h3>
                  <p className="text-sm text-neutral-600 font-sans leading-relaxed max-w-[220px] mx-auto">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
