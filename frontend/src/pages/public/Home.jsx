import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BlockRenderer } from './cms/BlockRegistry';
import { useSocket } from '../../contexts/SocketContext';

// Hardcoded fallback data in case the CMS is empty or backend is unreachable
const fallbackBlocks = [
  {
    type: 'HeroBlock',
    isActive: true,
    data: {
      title: 'Welcome to Tejas Academy',
      subtitle: 'Where innovation meets excellence. Join a global community of forward-thinking leaders.',
      primaryCta: { label: 'Apply Now' },
      secondaryCta: { label: 'Explore Programs' }
    }
  },
  {
    type: 'StatsBlock',
    isActive: true,
    data: {
      stats: [
        { label: 'Global Students', value: '15,000+' },
        { label: 'Expert Faculty', value: '400+' },
        { label: 'Programs', value: '120+' },
        { label: 'Alumni Network', value: '50k+' }
      ]
    }
  },
  {
    type: 'ProgramsBlock',
    isActive: true,
    data: {
      title: 'Our Elite Programs',
      subtitle: 'Discover future-proof degrees tailored for the digital age.',
      programs: [
        { name: 'B.Tech in AI & Data Science', description: 'Master machine learning algorithms and neural networks.' },
        { name: 'MBA in Digital Business', description: 'Lead the transformation of traditional business models.' },
        { name: 'M.Des in UX Architecture', description: 'Design the future of human-computer interaction.' }
      ]
    }
  },
  {
    type: 'CallToActionBlock',
    isActive: true,
    data: {
      title: 'Ready to Transform Your Future?',
      subtitle: 'Applications for the Fall 2026 cohort are now open.',
      cta: { label: 'Start Application' }
    }
  }
];

export default function Home() {
  const { socket } = useSocket();

  // Fetch the published version of the 'home' page from the CMS
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['cms-page', 'home'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || '/api/v1'}/cms/pages/home/public`);
      return res.data;
    },
    retry: 1
  });

  // Listen for CMS updates to trigger instant refresh
  useEffect(() => {
    if (socket) {
      const handleCmsUpdate = (payload) => {
        if (payload.slug === 'home') refetch();
      };
      socket.on('CMS_PAGE_UPDATED', handleCmsUpdate);
      return () => socket.off('CMS_PAGE_UPDATED', handleCmsUpdate);
    }
  }, [socket, refetch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Use CMS blocks if available, otherwise use hardcoded fallback
  const blocks = data?.data?.blocks?.length > 0 ? data.data.blocks : fallbackBlocks;

  return (
    <div className="min-h-screen">
      <BlockRenderer blocks={blocks} />
    </div>
  );
}
