import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MentorCard } from '@/components/cards/MentorCard';
import { useQuery } from '@tanstack/react-query';
import { mentorService } from '@/services/mentorService';

export const Mentors = () => {
  const { data: mentorData, isLoading } = useQuery({
    queryKey: ['public-mentors', 'all'],
    queryFn: () => mentorService.getMentors({ limit: 100 }),
  });

  const mentorList = mentorData?.data?.data || [];
  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <SectionHeader title="Industry Mentors" description="Connect with leaders who guide your professional journey." />
      {isLoading ? (
        <div className="flex justify-center items-center py-20 w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : mentorList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {mentorList.map(mentor => (
            <MentorCard key={mentor.slug || mentor._id} {...mentor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 w-full mt-10">
          No mentors found.
        </div>
      )}
    </div>
  );
};
