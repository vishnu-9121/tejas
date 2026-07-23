import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';

export const AnnouncementBar = () => {
  const [isClosed, setIsClosed] = useState(false);

  const { data: cmsData } = useQuery({
    queryKey: ['cms', 'announcement_bar'],
    queryFn: () => cmsService.getCMSData('announcement_bar'),
    staleTime: 60 * 1000,
  });

  const announcement = cmsData?.data?.data || {
    enabled: true,
    text: '🎉 Fall 2026 Admissions Now Open! Early Bird Scholarships Available.',
    linkText: 'Apply Today',
    linkUrl: '/admissions',
    badgeText: 'ADMISSIONS'
  };

  if (isClosed || announcement.enabled === false) return null;

  return (
    <div className="bg-slate-900 text-white px-4 py-2.5 text-xs font-inter relative z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center justify-center flex-1 gap-2 text-center">
          <span className="bg-primary-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            {announcement.badgeText || 'ANNOUNCEMENT'}
          </span>
          <span className="font-medium text-slate-200">{announcement.text}</span>
          {announcement.linkText && announcement.linkUrl && (
            <Link to={announcement.linkUrl} className="font-bold text-primary-400 hover:text-primary-300 underline ml-1">
              {announcement.linkText} &rarr;
            </Link>
          )}
        </div>
        <button
          onClick={() => setIsClosed(true)}
          className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Close Announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
