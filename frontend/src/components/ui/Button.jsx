import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';

export const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  children, 
  leftIcon, 
  rightIcon, 
  as: Component = 'button', 
  fullWidth = false,
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-250 ease-out select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 shrink-0';

  const variants = {
    // Refined Matte & Elegant Institutional Styles (Reduced Shine)
    primary: 'bg-[#1b321e] hover:bg-[#254228] text-amber-300 border border-amber-400/40 shadow-sm hover:shadow-md hover:shadow-black/15 font-bold',
    gold: 'bg-gradient-to-r from-[#d49e35] to-[#c28e2b] hover:from-[#c28e2b] hover:to-[#b07e21] text-slate-950 border border-amber-300/40 shadow-sm hover:shadow-md font-bold',
    secondary: 'bg-white/90 dark:bg-[#132214] backdrop-blur-md text-gray-800 dark:text-emerald-100 border border-gray-200/90 dark:border-amber-400/30 hover:border-amber-400/60 hover:bg-amber-50/40 dark:hover:bg-[#1c3320] hover:text-amber-700 dark:hover:text-amber-300 shadow-xs',
    outline: 'border border-amber-400/40 bg-transparent text-amber-300 hover:bg-[#1f3521] hover:text-white shadow-xs font-semibold',
    ghost: 'bg-transparent text-gray-700 dark:text-emerald-100 hover:bg-emerald-950/30 hover:text-amber-300',
    text: 'bg-transparent text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 p-0 h-auto font-semibold hover:underline',
    dark: 'bg-gray-900 hover:bg-black text-white dark:bg-[#101b11] dark:hover:bg-[#162617] shadow-sm border border-emerald-900/60',
    danger: 'bg-rose-700 hover:bg-rose-800 text-white shadow-sm border border-rose-600/40',
    success: 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm border border-emerald-600/40',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm border border-amber-500/40',
    white: 'bg-white dark:bg-[#132214] text-gray-900 dark:text-amber-300 border border-gray-200 dark:border-amber-400/30 hover:border-amber-400 shadow-xs',
    'outline-white': 'border border-white/70 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 shadow-xs font-semibold'
  };

  const sizes = {
    xs: 'h-8 px-3 text-xs rounded-lg gap-1.5 min-h-[32px]',
    sm: 'h-9 px-3.5 text-xs rounded-xl gap-1.5 min-h-[36px]',
    md: 'h-11 px-5 text-sm rounded-xl gap-2 min-h-[44px]',
    lg: 'h-12 px-6 text-sm sm:text-base rounded-xl gap-2.5 min-h-[48px]',
    xl: 'h-14 px-8 text-base sm:text-lg rounded-2xl gap-3 min-h-[52px]',
    icon: 'h-11 w-11 p-0 rounded-xl justify-center min-h-[44px] min-w-[44px]',
    'icon-sm': 'h-9 w-9 p-0 rounded-lg justify-center min-h-[36px] min-w-[36px]'
  };

  const MotionComponent = Component === 'button' ? motion.button : motion(Component);

  return (
    <MotionComponent 
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      ref={ref} 
      className={cn(
        baseStyles, 
        variants[variant], 
        sizes[size], 
        fullWidth && 'w-full',
        className
      )} 
      disabled={isLoading || (Component === 'button' ? props.disabled : undefined)} 
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
      ) : (
        <>
          {leftIcon && <span className="inline-flex items-center shrink-0">{leftIcon}</span>}
          {children && <span>{children}</span>}
          {rightIcon && <span className="inline-flex items-center shrink-0">{rightIcon}</span>}
        </>
      )}
    </MotionComponent>
  );
});

Button.displayName = 'Button';
