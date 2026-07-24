import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MentorCard } from '@/components/cards/MentorCard';
import { useQuery } from '@tanstack/react-query';
import { sanityService } from '@/services/sanityService';
import { SEO } from '@/components/ui/SEO';

export const Mentors = () => {
  const { data: mentorsData, isLoading } = useQuery({
    queryKey: ['sanity', 'mentors'],
    queryFn: () => sanityService.getMentors(),
    staleTime: 5 * 60 * 1000,
  });

  const fallbackMentors = [
    {
      _id: 'm1',
      name: 'Dr. V. R. Sharma',
      role: 'Head of AI & Machine Learning Research',
      department: 'Engineering & Technology',
      bio: 'Former Principal AI Scientist with 18+ years experience leading neural network teams.',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      experienceYears: 18
    },
    {
      _id: 'm2',
      name: 'Prof. Ananya Sen',
      role: 'Director of Executive Management & Strategy',
      department: 'Management',
      bio: 'Ex-McKinsey Strategy Consultant specializing in tech product strategy and scaling.',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      experienceYears: 14
    },
    {
      _id: 'm3',
      name: 'Dr. Rajiv Malhotra',
      role: 'Professor of Cloud Data Architecture',
      department: 'Data Science',
      bio: 'Author of 12+ research papers in Distributed Systems and Cloud Analytics.',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      experienceYears: 16
    }
  ];

  const mentorList = mentorsData && mentorsData.length > 0 ? mentorsData : fallbackMentors;

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
      <SEO 
        title="Faculty & Industry Mentors" 
        description="Learn directly from veteran researchers, tech directors, and corporate leaders guiding your academic trajectory." 
        canonical="https://unlocktejas.com/mentors"
      />
      <SectionHeader 
        title="Faculty & Industry Mentors" 
        description="Learn directly from veteran researchers, tech directors, and corporate leaders guiding your academic trajectory." 
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-20 w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {mentorList.map((mentor) => (
            <MentorCard key={mentor.slug || mentor._id} {...mentor} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Mentors;
