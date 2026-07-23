import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';

export const AnnouncementBar = () => {
  const [isClosed, setIsClosed] = useState(false);

  const { data: cmsData } = useQuery({
    queryKey: ['cms', 'global_notification'],
    queryFn: () => cmsService.getCMSData('global_notification'),
  });

  const notification = cmsData?.data?.data;

  // Don't show if closed, inactive, or not loaded
  if (isClosed || !notification?.isActive) return null;

  return (
    <div className="bg-primary-900 text-white px-4 py-2 text-sm relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center md:justify-between">
        <div className="hidden md:block"></div>
        <div className="text-center flex-1">
          <span className="font-medium mr-2">New:</span> 
          <span>{notification.message}</span>
          {notification.ctaText && notification.ctaLink && (
            <Link to={notification.ctaLink} className="ml-2 font-bold underline hover:text-accent-300">
              {notification.ctaText}
            </Link>
          )}
        </div>
        <button onClick={() => setIsClosed(true)} className="absolute right-4 md:relative md:right-0 p-1 hover:bg-white/20 rounded-full transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
