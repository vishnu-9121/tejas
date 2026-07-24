import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { NewsletterForm } from "../forms/NewsletterForm";
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';

export function FinalCTA() {
  const { data: cmsData } = useQuery({
    queryKey: ['cms', 'homepage'],
    queryFn: () => cmsService.getCmsData('homepage'),
    staleTime: 5 * 60 * 1000,
  });

  const cta = cmsData?.data?.data?.footerCta || {
    title: 'Begin Your Journey of Excellence',
    subtitle: 'Apply to our upcoming batch and join a community of highly ambitious leaders, innovators, and entrepreneurs.',
    buttonText: 'Apply for Admissions',
    buttonLink: '/admissions'
  };
  return (
    <section className="bg-primary-900 text-neutral-0 select-none">
      {/* Main CTA banner */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20 py-20 flex flex-col items-center text-center gap-6 border-b border-primary-800">
        <h2 className="text-3xl md:text-5xl font-semibold font-serif leading-tight">
          {cta.title}
        </h2>
        <p className="text-base md:text-lg text-primary-100/80 leading-relaxed max-w-xl">
          {cta.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto justify-center">
          <Button
            variant="gold"
            size="lg"
            onClick={() => window.location.href = cta.buttonLink}
            rightIcon={<ArrowRight />}
            className="font-semibold shadow-md"
          >
            {cta.buttonText}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => window.location.href = "/contact"}
            className="font-semibold"
          >
            Talk to an Advisor
          </Button>
        </div>
      </div>

      {/* Newsletter Block */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20 py-16 flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-2 max-w-md">
          <h3 className="text-xl md:text-2xl font-serif font-semibold">
            Subscribe to Tejas Insights
          </h3>
          <p className="text-sm text-primary-100/70 leading-relaxed">
            Receive monthly perspectives on leadership, career ready skills, and entrepreneurship research directly in your inbox.
          </p>
        </div>
        <div className="w-full max-w-[480px]">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
