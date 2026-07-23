import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TestimonialCard } from '@/components/cards/TestimonialCard';
import { useQuery } from '@tanstack/react-query';
import { testimonialService } from '@/services/testimonialService';

export const Testimonials = () => {
  const { data: testimonialsData, isLoading } = useQuery({
    queryKey: ['public-testimonials', 'all'],
    queryFn: () => testimonialService.getTestimonials({ limit: 100 }),
  });

  const testimonialsList = testimonialsData?.data?.data || [];
  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <SectionHeader title="Alumni Success Stories" description="Hear from our graduates who are making waves." />
      {isLoading ? (
        <div className="flex justify-center items-center py-20 w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : testimonialsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {testimonialsList.map(testimonial => (
            <TestimonialCard key={testimonial.slug || testimonial._id} {...testimonial} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 w-full mt-10">
          No testimonials found.
        </div>
      )}
    </div>
  );
};
