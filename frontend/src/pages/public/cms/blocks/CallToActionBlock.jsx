import React from 'react';
import { Button } from '../../../components/ui/Button';

export default function CallToActionBlock({ data }) {
  const { title, subtitle, cta } = data;

  return (
    <div className="py-24 bg-primary-600 text-white text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">{title}</h2>
        <p className="text-xl text-primary-100 mb-10">{subtitle}</p>
        {cta && (
          <Button variant="gold" size="lg" className="rounded-full px-10 py-4 shadow-xl shadow-yellow-500/20 text-lg">
            {cta.label}
          </Button>
        )}
      </div>
    </div>
  );
}
