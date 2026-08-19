import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GraduationCap, Briefcase, Target, Award, 
  CheckCircle2, ArrowRight, UserCheck, FileText, 
  Sparkles, ShieldCheck 
} from 'lucide-react';
import { SEO } from '@/components/ui/SEO';
import { Button } from '@/components/ui/Button';

export default function CareerReadiness() {
  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOccupationalProgram",
        "name": "Career Readiness & Professional Preparation Program",
        "description": "Structured career readiness curriculum covering technical competency benchmarks, executive communication, portfolio building, and mock interview simulations.",
        "provider": {
          "@type": "EducationalOrganization",
          "name": "Tejas Academy of Excellence",
          "url": "https://unlocktejas.com"
        },
        "url": "https://unlocktejas.com/career-readiness"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://unlocktejas.com/" },
          { "@type": "ListItem", "position": 2, "name": "Career Readiness", "item": "https://unlocktejas.com/career-readiness" }
        ]
      }
    ]
  };

  const readinessPillars = [
    {
      icon: Target,
      title: "Strategic Career Planning & Navigation",
      desc: "Identify your unique strengths, evaluate industry trajectories, align personal goals, and map deliberate multi-year career milestones."
    },
    {
      icon: UserCheck,
      title: "Executive Communication & Interview Mastery",
      desc: "Learn technical articulation, behavioral STAR interview methodology, assertive communication, and professional presence."
    },
    {
      icon: FileText,
      title: "High-Impact Portfolio & Project Showcase",
      desc: "Build verifiable, production-grade project repositories and executive resumes that demonstrate tangible problem-solving ability."
    },
    {
      icon: Award,
      title: "Workplace Culture & Professional Ethics",
      desc: "Understand corporate accountability, cross-functional stakeholder management, professional integrity, and workplace etiquette."
    }
  ];

  const outcomes = [
    "Navigate competitive professional selection processes with poise and evidence-based confidence.",
    "Present complex technical and business projects clearly to executive recruiters.",
    "Formulate structured career roadmaps backed by mentors from top global enterprises.",
    "Demonstrate rigorous professional communication across written, verbal, and digital mediums."
  ];

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        pageKey="career-readiness"
        title="Career Readiness Programs | Career Skills & Job Readiness | Tejas Academy"
        description="Master essential career readiness skills: professional communication, strategic problem-solving, digital fluency, and workplace adaptability with Tejas Academy."
        canonical="https://unlocktejas.com/career-readiness"
        keywords="Career Readiness, Career Readiness Programs, Career Skills, Job Readiness, Workplace Readiness, Career Preparation, Professional Readiness, Career Development"
        schema={pageSchema}
      />

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider mb-4">
          <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
          Professional Capability & Competence
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-neutral-900 tracking-tight mb-6">
          Career Readiness & Future-Ready Skills
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
          Career readiness is not about memorizing interview answers—it is about building deep, demonstrable competence, professional discipline, and intellectual clarity that employers value.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button variant="primary" size="lg" as={Link} to="/admissions" className="shadow-md">
            Apply for Programs
          </Button>
          <Button variant="outline" size="lg" as={Link} to="/employability-skills">
            Explore Employability Skills
          </Button>
        </div>
      </div>

      {/* Pillars Grid */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">
            Four Core Pillars of Career Readiness
          </h2>
          <p className="text-neutral-600 mt-2 max-w-2xl mx-auto text-sm sm:text-base">
            Systematic preparation designed to bridge academic study with high-performance professional expectations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {readinessPillars.map((rp, idx) => (
            <motion.div
              key={rp.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 bg-white rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-all hover:border-blue-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 mb-5">
                  <rp.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2.5">{rp.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{rp.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Outcomes & Mentor Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 bg-neutral-50 rounded-3xl p-8 sm:p-12 border border-neutral-200/70">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-700">Demonstrable Competence</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-neutral-900 mt-2 mb-6">
            Career Preparation Outcomes
          </h2>
          <ul className="space-y-4">
            {outcomes.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-neutral-700 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 mb-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              1-on-1 Mock Technical & HR Panels
            </h3>
            <p className="text-sm text-neutral-600">
              Rigorous diagnostic interviews conducted with industry practitioners offering direct, actionable rubric feedback on performance.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Real-World Capstone Defense
            </h3>
            <p className="text-sm text-neutral-600">
              Students present comprehensive real-world solutions directly to corporate mentors, validating readiness under authentic conditions.
            </p>
          </div>
        </div>
      </div>

      {/* Answer Engine Optimization (AEO) / Direct FAQ Section */}
      <div className="mb-20">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-700">Factual Knowledge Base</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 mt-2">
            Frequently Asked Questions on Career Readiness
          </h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          <div className="p-6 bg-white rounded-2xl border border-neutral-200/80 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900 mb-2">What is Career Readiness?</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Career Readiness is the attainment and demonstration of requisite core competencies that broadly prepare college graduates for a successful, resilient transition into the workplace.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-neutral-200/80 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900 mb-2">What are the primary career readiness skills employers look for?</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Key competencies include critical thinking and problem-solving, professional communication, teamwork and collaboration, digital technology fluency, leadership, professional work ethic, and career self-development.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-neutral-200/80 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900 mb-2">How does Tejas Academy train students for career readiness?</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Through rigorous capstone projects, simulated technical and HR panel interviews, executive mentorship, portfolio creation, and diagnostic performance feedback loops without making artificial placement promises.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-neutral-200/80 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900 mb-2">Who should participate in career readiness programs?</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Undergraduate engineering and management students, recent graduates entering competitive selection processes, and early-career practitioners seeking to sharpen their workplace competence.
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
          <Link to="/employability-skills" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-blue-600 hover:text-blue-700 transition-colors">
            Employability Skills →
          </Link>
          <Link to="/future-skills" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-blue-600 hover:text-blue-700 transition-colors">
            Future Skills →
          </Link>
          <Link to="/ai-literacy" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-blue-600 hover:text-blue-700 transition-colors">
            AI Literacy →
          </Link>
          <Link to="/leadership-development" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-blue-600 hover:text-blue-700 transition-colors">
            Leadership Development →
          </Link>
        </div>
      </div>
    </div>
  );
}
