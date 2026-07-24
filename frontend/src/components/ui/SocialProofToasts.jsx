import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';

export const SocialProofToasts = () => {
  const [currentToast, setCurrentToast] = useState(null);

  const { data: cmsData } = useQuery({
    queryKey: ['cms', 'global_social_proof'],
    queryFn: () => cmsService.getCMSData('global_social_proof'),
  });

  // Strict compliance: Default to inactive if no real backend data exists.
  // Never show simulated, fake, or mock user activity notifications.
  const config = cmsData?.data?.data || {
    isActive: false,
    notifications: [],
  };

  useEffect(() => {
    if (!config.isActive || !config.notifications || config.notifications.length === 0) return;

    // Only run on client side and don't bombard the user immediately
    let intervalId;
    let timeoutId = setTimeout(() => {
      // Show first toast after 10 seconds
      showRandomToast();
      
      // Then show a new toast every 45-60 seconds
      intervalId = setInterval(() => {
        showRandomToast();
      }, 45000 + Math.random() * 15000);
    }, 10000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [config.isActive, config.notifications]);

  const showRandomToast = () => {
    if (!config.notifications || config.notifications.length === 0) return;
    const randomNotif = config.notifications[Math.floor(Math.random() * config.notifications.length)];
    setCurrentToast(randomNotif);
    
    // Hide it after 6 seconds
    setTimeout(() => {
      setCurrentToast(null);
    }, 6000);
  };

  if (!config.isActive) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 pointer-events-none">
      <AnimatePresence>
        {currentToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: -50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 w-72 flex items-start gap-4 pointer-events-auto"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 border border-primary-200 flex items-center justify-center shrink-0 text-primary-700 font-bold text-sm">
              {currentToast.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-sm text-gray-900 leading-snug">
                <span className="font-bold">{currentToast.name}</span> from {currentToast.city} <span className="text-gray-600">{currentToast.action}</span>
              </p>
              <p className="text-xs text-gray-400 mt-1 font-medium">{currentToast.time}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
