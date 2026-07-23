import React, { useState } from 'react';
import { cn } from '@/utils/cn';

export const Textarea = React.forwardRef(({ className, label, error, maxLength, onChange, ...props }, ref) => {
  const [length, setLength] = useState(props.defaultValue?.length || props.value?.length || 0);

  const handleChange = (e) => {
    setLength(e.target.value.length);
    if (onChange) onChange(e);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <textarea
        ref={ref}
        onChange={handleChange}
        maxLength={maxLength}
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      <div className="flex justify-between items-center text-sm">
        <span className="text-red-500">{error}</span>
        {maxLength && <span className="text-gray-400 ml-auto">{length}/{maxLength}</span>}
      </div>
    </div>
  );
});
Textarea.displayName = 'Textarea';
