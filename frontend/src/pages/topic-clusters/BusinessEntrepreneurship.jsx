import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, TrendingUp, Lightbulb, Target, 
  CheckCircle2, ArrowRight, ShieldCheck, Award, 
  Users, BookOpen, Sparkles, Building 
} from 'lucide-react';
import { SEO } from '@/components/ui/SEO';
import { Button } from '@/components/ui/Button';

export default function BusinessEntrepreneurship() {
  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOccupationalProgram",
        "name": "Business & Entrepreneurship Education Program",
        "description": "Comprehensive capability-building curriculum in venture architecture, business strategy, startup planning, and entrepreneurial leadership.",
        "provider": {
          "@type": "EducationalOrganization",
          "name": "Tejas Academy of Excellence",
          "url": "https://unlocktejas.com"
        },
        "url": "https://unlocktejas.com/business-entrepreneurship"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://unlocktejas.com/" },
          { "@type": "ListItem", "position": 2, "name": "Business & Entrepreneurship", "item": "https://unlocktejas.com/business-entrepreneurship" }
        ]
      }
    ]
  };

  const coreModules = [
    {
      icon: Lightbulb,
      title: "Idea Validation & Venture Ideation",
      desc: "Systematic frameworks to evaluate market needs, customer discovery, unit economics, and competitive defensibility before writing code."
    },
    {
      icon: Target,
      title: "Business Model Design & Strategy",
      desc: "Master lean canvas architecture, value proposition design, customer acquisition economics, and scalable go-to-market strategies."
    },
    {
      icon: TrendingUp,
      title: "Financial Architecture & Unit Economics",
      desc: "Learn cash flow forecasting, pricing strategy, working capital management, valuation fundamentals, and investor readiness."
    },
    {
      icon: Building,
      title: "Operational Scaling & Legal Frameworks",
      desc: "Understand corporate governance, intellectual property protection, compliance, team hiring, and operational execution."
    }
  ];

  const outcomes = [
    "Develop an entrepreneurial mindset focused on solving high-value economic problems.",
    "Formulate bankable business models with realistic financial unit economics.",
    "Present strategic venture proposals to investors and corporate partners with clarity.",
    "Integrate modern AI productivity tools directly into daily business workflows."
  ];

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        pageKey="business-entrepreneurship"
        title="Business & Entrepreneurship Programs | Tejas Academy"
        description="Master business strategy, venture building, startup planning, financial modeling, and entrepreneurial execution at Tejas Academy of Excellence."
        canonical="https://unlocktejas.com/business-entrepreneurship"
        keywords="Business and Entrepreneurship, Entrepreneurship School, Startup Education, Business Strategy, Entrepreneurial Leadership, Business Skills for Students"
        schema={pageSchema}
      />

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-4">
          <Briefcase className="w-3.5 h-3.5 text-amber-600" />
          Venture Leadership & Innovation
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-neutral-900 tracking-tight mb-6">
          Business & Entrepreneurship Education
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
          At Tejas Academy of Excellence, we prepare aspiring founders, innovators, and business leaders with actionable capabilities, analytical rigor, and strategic execution to build enduring enterprises.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button variant="primary" size="lg" as={Link} to="/admissions" className="shadow-md">
            Apply for Cohort
          </Button>
          <Button variant="outline" size="lg" as={Link} to="/programs">
            Explore All Programs
          </Button>
        </div>
      </div>

      {/* Core Competencies Grid */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">
            Core Pillars of Entrepreneurial Mastery
          </h2>
          <p className="text-neutral-600 mt-2 max-w-2xl mx-auto text-sm sm:text-base">
            From opportunity discovery to operational resilience, our curriculum bridges theoretical concepts with real-world case simulations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreModules.map((m, idx) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 bg-white rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-all hover:border-primary-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-700 mb-5">
                  <m.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2.5">{m.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Learning Outcomes & Methodology */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 bg-neutral-50 rounded-3xl p-8 sm:p-12 border border-neutral-200/70">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary-700">Capabilities Cultivated</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-neutral-900 mt-2 mb-6">
            What You Build & Master
          </h2>
          <ul className="space-y-4">
            {outcomes.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-neutral-700 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Incubation & Applied Mentorship
            </h3>
            <p className="text-sm text-neutral-600">
              Students receive structured 1-on-1 mentorship from executive entrepreneurs, participate in pitch simulations, and test venture prototypes.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-primary-600" />
              Cross-Disciplinary Integration
            </h3>
            <p className="text-sm text-neutral-600">
              Combine business strategy with modern AI literacy, financial analysis, and ethical leadership to build resilient organizations.
            </p>
          </div>
        </div>
      </div>

      {/* Internal Topic Cluster Links */}
      <div className="border-t border-neutral-200 pt-12">
        <h3 className="text-lg font-bold text-neutral-900 mb-4 text-center">
          Explore Connected Academic Capabilities
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/leadership-development" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-primary-600 hover:text-primary-700 transition-colors">
            Leadership Development →
          </Link>
          <Link to="/financial-literacy" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-primary-600 hover:text-primary-700 transition-colors">
            Financial Literacy →
          </Link>
          <Link to="/ai-literacy" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-primary-600 hover:text-primary-700 transition-colors">
            AI Literacy →
          </Link>
          <Link to="/career-readiness" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-primary-600 hover:text-primary-700 transition-colors">
            Career Readiness →
          </Link>
        </div>
      </div>
    </div>
  );
}
