import React from "react";
import { MentorCard } from "../cards/MentorCard";
import { Button } from "../ui/Button";
import { useQuery } from '@tanstack/react-query';
import { mentorService } from '@/services/mentorService';

export function PeopleSection() {
  const { data: mentorData, isLoading: isLoadingMentors } = useQuery({
    queryKey: ['public-mentors', { limit: 3 }],
    queryFn: () => mentorService.getMentors({ limit: 3 }),
  });

  const mentorList = mentorData?.data?.data || [];

  return (
    <section className="bg-neutral-0 py-16 md:py-24 border-b border-neutral-100">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20 flex flex-col items-center">
        <div className="h-0.5 w-12 bg-accent-500 mb-4" />
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-700 mb-2 select-none">
          Industry Leaders
        </span>
        <h2 className="text-3xl md:text-4xl font-semibold font-serif leading-tight text-neutral-900 mb-10 text-center">
          Learn from Global Innovators
        </h2>

        <div className="flex flex-col items-center w-full">
          {isLoadingMentors ? (
             <div className="flex justify-center items-center py-20 w-full">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
             </div>
          ) : mentorList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {mentorList.map((men) => (
                <MentorCard key={men.slug || men._id} {...men} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 w-full">
              No mentors found.
            </div>
          )}
          <Button
            variant="secondary"
            size="md"
            onClick={() => window.location.href = "/mentors"}
            className="mt-12 font-semibold"
          >
            Meet All Mentors
          </Button>
        </div>
      </div>
    </section>
  );
}
