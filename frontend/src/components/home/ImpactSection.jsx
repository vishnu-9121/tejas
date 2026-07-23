import React from "react";

const METRICS = [
  {
    number: "500+",
    label: "National Scope",
    description: "Students hailing from 25 states across India representing diverse backgrounds.",
  },
  {
    number: "30+",
    label: "Community Programs",
    description: "Social awareness workshops benefiting over 10,000+ citizens directly.",
  },
  {
    number: "15+",
    label: "Startups Launched",
    description: "Successful businesses founded by our young entrepreneurship alumni.",
  },
  {
    number: "₹2Cr+",
    label: "Social Value",
    description: "Calculated social impact valuation created by our students projects.",
  },
];

export function ImpactSection() {
  return (
    <section className="bg-neutral-0 py-16 md:py-24 border-b border-neutral-100">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20 flex flex-col items-center">
        <div className="h-0.5 w-12 bg-accent-500 mb-4" />
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-700 mb-2 select-none">
          Community Impact
        </span>
        <h2 className="text-3xl md:text-4xl font-semibold font-serif leading-tight text-neutral-900 mb-16 text-center">
          Our Footprint of Excellence
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          {METRICS.map((metric) => (
            <div
              key={metric.label}
              className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 flex flex-col items-center text-center gap-3 transition-all duration-300 hover:shadow-md"
            >
              <span className="text-4xl font-bold font-sans text-primary-700">
                {metric.number}
              </span>
              <h3 className="text-base font-semibold text-neutral-900 select-none">
                {metric.label}
              </h3>
              <p className="text-xs text-neutral-600 font-sans leading-relaxed max-w-[200px]">
                {metric.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
