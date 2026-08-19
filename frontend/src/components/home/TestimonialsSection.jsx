import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TestimonialCard } from "../cards/TestimonialCard";
import { Button } from "../ui/Button";
import { useQuery } from '@tanstack/react-query';
import { testimonialService } from '@/services/testimonialService';
import { ReviewSubmissionModal } from '@/components/forms/ReviewSubmissionModal';
import { MessageSquarePlus, ArrowRight } from 'lucide-react';

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const { data: testimonialsData, isLoading } = useQuery({
    queryKey: ['public-testimonials'],
    queryFn: () => testimonialService.getTestimonials({ limit: 8 }),
  });

  const testimonials = testimonialsData?.data?.data || testimonialsData?.data?.testimonials || [];

  const nextSlide = () => {
    if (testimonials.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    if (testimonials.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="bg-primary-900 text-neutral-0 py-16 md:py-24 border-b border-primary-800 relative overflow-hidden select-none">
      {/* Background radial highlight */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent-500 via-transparent to-transparent scale-150" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20 flex flex-col items-center relative z-10">
        <div className="h-0.5 w-12 bg-accent-500 mb-4" />
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-300 mb-2">
          Success Stories & Transformations
        </span>
        <h2 className="text-3xl md:text-4xl font-semibold font-serif leading-tight text-neutral-0 mb-14 text-center">
          Stories of Transformation
        </h2>

        {/* Carousel slide container */}
        <div className="w-full max-w-3xl flex flex-col items-center">
          <div className="w-full transition-opacity duration-500 ease-in-out min-h-[300px] flex items-center justify-center">
            {isLoading ? (
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-300"></div>
            ) : testimonials.length > 0 ? (
              <TestimonialCard
                {...testimonials[activeIndex]}
                className="bg-primary-800/40 border-primary-700/50 text-neutral-0 backdrop-blur-xs shadow-xl [&_blockquote]:text-primary-100/90 [&_dd]:text-neutral-0 [&_span]:text-primary-200"
              />
            ) : (
              <div className="text-primary-200">No transformation stories available at this time.</div>
            )}
          </div>

          {/* Dots Indicator & Controls */}
          {testimonials.length > 1 && (
            <div className="flex items-center gap-6 mt-8">
              <button
                type="button"
                onClick={prevSlide}
                className="p-2 rounded-full border border-primary-700/50 hover:bg-primary-800 text-primary-200 hover:text-neutral-0 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-500/40"
                aria-label="Previous story"
              >
                <svg className="w-5 h-5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer
                      ${index === activeIndex ? "bg-accent-500 scale-120" : "bg-primary-700"}
                    `}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={nextSlide}
                className="p-2 rounded-full border border-primary-700/50 hover:bg-primary-800 text-primary-200 hover:text-neutral-0 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-500/40"
                aria-label="Next story"
              >
                <svg className="w-5 h-5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* Action CTAs: Read All & Write a Review */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 w-full sm:w-auto">
            <Button
              variant="outline"
              as={Link}
              to="/testimonials"
              className="border-primary-700/80 text-neutral-100 hover:bg-primary-800 hover:text-white font-semibold px-5 py-2.5 text-sm w-full sm:w-auto"
            >
              Read More Stories <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Button
              variant="gold"
              onClick={() => setIsReviewModalOpen(true)}
              className="font-bold px-5 py-2.5 text-sm w-full sm:w-auto shadow-sm"
            >
              <MessageSquarePlus className="w-4 h-4 mr-2" /> Share Your Experience
            </Button>
          </div>
        </div>
      </div>

      {/* Review Submission Modal */}
      <ReviewSubmissionModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </section>
  );
}
