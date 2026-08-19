import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle, MessageSquare, Users2, Clock, 
  CheckCircle2, ArrowRight, Shield, Award, 
  Sparkles, Briefcase 
} from 'lucide-react';
import { SEO } from '@/components/ui/SEO';
import { Button } from '@/components/ui/Button';

export default function EmployabilitySkills() {
  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOccupationalProgram",
        "name": "Employability Skills & Workplace Readiness Program",
        "description": "Comprehensive employability skills curriculum developing professional communication, cross-functional collaboration, critical workplace thinking, and time management.",
        "provider": {
          "@type": "EducationalOrganization",
          "name": "Tejas Academy of Excellence",
          "url": "https://unlocktejas.com"
        },
        "url": "https://unlocktejas.com/employability-skills"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://unlocktejas.com/" },
          { "@type": "ListItem", "position": 2, "name": "Employability Skills", "item": "https://unlocktejas.com/employability-skills" }
        ]
      }
    ]
  };

  const skillBlocks = [
    {
      icon: MessageSquare,
      title: "Executive Business Communication",
      desc: "Structured business memo drafting, persuasive email communication, concise verbal summaries, and active listening in professional settings."
    },
    {
      icon: Users2,
      title: "Team Dynamics & Conflict Resolution",
      desc: "Collaborate effectively across multidisciplinary teams, give and receive constructive feedback, and resolve interpersonal disagreements professionally."
    },
    {
      icon: Clock,
      title: "Accountability, Time Management & Focus",
      desc: "Master prioritization frameworks, disciplined project deadline delivery, meeting etiquette, and managing attention in high-distraction environments."
    },
    {
      icon: Briefcase,
      title: "Workplace Problem-Solving & AI Fluency",
      desc: "Apply data analysis and generative AI productivity tools to solve routine corporate operational bottlenecks with speed."
    }
  ];

  const outcomes = [
    "Deliver articulate, polished business presentations to senior stakeholders.",
    "Collaborate harmoniously within cross-functional, agile team sprints.",
    "Manage multiple concurrent deliverables with strict adherence to deadlines.",
    "Demonstrate highest standards of professional ethics, integrity, and diligence."
  ];

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        pageKey="employability-skills"
        title="Employability Skills Training | Job-Ready & Workplace Skills | Tejas Academy"
        description="Develop high-demand employability skills: teamwork, critical thinking, executive communication, workplace AI tools, and professional discipline."
        canonical="https://unlocktejas.com/employability-skills"
        keywords="Employability Skills, Employability Skills Training, Employability Skills for Students, Job Skills, Workplace Skills, Professional Skills Development, Work-Ready Skills"
        schema={pageSchema}
      />

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-4">
          <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
          Workplace Competence & Professionalism
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-neutral-900 tracking-tight mb-6">
          Employability & Workplace Readiness Skills
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
          Technical knowledge gets you in the door; employability skills enable you to create impact, lead initiatives, and compound value. Tejas Academy builds reliable, workplace-ready graduates.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button variant="primary" size="lg" as={Link} to="/admissions" className="shadow-md">
            Apply for Cohort
          </Button>
          <Button variant="outline" size="lg" as={Link} to="/career-readiness">
            View Career Readiness
          </Button>
        </div>
      </div>

      {/* Pillars Grid */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">
            Four Core Employability Capability Blocks
          </h2>
          <p className="text-neutral-600 mt-2 max-w-2xl mx-auto text-sm sm:text-base">
            Essential behavioral and communication capabilities demanded by forward-thinking organizations worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillBlocks.map((sb, idx) => (
            <motion.div
              key={sb.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 bg-white rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-all hover:border-teal-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 mb-5">
                  <sb.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2.5">{sb.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{sb.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Learning Outcomes Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 bg-neutral-50 rounded-3xl p-8 sm:p-12 border border-neutral-200/70">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700">Practitioner Standards</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-neutral-900 mt-2 mb-6">
            Workplace Competencies
          </h2>
          <ul className="space-y-4">
            {outcomes.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-neutral-700 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-teal-600" />
              Simulated Enterprise Sprints
            </h3>
            <p className="text-sm text-neutral-600">
              Students operate in simulated company sprint environments, managing Jira boards, sprint standups, and retrospective feedback loops.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Continuous Behavioral Mentorship
            </h3>
            <p className="text-sm text-neutral-600">
              Dedicated soft-skills coaches provide individualized feedback on body language, vocal modulation, and active listening.
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
          <Link to="/career-readiness" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-teal-600 hover:text-teal-700 transition-colors">
            Career Readiness →
          </Link>
          <Link to="/professional-development" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-teal-600 hover:text-teal-700 transition-colors">
            Professional Development →
          </Link>
          <Link to="/future-skills" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-teal-600 hover:text-teal-700 transition-colors">
            Future Skills →
          </Link>
          <Link to="/programs" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-teal-600 hover:text-teal-700 transition-colors">
            Explore All Programs →
          </Link>
        </div>
      </div>
    </div>
  );
}
