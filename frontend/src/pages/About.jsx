import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, Award, Users, Compass, 
  CheckCircle2, ArrowRight, ShieldCheck, 
  Sparkles, Target, Briefcase, Cpu, Zap, 
  GraduationCap, TrendingUp, Heart, Mail, PhoneCall, MapPin 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';
import { SEO } from '@/components/ui/SEO';
import { Button } from '@/components/ui/Button';

export const About = () => {
  const { data: cmsResponse } = useQuery({
    queryKey: ['cms', 'about'],
    queryFn: () => cmsService.getCmsData('about'),
    staleTime: 60 * 1000,
  });

  const cmsData = cmsResponse?.data?.publishedData || cmsResponse?.data?.data || cmsResponse?.data;
  const overview = cmsData?.overview || {};
  const timeline = cmsData?.timeline || [
    { year: '2020', title: 'Foundation & Academic Charter', description: 'Established with our inaugural cohort in modern technology, management, and capability development.' },
    { year: '2022', title: 'Capability Labs Expansion', description: 'Inaugurated dedicated research laboratories in Artificial Intelligence and applied business strategy.' },
    { year: '2024', title: 'Institutional Collaborations', description: 'Forged training and certification partnerships with colleges, universities, and enterprise councils.' },
    { year: '2026', title: 'Advanced Learning Ecosystem', description: 'Expanded executive cohort tracks, hybrid delivery, and live enterprise project incubation.' }
  ];

  const entitySchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": "https://unlocktejas.com/#organization",
        "name": "Tejas Academy of Excellence Private Limited",
        "legalName": "Tejas Academy of Excellence Private Limited",
        "alternateName": ["Tejas Academy of Excellence", "Tejas Academy"],
        "url": "https://unlocktejas.com",
        "logo": "https://unlocktejas.com/logo.png",
        "description": "Tejas Academy of Excellence is an education and skill-development organization focused on business, entrepreneurship, leadership, AI literacy, career readiness, future skills, financial literacy, and human excellence.",
        "email": "support@unlocktejas.com",
        "telephone": "+91 83310 51327",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Beside L K Towers, Roy Nagar",
          "addressLocality": "Gannavaram, Vijayawada, Amaravathi",
          "postalCode": "521101",
          "addressRegion": "Andhra Pradesh",
          "addressCountry": "IN"
        },
        "sameAs": [
          "https://twitter.com/unlocktejas",
          "https://linkedin.com/company/unlocktejas",
          "https://instagram.com/unlocktejas",
          "https://youtube.com/@unlocktejas",
          "https://facebook.com/unlocktejas"
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://unlocktejas.com/" },
          { "@type": "ListItem", "position": 2, "name": "About Us", "item": "https://unlocktejas.com/about" }
        ]
      }
    ]
  };

  const focusAreas = [
    { icon: Briefcase, title: "Business & Entrepreneurship", link: "/business-entrepreneurship", desc: "Venture ideation, financial modeling, startup scaling, and business strategy." },
    { icon: Compass, title: "Leadership Development", link: "/leadership-development", desc: "Principled decision-making, team alignment, crisis management, and ethical governance." },
    { icon: Cpu, title: "AI Literacy & DeepTech", link: "/ai-literacy", desc: "Applied generative AI, prompt architecture, LLM agent workflows, and algorithmic ethics." },
    { icon: GraduationCap, title: "Career Readiness", link: "/career-readiness", desc: "Technical competence benchmarks, portfolio defense, STAR interview mastery, and workplace agility." },
    { icon: Zap, title: "Future Skills", link: "/future-skills", desc: "Complex problem-solving, systems thinking, digital fluency, and cognitive adaptability." },
    { icon: Target, title: "Employability Skills", link: "/employability-skills", desc: "Executive business communication, teamwork, time accountability, and agile sprint operations." },
    { icon: TrendingUp, title: "Financial Literacy", link: "/financial-literacy", desc: "Personal finance, asset allocation, capital markets, valuation fundamentals, and wealth architecture." },
    { icon: Heart, title: "Human Excellence", link: "/human-excellence", desc: "Holistic 5-dimensional mastery: Intellectual, Character, Emotional, Professional, and Societal excellence." }
  ];

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        pageKey="about"
        title="About Tejas Academy of Excellence | Academic Vision & Heritage" 
        description="Tejas Academy of Excellence is an education and skill-development organization focused on business, entrepreneurship, leadership, AI literacy, career readiness, future skills, financial literacy, and human excellence."
        canonical="https://unlocktejas.com/about"
        keywords="About Tejas Academy, Tejas Academy of Excellence Private Limited, Tejas Leadership, Academic Philosophy, Gannavaram Campus"
        schema={entitySchema}
      />

      {/* Hero Entity Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-800 text-xs font-bold uppercase tracking-wider mb-4">
          <Building2 className="w-3.5 h-3.5 text-primary-600" />
          Tejas Academy of Excellence Private Limited
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-neutral-900 tracking-tight mb-6">
          About Tejas Academy of Excellence
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
          Tejas Academy of Excellence is an education and skill-development institution dedicated to bridging the gap between academic theory and real-world capability in business, entrepreneurship, leadership, AI literacy, career readiness, and human excellence.
        </p>
      </div>

      {/* Entity Factual Breakdown (AI & Human Readable) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="p-8 bg-white rounded-3xl border border-neutral-200/80 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700 mb-5">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-3">Who We Are</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Tejas Academy of Excellence Private Limited is a registered educational institution operating in Gannavaram, Amaravathi, Andhra Pradesh, India. We are built on the foundational philosophy of Human Excellence: Character + Competence.
          </p>
        </div>

        <div className="p-8 bg-white rounded-3xl border border-neutral-200/80 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 mb-5">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-3">What We Do</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            We deliver structured capability-development programs, applied AI labs, entrepreneurship bootcamps, and executive leadership cohorts combining practical simulations, mentor feedback, and real-world capstone projects.
          </p>
        </div>

        <div className="p-8 bg-white rounded-3xl border border-neutral-200/80 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-700 mb-5">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-3">Who We Serve</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Our programs empower undergraduate students, postgraduates, working professionals, startup founders, and partner colleges seeking institutional capacity building and modern curriculum integration.
          </p>
        </div>
      </div>

      {/* Core Focus Areas / Topic Clusters */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-700">Curricular Breadth</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 mt-2">
            Our Core Capability Clusters
          </h2>
          <p className="text-neutral-600 mt-2 max-w-2xl mx-auto text-sm sm:text-base">
            Structured learning pathways engineered for compounding personal and professional capability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {focusAreas.map((fa) => (
            <Link
              key={fa.title}
              to={fa.link}
              className="p-6 bg-white rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-md hover:border-primary-400 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-neutral-50 group-hover:bg-primary-50 flex items-center justify-center text-neutral-700 group-hover:text-primary-700 mb-4 transition-colors">
                  <fa.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 group-hover:text-primary-700 transition-colors mb-2">
                  {fa.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{fa.desc}</p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-primary-700 group-hover:translate-x-1 transition-transform">
                Explore Track <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Institutional Mission, Vision & 6 Virtues CTA */}
      <div className="bg-neutral-900 text-white rounded-3xl p-8 sm:p-12 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Institutional Charter</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-2 mb-4">
              Valour • Discipline • Vigilance • Resilience
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-6">
              Our academic model is guided by the 6 Foundational Virtues: Integrity, Discipline, Courage, Curiosity, Service, and Excellence. We believe character compounds with competence to produce enduring societal leadership.
            </p>
            <Button variant="gold" as={Link} to="/about/vision-mission" className="shadow-sm">
              Read Academic Philosophy & Virtues
            </Button>
          </div>
          <div className="space-y-4">
            <div className="p-5 bg-neutral-800/90 rounded-2xl border border-neutral-700">
              <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" /> Our Purpose
              </h3>
              <p className="text-xs text-neutral-300">
                To develop visionary individuals who embody intellectual innovation, emotional balance, ethical responsibility, and courageous leadership.
              </p>
            </div>
            <div className="p-5 bg-neutral-800/90 rounded-2xl border border-neutral-700">
              <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" /> Our Pedagogy
              </h3>
              <p className="text-xs text-neutral-300">
                Knowledge → Practice → Feedback → Iteration → Mastery. Active problem solving replacing passive lecture consumption.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      {timeline.length > 0 && (
        <div className="mb-20 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-700">Institutional Milestones</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 mt-2">
              Our Growth Journey
            </h2>
          </div>
          <div className="space-y-6">
            {timeline.map((item, idx) => (
              <div key={idx} className="flex gap-6 items-start bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="text-2xl sm:text-3xl font-extrabold text-primary-700 shrink-0 font-serif w-16">{item.year}</div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-1.5">{item.title}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Official Location & Entity Contact */}
      <div className="bg-neutral-50 rounded-3xl p-8 sm:p-12 border border-neutral-200/80">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-serif font-bold text-neutral-900">
            Official Institution Details & Campus Desk
          </h2>
          <p className="text-sm text-neutral-600 mt-2">
            For academic inquiries, program admissions, or institutional partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-white rounded-2xl border border-neutral-200/80">
            <MapPin className="w-6 h-6 text-primary-700 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-neutral-900 mb-1">Campus Location</h3>
            <p className="text-xs text-neutral-600">Beside L K Towers, Roy Nagar, Gannavaram, Vijayawada, Amaravathi - 521101, Andhra Pradesh, India</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-neutral-200/80">
            <PhoneCall className="w-6 h-6 text-primary-700 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-neutral-900 mb-1">Official Helpline</h3>
            <p className="text-xs text-neutral-600">+91 83310 51327 (Mon–Sat, 9AM–6PM IST)</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-neutral-200/80">
            <Mail className="w-6 h-6 text-primary-700 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-neutral-900 mb-1">Official Inquiries</h3>
            <p className="text-xs text-neutral-600">support@unlocktejas.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
