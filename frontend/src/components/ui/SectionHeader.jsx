import React from 'react';
import { cn } from '@/utils/cn';

export const SectionHeader = ({ title, overline, description, align = 'center', className }) => {
  return (
    <div className={cn("flex flex-col mb-10", align === 'center' ? 'items-center text-center' : 'items-start text-left', className)}>
      {overline && <span className="text-primary-600 font-semibold tracking-wider uppercase text-sm mb-2">{overline}</span>}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
      {description && <p className="text-lg text-gray-600 max-w-2xl">{description}</p>}
    </div>
  );
};
