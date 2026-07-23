import React from 'react';
import { cn } from '@/utils/cn';

export const Checkbox = React.forwardRef(({ className, label, ...props }, ref) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer group min-h-[44px]">
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          ref={ref}
          className="peer sr-only"
          {...props}
        />
        <div className={cn("w-5 h-5 rounded border border-gray-300 bg-white transition-colors peer-checked:bg-primary-600 peer-checked:border-primary-600 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2", className)}></div>
        <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      {label && <span className="text-sm text-gray-700 select-none">{label}</span>}
    </label>
  );
});
Checkbox.displayName = 'Checkbox';
