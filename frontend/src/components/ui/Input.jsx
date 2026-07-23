import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export const Input = React.forwardRef(({ className, label, error, helperText, leftIcon, rightIcon, ...props }, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex flex-col w-full relative">
      {label && (
        <label className={cn(
          "text-sm font-semibold mb-1.5 transition-colors",
          error ? "text-red-500" : isFocused ? "text-primary-600" : "text-gray-700"
        )}>
          {label}
        </label>
      )}
      <div className="relative group">
        {leftIcon && <div className={cn("absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors", isFocused ? "text-primary-500" : "text-gray-400", error && "text-red-500")}>{leftIcon}</div>}
        <input
          ref={ref}
          onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
          className={cn(
            'flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 transition-all shadow-sm',
            leftIcon && 'pl-11',
            rightIcon && 'pr-11',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          {...props}
        />
        {rightIcon && <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">{rightIcon}</div>}
      </div>
      
      <AnimatePresence>
        {(error || helperText) && (
          <motion.p 
            initial={{ opacity: 0, y: -5 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -5 }}
            className={cn('text-xs font-medium mt-1.5 ml-1', error ? 'text-red-500' : 'text-gray-500')}
          >
            {error || helperText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});
Input.displayName = 'Input';
