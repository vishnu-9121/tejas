import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';

export const ExitIntentModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  const { data: cmsData } = useQuery({
    queryKey: ['cms', 'global_exit_intent'],
    queryFn: () => cmsService.getCMSData('global_exit_intent'),
  });

  const config = cmsData?.data?.data || {
    isActive: true,
    headline: 'Wait! Before you go...',
    subtext: "Don't leave without our exclusive 2026 Future of Tech & Leadership Report.",
    description: 'Discover the skills top employers are looking for this year and how our programs guarantee your placement in leading MNCs.',
    buttonText: 'Download Free Report',
  };

  useEffect(() => {
    if (!config.isActive) return;

    // Check if it already triggered this session to avoid spamming
    const alreadyTriggered = sessionStorage.getItem('exit_intent_shown');
    if (alreadyTriggered) {
      setHasTriggered(true);
      return;
    }

    const handleMouseLeave = (e) => {
      // If mouse leaves from the top of the viewport (y <= 0 or very small)
      if (e.clientY <= 10 && !hasTriggered) {
        setIsVisible(true);
        setHasTriggered(true);
        sessionStorage.setItem('exit_intent_shown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Also trigger if they scroll down 70% of the page but haven't triggered it yet
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      if (scrollY / (docHeight - winHeight) > 0.7 && !hasTriggered) {
        setIsVisible(true);
        setHasTriggered(true);
        sessionStorage.setItem('exit_intent_shown', 'true');
        window.removeEventListener('scroll', handleScroll);
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasTriggered, config.isActive]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsVisible(false);
    toast.success("Check your inbox! We've sent the requested materials.", { duration: 4000 });
  };

  if (!config.isActive) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative"
          >
            <button 
              onClick={() => setIsVisible(false)} 
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="bg-primary-900 p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-accent-500/20 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                <FileText className="w-8 h-8 text-accent-400" />
              </div>
              <h3 className="text-2xl font-bold font-serif text-white mb-2 relative z-10">{config.headline}</h3>
              <p className="text-primary-100 text-sm relative z-10">
                {config.subtext}
              </p>
            </div>
            
            <div className="p-8">
              <p className="text-gray-600 text-center mb-6">
                {config.description}
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input type="email" placeholder="Enter your email address" required />
                <Button type="submit" variant="primary" className="w-full h-12 text-base font-semibold" rightIcon={<Download size={18} />}>
                  {config.buttonText}
                </Button>
              </form>
              <p className="text-xs text-center text-gray-400 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
