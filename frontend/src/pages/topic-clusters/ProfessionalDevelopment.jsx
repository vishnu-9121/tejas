import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, TrendingUp, Layers, Award, 
  CheckCircle2, ArrowRight, ShieldCheck, Clock, 
  Sparkles, Compass 
} from 'lucide-react';
import { SEO } from '@/components/ui/SEO';
import { Button } from '@/components/ui/Button';

export default function ProfessionalDevelopment() {
  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOccupationalProgram",
        "name": "Executive & Professional Development Program",
        "description": "Advanced capability-building program for working professionals covering executive strategy, cross-functional leadership, modern AI tool adoption, and management mastery.",
        "provider": {
          "@type": "EducationalOrganization",
          "name": "Tejas Academy of Excellence",
          "url": "https://unlocktejas.com"
        },
        "url": "https://unlocktejas.com/professional-development"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://unlocktejas.com/" },
          { "@type": "ListItem", "position": 2, "name": "Professional Development", "item": "https://unlocktejas.com/professional-development" }
        ]
      }
    ]
  };

  const tracks = [
    {
      icon: TrendingUp,
      title: "Strategic Management & Executive Execution",
      desc: "Develop high-level business acumen, organizational design, resource allocation models, and multi-year strategic roadmaps."
    },
    {
      icon: Layers,
      title: "Enterprise AI & Technology Adoption",
      desc: "Equip mid-level and senior managers with practical frameworks to deploy AI tools, automate business operations, and lead digital transformations."
    },
    {
      icon: Briefcase,
      title: "Cross-Functional Leadership & Negotiation",
      desc: "Master senior stakeholder management, corporate negotiation strategies, and high-impact boardroom communications."
    },
    {
      icon: Clock,
      title: "Executive Time Mastery & Productivity",
      desc: "Implement high-leverage decision architectures, delegation systems, and personal energy management frameworks."
    }
  ];

  const outcomes = [
    "Navigate complex executive transitions with strategic clarity and managerial competence.",
    "Formulate and lead enterprise-wide capability upskilling and modern AI adoption initiatives.",
    "Deliver authoritative, data-driven executive briefings to corporate boards and investors.",
    "Build resilient, high-performing teams grounded in accountability and operational rigor."
  ];

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        pageKey="professional-development"
        title="Professional Development & Workplace Mastery | Tejas Academy"
        description="Advanced professional development modules in strategic communication, executive leadership, technological adoption, and managerial competence."
        canonical="https://unlocktejas.com/professional-development"
        keywords="Professional Development, Professional Development Programs, Professional Skills Training, Career Growth, Workplace Leadership, Executive Skills"
        schema={pageSchema}
      />

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold uppercase tracking-wider mb-4">
          <Briefcase className="w-3.5 h-3.5 text-slate-700" />
          Executive Upskilling & Leadership
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-neutral-900 tracking-tight mb-6">
          Professional Development for Modern Practitioners
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
          Designed for experienced professionals, functional managers, and emerging leaders seeking to accelerate career trajectory through deep capability compounding and modern technology adoption.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button variant="primary" size="lg" as={Link} to="/admissions" className="shadow-md">
            Apply for Executive Track
          </Button>
          <Button variant="outline" size="lg" as={Link} to="/for-institutions">
            For Institutional & Corporate
          </Button>
        </div>
      </div>

      {/* Tracks Grid */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">
            Four Core Professional Tracks
          </h2>
          <p className="text-neutral-600 mt-2 max-w-2xl mx-auto text-sm sm:text-base">
            High-leverage capabilities engineered for immediate application in enterprise environments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tracks.map((t, idx) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 bg-white rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-all hover:border-slate-400 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 mb-5">
                  <t.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2.5">{t.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{t.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Learning Outcomes Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 bg-neutral-50 rounded-3xl p-8 sm:p-12 border border-neutral-200/70">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-800">Executive Impact</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-neutral-900 mt-2 mb-6">
            Tangible Executive Outcomes
          </h2>
          <ul className="space-y-4">
            {outcomes.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-neutral-700 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-slate-800" />
              Executive Peer Cohorts
            </h3>
            <p className="text-sm text-neutral-600">
              Engage with a curated cohort of peers across diverse industries, enriching case discussions and building a trusted professional network.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Hybrid Weekend Flexibility
            </h3>
            <p className="text-sm text-neutral-600">
              Interactive live masterclasses and recorded modules designed specifically to accommodate demanding executive work schedules.
            </p>
          </div>
        </div>
      </div>

      {/* Topic Cluster Cross-Links */}
      <div className="border-t border-neutral-200 pt-12">
        <h3 className="text-lg font-bold text-neutral-900 mb-4 text-center">
          Explore Connected Academic Capabilities
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/for-institutions" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-slate-600 hover:text-slate-800 transition-colors">
            For Institutions & Corporate →
          </Link>
          <Link to="/leadership-development" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-slate-600 hover:text-slate-800 transition-colors">
            Leadership Development →
          </Link>
          <Link to="/ai-literacy" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-slate-600 hover:text-slate-800 transition-colors">
            AI Literacy →
          </Link>
          <Link to="/programs" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-slate-600 hover:text-slate-800 transition-colors">
            Explore All Programs →
          </Link>
        </div>
      </div>
    </div>
  );
}
