import React from "react";
import { Accordion, AccordionItem } from "../ui/Accordion";
import { Button } from "../ui/Button";
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';

const fallbackFaqs = [
  { question: "What makes Tejas Academy of Excellence different from other institutions?", answer: "We focus entirely on human excellence, real-world skills, and leadership, avoiding traditional exam-based rote learning methods." },
  { question: "Who can apply for the programs?", answer: "Our programs are designed for ambitious students, working professionals, and entrepreneurs seeking to accelerate their real-world capabilities." },
  { question: "What is the admission selection process?", answer: "Admission is selective, involving an online application screening followed by a personal interview to evaluate motivations and aspirations." },
  { question: "Are scholarships available for students?", answer: "Yes, we offer merit-based and need-based scholarships covering up to 50% of the program enrollment fees." },
  { question: "Are these programs available online or hybrid?", answer: "We offer hybrid models, combining structural online modules with immersive weekend campus sessions to support working individuals." },
];

export function FAQSection() {
  const { data: faqData, isLoading } = useQuery({
    queryKey: ['cms', 'global_faqs'],
    queryFn: () => cmsService.getCmsData('global_faqs'),
    staleTime: 5 * 60 * 1000,
  });

  const categories = faqData?.data?.data?.categories || [];
  
  // Extract all FAQs from all categories and take top 5
  let allFaqs = [];
  categories.forEach(cat => {
    if (cat.faqs && cat.faqs.length > 0) {
      allFaqs = [...allFaqs, ...cat.faqs];
    }
  });

  const displayFaqs = allFaqs.length > 0 ? allFaqs.slice(0, 5) : fallbackFaqs;
  return (
    <section className="bg-neutral-0 py-16 md:py-24 border-b border-neutral-100">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20 flex flex-col items-center">
        <div className="h-0.5 w-12 bg-accent-500 mb-4" />
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-700 mb-2 select-none">
          FAQ
        </span>
        <h2 className="text-3xl md:text-4xl font-semibold font-serif leading-tight text-neutral-900 mb-16 text-center">
          Frequently Asked Questions
        </h2>

        {/* Compact FAQ display */}
        <div className="w-full max-w-3xl">
          {isLoading ? (
            <div className="flex justify-center items-center py-10 w-full">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <Accordion>
              {displayFaqs.map((faq, idx) => (
                <AccordionItem key={idx} title={faq.question}>
                  {faq.answer}
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        <Button
          variant="text"
          onClick={() => window.location.href = "/support"}
          className="mt-8 font-semibold"
        >
          View All Support FAQs
        </Button>
      </div>
    </section>
  );
}
