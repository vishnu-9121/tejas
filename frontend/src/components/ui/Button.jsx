import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', isLoading, children, leftIcon, rightIcon, as: Component = 'button', ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/30 disabled:pointer-events-none disabled:opacity-50 select-none';
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-[0_2px_10px_rgba(30,107,62,0.2)]',
    secondary: 'bg-gray-900 text-white hover:bg-gray-800 shadow-[0_2px_10px_rgba(15,17,20,0.2)]',
    outline: 'border border-gray-200 bg-white hover:bg-primary-50 text-gray-900 hover:text-primary-700 shadow-sm transition-colors',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-900',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-[0_2px_10px_rgba(239,68,68,0.2)]',
    text: 'bg-transparent text-primary-600 hover:underline px-0',
    gold: 'bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 shadow-[0_2px_15px_rgba(196,149,42,0.25)]',
    white: 'bg-white text-gray-900 hover:bg-primary-50 hover:text-primary-700 shadow-md border border-gray-100 font-bold transition-all',
    'outline-white': 'border-2 border-white/80 bg-transparent text-white hover:bg-white hover:text-primary-900 shadow-sm font-bold transition-all'
  };
  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2 text-sm',
    lg: 'h-12 px-6 text-base'
  };

  const MotionComponent = Component === 'button' ? motion.button : motion(Component);

  return (
    <MotionComponent 
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      ref={ref} 
      className={cn(baseStyles, variants[variant], sizes[size], className)} 
      disabled={isLoading || (Component === 'button' ? props.disabled : undefined)} 
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </MotionComponent>
  );
});
Button.displayName = 'Button';
