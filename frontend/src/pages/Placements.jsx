import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const Placements = () => {
  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <SectionHeader title="Placements & Careers" description="Our graduates are shaping the future." />
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-16">
        <div className="p-8 bg-primary-50 rounded-2xl">
          <div className="text-4xl font-bold text-primary-700 mb-2">98%</div>
          <div className="text-gray-700">Placement Rate</div>
        </div>
        <div className="p-8 bg-primary-50 rounded-2xl">
          <div className="text-4xl font-bold text-primary-700 mb-2">$85k</div>
          <div className="text-gray-700">Average Starting Salary</div>
        </div>
        <div className="p-8 bg-primary-50 rounded-2xl">
          <div className="text-4xl font-bold text-primary-700 mb-2">500+</div>
          <div className="text-gray-700">Hiring Partners</div>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-center mb-8">Top Hiring Partners</h3>
      <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale">
        {['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix'].map(c => (
          <div key={c} className="text-2xl font-bold">{c}</div>
        ))}
      </div>
    </div>
  );
};
