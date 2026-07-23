const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'client', 'src');

const filesToCreate = {
  'components/ui/Button.jsx': `import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', isLoading, children, leftIcon, rightIcon, ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50';
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 shadow-sm',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-900',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-900',
    text: 'bg-transparent text-primary-600 hover:underline px-0',
    gold: 'bg-accent-500 text-white hover:bg-accent-600 shadow-sm'
  };
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-lg'
  };

  return (
    <button ref={ref} className={cn(baseStyles, variants[variant], sizes[size], className)} disabled={isLoading || props.disabled} {...props}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
});
Button.displayName = 'Button';`,

  'components/ui/Badge.jsx': `import React from 'react';
import { cn } from '@/utils/cn';

export const Badge = ({ children, variant = 'default', className }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    gold: 'bg-accent-100 text-accent-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800'
  };
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', variants[variant], className)}>
      {children}
    </span>
  );
};`,

  'components/ui/Input.jsx': `import React from 'react';
import { cn } from '@/utils/cn';

export const Input = React.forwardRef(({ className, label, error, helperText, leftIcon, rightIcon, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        {leftIcon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{leftIcon}</div>}
        <input
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {rightIcon && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{rightIcon}</div>}
      </div>
      {(error || helperText) && (
        <p className={cn('text-sm', error ? 'text-red-500' : 'text-gray-500')}>{error || helperText}</p>
      )}
    </div>
  );
});
Input.displayName = 'Input';`,

  'components/ui/Select.jsx': `import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

export const Select = React.forwardRef(({ className, label, error, options = [], ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'appearance-none flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        >
          {options.map((opt, i) => (
            <option key={i} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
});
Select.displayName = 'Select';`,

  'components/ui/Textarea.jsx': `import React, { useState } from 'react';
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
Textarea.displayName = 'Textarea';`,

  'components/ui/Checkbox.jsx': `import React from 'react';
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
Checkbox.displayName = 'Checkbox';`,

  'components/ui/Switch.jsx': `import React from 'react';
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
Switch.displayName = 'Switch';`,

  'components/ui/Accordion.jsx': `import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export const Accordion = ({ items, className }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className={cn("w-full space-y-2", className)}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <button
              onClick={() => toggleIndex(i)}
              className="w-full flex justify-between items-center p-4 text-left font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <span>{item.title}</span>
              <ChevronDown className={cn("w-5 h-5 transition-transform duration-300 text-gray-500", isOpen && "rotate-180")} />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4 pt-0 text-gray-600">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};`,

  'components/ui/Tabs.jsx': `import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';

export const Tabs = ({ tabs, className }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex space-x-4 border-b border-gray-200 relative">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={cn("px-4 py-2 text-sm font-medium relative focus:outline-none transition-colors", activeTab === i ? "text-primary-600" : "text-gray-500 hover:text-gray-700")}
          >
            {tab.label}
            {activeTab === i && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-primary-600"
              />
            )}
          </button>
        ))}
      </div>
      <div className="py-4">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};`,

  'components/ui/SectionHeader.jsx': `import React from 'react';
import { cn } from '@/utils/cn';

export const SectionHeader = ({ title, overline, description, align = 'center', className }) => {
  return (
    <div className={cn("flex flex-col mb-10", align === 'center' ? 'items-center text-center' : 'items-start text-left', className)}>
      {overline && <span className="text-primary-600 font-semibold tracking-wider uppercase text-sm mb-2">{overline}</span>}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
      {description && <p className="text-lg text-gray-600 max-w-2xl">{description}</p>}
    </div>
  );
};`,

  'components/ui/Breadcrumb.jsx': `import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/utils/cn';

export const Breadcrumb = ({ className }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className={cn("flex py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-sm text-gray-500", className)} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link to="/" className="inline-flex items-center hover:text-primary-600 transition-colors">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = \`/\${pathnames.slice(0, index + 1).join('/')}\`;
          return (
            <li key={to}>
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                {last ? (
                  <span className="text-gray-900 font-medium capitalize">{value.replace(/-/g, ' ')}</span>
                ) : (
                  <Link to={to} className="hover:text-primary-600 transition-colors capitalize">{value.replace(/-/g, ' ')}</Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};`,

  'components/ui/Pagination.jsx': `import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils/cn';

export const Pagination = ({ currentPage, totalPages, onPageChange, className }) => {
  const getPages = () => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  return (
    <nav className={cn("flex items-center justify-center space-x-2 my-8", className)}>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-10 h-10 p-0"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      {getPages().map((page, i) => (
        <React.Fragment key={i}>
          {page === '...' ? (
            <span className="px-3 py-2">...</span>
          ) : (
            <Button
              variant={currentPage === page ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onPageChange(page)}
              className="w-10 h-10 p-0"
            >
              {page}
            </Button>
          )}
        </React.Fragment>
      ))}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-10 h-10 p-0"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </nav>
  );
};`,

  'components/ui/Modal.jsx': `import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

export const Modal = ({ isOpen, onClose, title, children, className }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn("relative w-full max-w-lg bg-white rounded-xl shadow-2xl z-10 m-4 overflow-hidden", className)}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[80vh]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};`,

  'utils/cn.js': `import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}`,

  'components/cards/ProgramCard.jsx': `import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export const ProgramCard = ({ id, slug, title, description, category, duration, location, image }) => {
  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img src={image || 'https://via.placeholder.com/400x300'} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-4 left-4">
          <Badge variant="primary">{category}</Badge>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 mt-auto">
          <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {duration}</div>
          <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {location}</div>
        </div>
        <Link to={\`/programs/\${slug}\`} className="inline-flex items-center font-semibold text-primary-600 hover:text-primary-700 transition-colors">
          View Details <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};`,

  'components/cards/FacultyCard.jsx': `import React from 'react';
import { Linkedin, Twitter } from 'lucide-react';

export const FacultyCard = ({ name, role, department, image, bio, socials }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
      <div className="aspect-[3/4] relative overflow-hidden">
        <img src={image || 'https://via.placeholder.com/300x400'} alt={name} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5 text-center">
        <h3 className="text-lg font-bold text-gray-900">{name}</h3>
        <p className="text-primary-600 text-sm font-medium mb-1">{role}</p>
        <p className="text-gray-500 text-xs mb-3">{department}</p>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{bio}</p>
        <div className="flex justify-center gap-3">
          {socials?.linkedin && <a href={socials.linkedin} className="text-gray-400 hover:text-[#0077b5] transition-colors"><Linkedin className="w-4 h-4" /></a>}
          {socials?.twitter && <a href={socials.twitter} className="text-gray-400 hover:text-[#1DA1F2] transition-colors"><Twitter className="w-4 h-4" /></a>}
        </div>
      </div>
    </div>
  );
};`,
  
  'components/cards/MentorCard.jsx': `import React from 'react';
import { FacultyCard } from './FacultyCard';
export const MentorCard = (props) => <FacultyCard {...props} />;`,

  'components/cards/BlogCard.jsx': `import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export const BlogCard = ({ slug, title, excerpt, coverImage, author, date, category }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition-shadow h-full">
      <Link to={\`/blog/\${slug}\`} className="relative h-48 overflow-hidden block">
        <img src={coverImage || 'https://via.placeholder.com/400x300'} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-4 left-4"><Badge variant="default" className="bg-white/90 backdrop-blur">{category}</Badge></div>
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(date).toLocaleDateString()}</span>
          <span className="flex items-center gap-1"><User className="w-3 h-3" /> {author}</span>
        </div>
        <Link to={\`/blog/\${slug}\`}>
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">{title}</h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-3 mt-auto">{excerpt}</p>
        <Link to={\`/blog/\${slug}\`} className="font-medium text-primary-600 hover:text-primary-700 text-sm mt-auto inline-block">Read More &rarr;</Link>
      </div>
    </div>
  );
};`,

  'components/cards/EventCard.jsx': `import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

export const EventCard = ({ title, description, date, time, location, image, type }) => {
  return (
    <div className="flex flex-col sm:flex-row bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="sm:w-1/3 relative h-48 sm:h-auto">
        <img src={image || 'https://via.placeholder.com/400x300'} alt={title} className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs font-bold text-primary-600 uppercase tracking-wide">{type}</div>
      </div>
      <div className="p-6 sm:w-2/3 flex flex-col justify-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-500">
          <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary-500" /> {date}</div>
          <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary-500" /> {time}</div>
          <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary-500" /> {location}</div>
        </div>
      </div>
    </div>
  );
};`,

  'components/cards/TestimonialCard.jsx': `import React from 'react';
import { Quote } from 'lucide-react';

export const TestimonialCard = ({ name, role, company, content, image }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative h-full flex flex-col">
      <Quote className="absolute top-6 right-6 w-10 h-10 text-gray-100" />
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <img src={image || 'https://via.placeholder.com/100'} alt={name} className="w-14 h-14 rounded-full object-cover" />
        <div>
          <h4 className="font-bold text-gray-900">{name}</h4>
          <p className="text-sm text-gray-500">{role}{company ? \`, \${company}\` : ''}</p>
        </div>
      </div>
      <p className="text-gray-600 italic flex-grow relative z-10">"{content}"</p>
    </div>
  );
};`,

  'components/forms/NewsletterForm.jsx': `import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const schema = z.object({
  email: z.string().email('Invalid email address')
});

export const NewsletterForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data) => {
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Subscribed successfully!');
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3 max-w-md w-full">
      <div className="flex-grow">
        <Input placeholder="Enter your email" {...register('email')} error={errors.email?.message} className="bg-white/10 text-white border-white/20 placeholder:text-gray-300" />
      </div>
      <Button type="submit" variant="primary" isLoading={isSubmitting} className="shrink-0 h-10">
        Subscribe
      </Button>
    </form>
  );
};`,

  'components/forms/ContactForm.jsx': `import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(10, 'Message is too short')
});

export const ContactForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    await new Promise(r => setTimeout(r, 1500));
    toast.success('Message sent successfully! We will get back to you soon.');
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Your Name" {...register('name')} error={errors.name?.message} />
        <Input label="Your Email" type="email" {...register('email')} error={errors.email?.message} />
      </div>
      <Input label="Subject" {...register('subject')} error={errors.subject?.message} />
      <Textarea label="Message" rows={5} {...register('message')} error={errors.message?.message} />
      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting}>
        Send Message
      </Button>
    </form>
  );
};`,

  'components/forms/AdmissionsForm.jsx': `import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';

const steps = ['Personal Info', 'Academic Details', 'Program Selection'];

const stepSchemas = [
  z.object({ firstName: z.string().min(1, 'Required'), lastName: z.string().min(1, 'Required'), email: z.string().email(), phone: z.string().min(10) }),
  z.object({ prevSchool: z.string().min(1, 'Required'), grade: z.string().min(1, 'Required') }),
  z.object({ program: z.string().min(1, 'Required'), agree: z.boolean().refine(v => v, 'Must agree to terms') })
];

export const AdmissionsForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const currentSchema = stepSchemas[currentStep];

  const { register, handleSubmit, formState: { errors, isSubmitting }, trigger } = useForm({
    resolver: zodResolver(currentSchema), mode: 'onChange'
  });

  const onNext = async () => {
    const isStepValid = await trigger();
    if (isStepValid) setCurrentStep(s => s + 1);
  };

  const onPrev = () => setCurrentStep(s => s - 1);

  const onSubmit = async (data) => {
    await new Promise(r => setTimeout(r, 2000));
    toast.success('Application submitted successfully!');
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-0 h-1 bg-primary-600 -z-10 -translate-y-1/2 transition-all duration-300" style={{ width: \`\${(currentStep / (steps.length - 1)) * 100}%\` }}></div>
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center bg-white px-2">
            <div className={\`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors \${idx <= currentStep ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}\`}>
              {idx + 1}
            </div>
            <span className="text-xs mt-2 font-medium text-gray-600 hidden sm:block">{step}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(currentStep === steps.length - 1 ? onSubmit : (e) => { e.preventDefault(); onNext(); })}>
        <div className="min-h-[250px]">
          {currentStep === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-4">
              <Input label="First Name" {...register('firstName')} error={errors.firstName?.message} />
              <Input label="Last Name" {...register('lastName')} error={errors.lastName?.message} />
              <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
              <Input label="Phone" type="tel" {...register('phone')} error={errors.phone?.message} />
            </div>
          )}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <Input label="Previous School/College" {...register('prevSchool')} error={errors.prevSchool?.message} />
              <Input label="Percentage/Grade" {...register('grade')} error={errors.grade?.message} />
            </div>
          )}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <Select label="Select Program" options={[{value:'', label:'Select...'}, {value:'cs', label:'Computer Science'}, {value:'biz', label:'Business Admin'}]} {...register('program')} error={errors.program?.message} />
              <Checkbox label="I agree to the terms and conditions" {...register('agree')} />
              {errors.agree && <p className="text-red-500 text-sm">{errors.agree.message}</p>}
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onPrev} disabled={currentStep === 0}>Back</Button>
          {currentStep < steps.length - 1 ? (
            <Button type="button" onClick={onNext}>Continue</Button>
          ) : (
            <Button type="submit" isLoading={isSubmitting}>Submit Application</Button>
          )}
        </div>
      </form>
    </div>
  );
};`,

  'components/layout/Navbar.jsx': `import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about', dropdown: [
    { name: 'Vision & Mission', path: '/about/vision-mission' },
    { name: 'Campus', path: '/about/campus' },
  ]},
  { name: 'Programs', path: '/programs' },
  { name: 'Admissions', path: '/admissions' },
  { name: 'Faculty', path: '/faculty' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={cn("fixed top-0 left-0 right-0 z-40 transition-all duration-300", isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-white py-5")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-accent-600">Tejas Academy</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group">
              {link.dropdown ? (
                <div className="flex items-center gap-1 text-gray-700 hover:text-primary-600 font-medium cursor-pointer py-2">
                  {link.name} <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-xl rounded-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-2">
                    {link.dropdown.map(drop => (
                      <Link key={drop.name} to={drop.path} className="px-4 py-2 hover:bg-gray-50 text-gray-700 hover:text-primary-600 text-sm font-medium">
                        {drop.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link to={link.path} className={cn("text-gray-700 hover:text-primary-600 font-medium py-2", location.pathname === link.path && "text-primary-600")}>
                  {link.name}
                </Link>
              )}
            </div>
          ))}
          <Button variant="primary" size="sm" as={Link} to="/contact">Contact Us</Button>
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg px-4 py-6 flex flex-col gap-4">
          {navLinks.map(link => (
             <Link key={link.name} to={link.path} className="text-lg font-medium text-gray-900 border-b border-gray-50 pb-2">{link.name}</Link>
          ))}
          <Button variant="primary" className="mt-4 w-full" as={Link} to="/contact">Contact Us</Button>
        </div>
      )}
    </header>
  );
};`,

  'components/layout/Footer.jsx': `import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-white text-2xl font-bold mb-6">Tejas Academy</h3>
            <p className="mb-6 text-gray-400 leading-relaxed">Empowering the next generation of leaders through world-class education, innovation, and holistic development.</p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link to="/programs" className="hover:text-primary-400 transition-colors">Programs</Link></li>
              <li><Link to="/admissions" className="hover:text-primary-400 transition-colors">Admissions</Link></li>
              <li><Link to="/faculty" className="hover:text-primary-400 transition-colors">Faculty</Link></li>
              <li><Link to="/blog" className="hover:text-primary-400 transition-colors">Blog & News</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Support</h4>
            <ul className="space-y-3">
              <li><Link to="/faq" className="hover:text-primary-400 transition-colors">FAQs</Link></li>
              <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/career" className="hover:text-primary-400 transition-colors">Careers</Link></li>
              <li><Link to="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-500 shrink-0 mt-1" />
                <span>123 Education Boulevard, Tech City, 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-500 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-500 shrink-0" />
                <span>info@tejasacademy.edu</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Tejas Academy of Excellence. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};`,

  'components/layout/AnnouncementBar.jsx': `import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-primary-900 text-white px-4 py-2 text-sm relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center md:justify-between">
        <div className="hidden md:block"></div>
        <div className="text-center flex-1">
          <span className="font-medium mr-2">New:</span> 
          Admissions for Fall 2026 are now open! 
          <Link to="/admissions" className="ml-2 font-bold underline hover:text-accent-300">Apply Now</Link>
        </div>
        <button onClick={() => setIsVisible(false)} className="absolute right-4 md:relative md:right-0 p-1 hover:bg-white/20 rounded-full transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};`,

  'components/layout/SmoothScroll.jsx': `import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const SmoothScroll = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
};`,

  'pages/Home.jsx': `import React from 'react';
import { Button } from '@/components/ui/Button';

export const Home = () => {
  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 text-center py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Welcome to Tejas Academy</h1>
        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">Empowering the next generation of leaders through world-class education, innovation, and holistic development.</p>
        <Button size="lg" className="mr-4">Explore Programs</Button>
        <Button variant="outline" size="lg">Contact Us</Button>
      </div>
    </div>
  );
};`,

  'App.jsx': `import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { SmoothScroll } from './components/layout/SmoothScroll';
import { Breadcrumb } from './components/ui/Breadcrumb';

// Pages
import { Home } from './pages/Home';

function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 selection:bg-primary-200">
      <SmoothScroll />
      <AnnouncementBar />
      <Navbar />
      <main className="flex-grow pt-[72px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<div className="text-center py-40"><h1 className="text-4xl font-bold">404 - Not Found</h1></div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
export default App;`,

  'main.jsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  </React.StrictMode>,
);`
};

const createFiles = () => {
  for (const [relativePath, content] of Object.entries(filesToCreate)) {
    const fullPath = path.join(baseDir, relativePath);
    const dir = path.dirname(fullPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Created:', relativePath);
  }
};

createFiles();
