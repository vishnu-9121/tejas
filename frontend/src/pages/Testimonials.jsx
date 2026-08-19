import React, { useState } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TestimonialCard } from '@/components/cards/TestimonialCard';
import { Button } from '@/components/ui/Button';
import { useQuery } from '@tanstack/react-query';
import { testimonialService } from '@/services/testimonialService';
import { ReviewSubmissionModal } from '@/components/forms/ReviewSubmissionModal';
import { MessageSquarePlus } from 'lucide-react';
import { SEO } from '@/components/ui/SEO';

export const Testimonials = () => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const { data: testimonialsData, isLoading } = useQuery({
    queryKey: ['public-testimonials', 'all'],
    queryFn: () => testimonialService.getTestimonials({ limit: 100 }),
  });

  const testimonialsList = testimonialsData?.data?.data || testimonialsData?.data?.testimonials || [];

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Transformations & Student Stories" 
        description="Discover how Tejas Academy of Excellence transforms careers through values, mentorship, and industry-driven degrees."
        url="https://unlocktejas.com/testimonials"
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-neutral-100 pb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-2 block">
            Alumni & Student Transformations
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-neutral-900 tracking-tight">
            Stories of Transformation
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 mt-2 max-w-2xl leading-relaxed">
            Real stories from our graduates and learners who are driving innovation across global tech enterprises.
          </p>
        </div>

        <Button 
          variant="primary" 
          onClick={() => setIsReviewModalOpen(true)}
          className="shrink-0 font-semibold px-5 py-2.5 shadow-sm"
        >
          <MessageSquarePlus className="w-4 h-4 mr-2" /> Share Your Experience
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20 w-full">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : testimonialsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsList.map(testimonial => (
            <TestimonialCard key={testimonial.slug || testimonial._id} {...testimonial} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-neutral-500 w-full bg-neutral-50 rounded-2xl border border-neutral-100">
          <p className="text-base font-semibold text-neutral-700">No testimonials published yet.</p>
          <p className="text-xs text-neutral-500 mt-1">Be the first to share your experience!</p>
          <Button 
            variant="outline" 
            onClick={() => setIsReviewModalOpen(true)}
            className="mt-4 text-xs font-semibold"
          >
            Write a Review
          </Button>
        </div>
      )}

      {/* Review Submission Modal */}
      <ReviewSubmissionModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </div>
  );
};

export default Testimonials;
