import React from 'react';
import { cn } from '@/utils/cn';

export const Switch = React.forwardRef(({ className, checked, onChange, label, ...props }, ref) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div className="relative inline-flex items-center">
        <input type="checkbox" ref={ref} checked={checked} onChange={onChange} className="sr-only peer" {...props} />
        <div className={cn("w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600", className)}></div>
      </div>
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
    </label>
  );
});
Switch.displayName = 'Switch';
