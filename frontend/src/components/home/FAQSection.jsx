import React from "react";
import { Accordion, AccordionItem } from "../ui/Accordion";
import { Button } from "../ui/Button";
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';

const fallbackFaqs = [
  {
    question: "How does the Tejas academic model cultivate both character and competence?",
    answer: "At Tejas Academy of Excellence, education is built around five dimensions: Intellectual, Character, Emotional, Professional, and Societal Excellence. Beyond technical proficiency, our pedagogy develops critical thinking, emotional fortitude, ethical leadership, and long-term professional capability, preparing graduates to create enduring value."
  },
  {
    question: "What is the Tejas learning methodology and how is practical mastery achieved?",
    answer: "We employ the proven cycle: Knowledge → Practice → Feedback → Iteration → Mastery. Learners engage in active, reflective, and purposefully practical learning through live case challenges, startup clinics, and prototype sprints guided by continuous 1-on-1 executive mentorship."
  },
  {
    question: "How does Tejas integrate Artificial Intelligence into its programs?",
    answer: "Tejas champions a human-centered AI philosophy. We harness AI to accelerate inquiry, simulation, and rapid prototyping, while firmly grounding learners in critical thinking, ethical governance, creativity, and human judgment."
  },
  {
    question: "What kind of mentorship and coaching support do students receive?",
    answer: "Students receive weekly one-on-one coaching from senior leaders and faculty who actively shape thinking, model discipline, provide strategic guidance, and strengthen character alongside professional capability."
  },
  {
    question: "What defines the Tejas graduate identity?",
    answer: "A Tejas graduate is a strategic thinker, data-driven builder, ethical decision-maker, and resilient leader possessing analytical depth, emotional balance, financial literacy, and the courage to serve societal progress."
  },
  {
    question: "What is the admissions process for upcoming academic cohorts?",
    answer: "Admissions are merit-based and evaluate both intellectual capability and leadership potential. Prospective scholars submit an application, participate in an academic and leadership assessment, and complete an interview with our admissions panel."
  }
];

export function FAQSection() {
  const { data: faqData, isLoading } = useQuery({
    queryKey: ['cms', 'global_faqs'],
    queryFn: () => cmsService.getCmsData('global_faqs'),
    staleTime: 5 * 60 * 1000,
  });

  const categories = faqData?.data?.data?.categories || [];
  
  // Extract all FAQs from all categories
  let allFaqs = [];
  categories.forEach(cat => {
    if (cat.faqs && cat.faqs.length > 0) {
      allFaqs = [...allFaqs, ...cat.faqs];
    }
  });

  const displayFaqs = allFaqs.length > 0 ? allFaqs : fallbackFaqs;

  // Generate valid SEO FAQ Schema Markup
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": displayFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="bg-neutral-0 py-16 md:py-24 border-b border-neutral-100" id="homepage-faqs">
      {/* Dynamic SEO FAQ Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

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
