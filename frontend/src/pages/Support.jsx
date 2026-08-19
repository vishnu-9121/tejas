import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, HelpCircle, Phone, Mail, MessageCircle, ChevronRight, BookOpen, Layers } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { SEO } from '@/components/ui/SEO';
import { cmsService } from '@/services/cmsService';
import { sanityService } from '@/services/sanityService';
import { Button } from '@/components/ui/Button';

// Default / fallback 30 FAQs across 10 official categories
const FALLBACK_FAQS = [
  // 1. GENERAL INFORMATION
  {
    question: "What is Tejas Academy of Excellence?",
    answer: "Tejas Academy of Excellence is an institution dedicated to cultivating Human Excellence across intellectual, character, emotional, professional, and societal dimensions. Guided by the motto \"Valour in Heart. Discipline in Habit. Vigilance in Mind. Resilience in Spirit.\", our mission is to ignite the spark of brilliance in every learner through active, reflective, and purposefully practical learning, developing leaders who embody character and competence.",
    category: "General Information",
    order: 1
  },
  {
    question: "What kind of programmes does Tejas Academy offer?",
    answer: "We offer a diverse range of learning experiences, including:\n• Certificate programmes\n• Professional skill-development programmes\n• Live online courses\n• Workshops and masterclasses\n• Leadership and management programmes\n• Career and employability programmes\n• Business and entrepreneurship programmes\n• Financial literacy and wealth-creation programmes\n• Digital and AI-focused programmes\n• Corporate training\n• College and institutional programmes\n\nOur programme portfolio evolves based on emerging industry, career, and societal needs, offering flexible 45-day, 90-day, 180-day, and 1-year duration options for selected tracks.",
    category: "General Information",
    order: 2
  },
  {
    question: "Who can join Tejas Academy programmes?",
    answer: "Our programmes are designed for different learner groups, including:\n• College students\n• Graduates\n• Working professionals\n• Entrepreneurs\n• Aspiring managers and leaders\n• Career switchers\n• Educators and trainers\n• Young professionals\n• Individuals seeking personal and professional development\n\nEligibility varies depending on the specific programme.",
    category: "General Information",
    order: 3
  },
  {
    question: "Do I need prior experience to join?",
    answer: "Not necessarily. Several of our foundational programmes are specifically designed for beginners.\n\nEach programme clearly specifies its eligibility requirements, prerequisites, and expected level of knowledge before enrolment.",
    category: "General Information",
    order: 4
  },

  // 2. LEARNING FORMAT & EXPERIENCE
  {
    question: "Are Tejas Academy programmes online or offline?",
    answer: "We offer both online and offline learning formats, depending on the programme.\n\nOur online programmes may include live interactive classes, recorded learning resources, assignments, activities, discussions, assessments, and mentoring.\n\nOffline programmes may include classroom sessions, workshops, experiential activities, institutional programmes, and practical projects.",
    category: "Learning Format & Experience",
    order: 5
  },
  {
    question: "Are the classes live or pre-recorded?",
    answer: "This depends on the programme.\n\nOur live programmes are designed to encourage interaction, discussion, practical activities, doubt clarification, and application of concepts. Some programmes may also include recorded resources that participants can access for revision.\n\nThe exact learning format is mentioned on each programme page.",
    category: "Learning Format & Experience",
    order: 6
  },
  {
    question: "Do the programmes include practical activities?",
    answer: "Yes. Wherever appropriate, our programmes incorporate practical learning through:\n• Case studies\n• Activities\n• Capstone projects\n• Simulations\n• Exercises\n• Assignments\n• Group discussions\n• Problem-solving tasks\n• Real-world scenarios\n\nOur objective is not simply to provide information but to help learners convert knowledge into usable capability.",
    category: "Learning Format & Experience",
    order: 7
  },
  {
    question: "Will I get mentorship or doubt-clearing support?",
    answer: "Support varies by programme.\n\nSelected programmes may include live doubt-clearing, dedicated one-on-one mentoring sessions, faculty interaction, personalized feedback, or structured learner community support.\n\nThe exact support available will be communicated before enrolment.",
    category: "Learning Format & Experience",
    order: 8
  },
  {
    question: "What if I miss a live session?",
    answer: "This depends on the programme.\n\nWhere recordings are provided, participants may be able to access the missed session for revision. However, certain activities, assessments, workshops, or interactive sessions may require live participation.\n\nPlease check the attendance and recording policy of the specific programme.",
    category: "Learning Format & Experience",
    order: 9
  },
  {
    question: "How much time should I dedicate to a programme?",
    answer: "The required time depends on the programme's duration, number of sessions, activities, and assignments (typically averaging approximately 5–8 hours per week for standard certificate modules).\n\nWe recommend that participants consider not only class hours but also the time required for practice, assignments, reflection, and project work.",
    category: "Learning Format & Experience",
    order: 10
  },

  // 3. ENROLMENT & REGISTRATION
  {
    question: "How do I enrol in a programme?",
    answer: "You can explore the programmes available on our website, review the eligibility, curriculum, duration, fees, and learning format, and then proceed through the registration/enquiry process provided for that programme.\n\nFor programmes requiring selection or screening, participants may need to complete an application process.",
    category: "Enrolment & Registration",
    order: 11
  },
  {
    question: "What happens after I register?",
    answer: "After registration, you will receive the relevant programme information, which may include:\n• Confirmation of registration\n• Programme schedule\n• Joining instructions and portal onboarding\n• Learning resources\n• Communication-channel details and cohort groups\n• Orientation information\n• Requirements for participation\n\nProgramme-specific instructions will be shared before commencement.",
    category: "Enrolment & Registration",
    order: 12
  },
  {
    question: "Can I enroll in multiple programmes?",
    answer: "Yes, provided you meet the eligibility requirements and can manage the schedules and workload of the programmes.",
    category: "Enrolment & Registration",
    order: 13
  },
  {
    question: "What if I am unsure which programme is right for me?",
    answer: "You can contact our team with information about your current stage, interests, career objectives, and learning goals.\n\nWe can help you identify the programme that best matches your needs.",
    category: "Enrolment & Registration",
    order: 14
  },

  // 4. CERTIFICATION & ASSESSMENT
  {
    question: "Will I receive a certificate?",
    answer: "Certificate availability depends on the programme.\n\nWhere applicable, participants who satisfy the programme's attendance, assessment, assignment, or completion requirements will receive a verified certificate from Tejas Academy of Excellence.\n\nSpecific certification details are provided on the respective programme page.",
    category: "Certification & Assessment",
    order: 15
  },
  {
    question: "Is the certificate recognised?",
    answer: "Our certificates are intended to document participation and successful completion of the relevant Tejas Academy programme.\n\nThe professional value of a certificate depends on the programme, learning outcomes, assessment process, and the participant's ability to demonstrate the skills acquired.\n\nWe encourage learners to view certification as a complement to actual capability, projects, experience, and demonstrated competence.",
    category: "Certification & Assessment",
    order: 16
  },
  {
    question: "Are there assignments or assessments?",
    answer: "Some programmes include assignments, projects, quizzes, assessments, presentations, or other evaluation methods.\n\nAssessment requirements vary according to the learning objectives of each programme.",
    category: "Certification & Assessment",
    order: 17
  },

  // 5. CAREER & PROFESSIONAL DEVELOPMENT
  {
    question: "Are Tejas Academy programmes useful for career development?",
    answer: "Yes. Our programmes are designed with practical application and career relevance in mind.\n\nDepending on the programme, participants may develop skills related to communication, public speaking, leadership, business strategy, financial discipline, digital technologies, AI adoption, time management, analytical thinking, entrepreneurship, management, or employability.",
    category: "Career & Professional Development",
    order: 18
  },
  {
    question: "Can working professionals join Tejas Academy programmes?",
    answer: "Yes. Many programmes are designed to accommodate students and working professionals through flexible weekend or evening schedules.\n\nProgramme schedules and delivery formats vary, so participants should review the specific programme schedule before enrolling.",
    category: "Career & Professional Development",
    order: 19
  },
  {
    question: "How is Tejas Academy different from conventional learning platforms?",
    answer: "Tejas Academy focuses on connecting knowledge with application through a dedicated \"knowledge-to-application\" methodology.\n\nOur approach aims to combine structured learning with practical activities, real-world scenarios, critical thinking, reflection, and capability development.\n\nThe objective is not merely to complete a course, but to help learners become more capable, confident, and professionally relevant.",
    category: "Career & Professional Development",
    order: 20
  },

  // 6. INSTITUTIONAL & CORPORATE PROGRAMS
  {
    question: "Can colleges collaborate with Tejas Academy?",
    answer: "Yes.\n\nTejas Academy can collaborate with educational institutions through initiatives such as:\n• Student development programmes\n• Faculty development initiatives\n• Workshops and masterclasses\n• Certification programmes\n• Career-readiness initiatives\n• Entrepreneurship incubation\n• Industry-oriented training\n• Institutional skill-development programmes\n• Seminars and conferences\n\nInstitutions can contact us to discuss a customised collaboration.",
    category: "Institutional & Corporate Programs",
    order: 21
  },
  {
    question: "Does Tejas Academy work with companies and organisations?",
    answer: "Yes. We can design learning and capability-building interventions for organisations based on their requirements.\n\nPotential areas include leadership, communication, workplace effectiveness, AI adoption, management skills, business skills, employee development, and other professional capabilities.",
    category: "Institutional & Corporate Programs",
    order: 22
  },
  {
    question: "Can a programme be customised for our institution or organisation?",
    answer: "Yes.\n\nCustomised programmes can be developed based on factors such as:\n• Target audience\n• Learning objectives\n• Duration\n• Skill requirements\n• Industry context\n• Delivery format\n• Assessment requirements\n• Expected outcomes\n\nOrganisations and institutions can contact our team to discuss their requirements.",
    category: "Institutional & Corporate Programs",
    order: 23
  },

  // 7. WORKSHOPS & PROGRAM TYPES
  {
    question: "Are there free programmes or workshops?",
    answer: "From time to time, Tejas Academy may offer introductory workshops, orientation sessions, trial modules, community initiatives, or selected learning experiences at no cost.\n\nAvailability depends on the programme and current initiatives.",
    category: "Workshops & Program Types",
    order: 24
  },
  {
    question: "What is the difference between a workshop, course, and certificate programme?",
    answer: "A workshop is generally shorter and focused on introducing or developing a specific skill or topic.\n\nA course provides more structured learning over a defined period and may include multiple sessions, activities, and assessments.\n\nA certificate programme generally follows a structured curriculum and may include defined completion or assessment requirements leading to certification.\n\nThe exact structure varies by programme.",
    category: "Workshops & Program Types",
    order: 25
  },

  // 8. FEES & POLICIES
  {
    question: "How are programme fees determined?",
    answer: "Fees depend on factors such as programme duration, depth of curriculum, delivery format, faculty involvement, mentoring, assessments, learning resources, and certification.\n\nThe applicable fee will be displayed or communicated transparently for each programme.",
    category: "Fees & Policies",
    order: 26
  },
  {
    question: "Is there a refund or cancellation policy?",
    answer: "Each programme may have its own cancellation, transfer, and refund terms.\n\nParticipants should review the applicable terms and conditions before making payment.",
    category: "Fees & Policies",
    order: 27
  },

  // 9. TECHNICAL & ACCESS
  {
    question: "Do I need to purchase any special software or equipment?",
    answer: "Most programmes require only basic access to a suitable device (such as a laptop, desktop, or tablet) and a reliable internet connection.\n\nIf a programme requires specific software, tools, books, or other resources, those requirements will be communicated before or during enrolment.",
    category: "Technical & Access",
    order: 28
  },

  // 10. SUPPORT & CONTACT
  {
    question: "How can I contact Tejas Academy?",
    answer: "You can contact our team through the enquiry/contact channels provided on our website, email support@unlocktejas.com, or reach out via official calling/WhatsApp helpline at +91 83310 51327.\n\nFor programme-specific enquiries, please mention the programme name so that our team can assist you efficiently.",
    category: "Support & Contact",
    order: 29
  },
  {
    question: "What is the philosophy behind Tejas Academy of Excellence?",
    answer: "We believe meaningful education should go beyond information.\n\nOur focus is on developing individuals who can think clearly, act responsibly, solve real problems, adapt to change, and create meaningful value.\n\nTejas Academy aims to build a culture of continuous learning, practical excellence, leadership, and responsible growth.",
    category: "Support & Contact",
    order: 30
  }
];

export const Support = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Query FAQ data from Sanity / CMS
  const { data: faqData, isLoading } = useQuery({
    queryKey: ['cms', 'all_support_faqs'],
    queryFn: async () => {
      try {
        const sanityFaqs = await sanityService.getFaqs();
        if (Array.isArray(sanityFaqs) && sanityFaqs.length >= 10) {
          return sanityFaqs;
        }
      } catch (err) {
        console.warn('[Support] Sanity fetch error, checking backend CMS:', err.message);
      }

      const res = await cmsService.getCmsData('global_faqs');
      const cats = res?.data?.data?.categories || res?.data?.categories || [];
      let flat = [];
      cats.forEach(c => {
        if (c.faqs && Array.isArray(c.faqs)) {
          c.faqs.forEach(f => {
            flat.push({
              ...f,
              category: f.category || c.name || 'General Information'
            });
          });
        }
      });
      return flat.length > 0 ? flat : FALLBACK_FAQS;
    },
    staleTime: 5 * 60 * 1000,
  });

  const rawFaqs = Array.isArray(faqData) && faqData.length > 0 ? faqData : FALLBACK_FAQS;

  // Extract unique categories preserving official order
  const categories = useMemo(() => {
    const defaultOrder = [
      'All',
      'General Information',
      'Learning Format & Experience',
      'Enrolment & Registration',
      'Certification & Assessment',
      'Career & Professional Development',
      'Institutional & Corporate Programs',
      'Workshops & Program Types',
      'Fees & Policies',
      'Technical & Access',
      'Support & Contact'
    ];
    return defaultOrder;
  }, []);

  // Filter FAQs by Category and Search Term
  const filteredFaqs = useMemo(() => {
    return rawFaqs.filter(faq => {
      const matchesCategory = selectedCategory === 'All' || 
        faq.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === 'Learning Format & Experience' && (faq.category?.includes('Learning') || faq.category?.includes('Format')));

      const q = (faq.question || '').toLowerCase();
      const a = (faq.answer || '').toLowerCase();
      const s = searchQuery.toLowerCase().trim();

      const matchesSearch = !s || q.includes(s) || a.includes(s);

      return matchesCategory && matchesSearch;
    });
  }, [rawFaqs, selectedCategory, searchQuery]);

  // Group by category if "All" is selected
  const groupedFaqs = useMemo(() => {
    if (selectedCategory !== 'All' || searchQuery) {
      return [{ category: selectedCategory === 'All' ? 'Search Results' : selectedCategory, items: filteredFaqs }];
    }

    const groups = {};
    categories.filter(c => c !== 'All').forEach(cat => {
      groups[cat] = [];
    });

    filteredFaqs.forEach(faq => {
      const cat = faq.category || 'General Information';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(faq);
    });

    return Object.keys(groups)
      .filter(cat => groups[cat].length > 0)
      .map(cat => ({
        category: cat,
        items: groups[cat]
      }));
  }, [filteredFaqs, selectedCategory, searchQuery, categories]);

  // Dynamic SEO Structured Data (FAQPage schema)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": filteredFaqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 py-12 md:py-20">
      <SEO
        title="Support & FAQs"
        description="Comprehensive support & help centre for Tejas Academy of Excellence. Find official answers regarding our programmes, admissions, certifications, schedules, and learning format."
        url="https://unlocktejas.com/support"
        schema={faqSchema}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100/80 text-primary-800 text-xs font-semibold uppercase tracking-wider mb-4 border border-primary-200/50">
            <HelpCircle className="w-3.5 h-3.5" />
            Support & Help Centre
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-neutral-900 tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-neutral-600 text-base md:text-lg leading-relaxed">
            Find answers to common questions about our programmes, admissions, learning formats, certifications, and institutional partnerships.
          </p>

          {/* Search Bar */}
          <div className="relative mt-8 max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              aria-label="Search FAQs by keyword"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword (e.g. certificate, live sessions, fees)..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-500 hover:text-neutral-700 bg-neutral-100 px-2 py-1 rounded-md"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar justify-start md:justify-center flex-nowrap md:flex-wrap">
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            const count = category === 'All' 
              ? rawFaqs.length 
              : rawFaqs.filter(f => f.category?.toLowerCase() === category.toLowerCase()).length;

            return (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setSearchQuery('');
                }}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-neutral-900 text-neutral-0 shadow-sm'
                    : 'bg-neutral-0 text-neutral-700 hover:bg-neutral-100 border border-neutral-200/80'
                }`}
              >
                {category}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-neutral-800 text-neutral-200' : 'bg-neutral-100 text-neutral-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* FAQs Content */}
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-3"></div>
            <p className="text-sm text-neutral-500 font-medium">Loading support FAQs...</p>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="py-16 text-center bg-neutral-0 border border-neutral-200 rounded-2xl p-8">
            <HelpCircle className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">No matching questions found</h3>
            <p className="text-sm text-neutral-500 mb-6">
              Try searching with different keywords or browse through our official categories.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-10">
            {groupedFaqs.map((group, gIdx) => (
              <div key={gIdx} className="bg-neutral-0 rounded-2xl border border-neutral-200/90 shadow-sm p-6 md:p-8">
                {selectedCategory === 'All' && !searchQuery && (
                  <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-neutral-100">
                    <Layers className="w-5 h-5 text-accent-600" />
                    <h2 className="text-xl md:text-2xl font-serif font-semibold text-neutral-900">
                      {group.category}
                    </h2>
                    <span className="text-xs font-semibold text-neutral-400 ml-auto">
                      {group.items.length} {group.items.length === 1 ? 'Question' : 'Questions'}
                    </span>
                  </div>
                )}

                <Accordion>
                  {group.items.map((faq, idx) => (
                    <AccordionItem key={faq._id || idx} id={`faq-${group.category}-${idx}`} title={faq.question}>
                      <div className="whitespace-pre-line text-neutral-700 leading-relaxed pt-1">
                        {faq.answer}
                      </div>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        )}

        {/* Contact & Support Help Desk Card */}
        <div className="mt-16 bg-gradient-to-br from-neutral-900 to-neutral-800 text-neutral-0 rounded-2xl p-8 md:p-10 shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-accent-400 mb-2 block">
                Direct Helpdesk & Inquiries
              </span>
              <h3 className="text-2xl md:text-3xl font-serif font-bold mb-2">
                Still have unanswered questions?
              </h3>
              <p className="text-neutral-300 text-sm md:text-base max-w-xl">
                Our academic counselors and support specialists are available to guide you on programme selection, admissions, and institutional collaborations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <a
                href="https://wa.me/918331051327"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-neutral-0 font-medium text-sm transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Chat
              </a>
              <a
                href="mailto:support@unlocktejas.com"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-neutral-0/10 hover:bg-neutral-0/20 text-neutral-0 font-medium text-sm transition-all border border-neutral-700"
              >
                <Mail className="w-4 h-4" />
                Email Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
