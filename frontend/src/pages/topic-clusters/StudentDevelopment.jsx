import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GraduationCap, Sparkles, BookOpen, Target, 
  CheckCircle2, ArrowRight, Award, Compass, 
  Users, Layers 
} from 'lucide-react';
import { SEO } from '@/components/ui/SEO';
import { Button } from '@/components/ui/Button';

export default function StudentDevelopment() {
  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOccupationalProgram",
        "name": "Student Skill Development & Leadership Program",
        "description": "Holistic student development pathway combining practical coding labs, business ideation, career preparation, and personal capability compounding.",
        "provider": {
          "@type": "EducationalOrganization",
          "name": "Tejas Academy of Excellence",
          "url": "https://unlocktejas.com"
        },
        "url": "https://unlocktejas.com/student-development"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://unlocktejas.com/" },
          { "@type": "ListItem", "position": 2, "name": "Student Development", "item": "https://unlocktejas.com/student-development" }
        ]
      }
    ]
  };

  const programs = [
    {
      icon: Target,
      title: "Undergraduate Capability Compounding",
      desc: "Transform standard college coursework with intensive weekend coding labs, case studies, and faculty mentoring."
    },
    {
      icon: Users,
      title: "Student Leadership & Public Discourse",
      desc: "Participate in student councils, symposium debates, and community impact projects to cultivate public poise and teamwork."
    },
    {
      icon: Sparkles,
      title: "Campus Innovation & Project Labs",
      desc: "Collaborate in campus incubation spaces with peers, building functioning prototypes and real-world technology solutions."
    },
    {
      icon: GraduationCap,
      title: "Career & Post-Graduate Navigation",
      desc: "Structured roadmap guidance helping students choose optimal career pathways, competitive exams, or venture pursuits."
    }
  ];

  const outcomes = [
    "Develop self-directed study and deep-work habits essential for lifelong mastery.",
    "Complete verifiable, portfolio-grade capstone projects in AI, software, and business.",
    "Cultivate intellectual rigor, communication poise, and ethical maturity.",
    "Connect with dedicated mentors from premier national and global organizations."
  ];

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        pageKey="student-development"
        title="Student Skill Development & Leadership | Tejas Academy"
        description="Empowering undergraduate and postgraduate students with practical problem-solving, AI tools, career readiness, and leadership capabilities."
        canonical="https://unlocktejas.com/student-development"
        keywords="Student Skill Development, Student Development Programs, Student Leadership, Student Entrepreneurship, Future Skills for Students, AI Literacy for Students"
        schema={pageSchema}
      />

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold uppercase tracking-wider mb-4">
          <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
          Youth Empowerment & Capability
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-neutral-900 tracking-tight mb-6">
          Student Development & Applied Capability Programs
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
          College should not just be about passing exams—it is the pivotal window to build lifelong capability, character, deep-tech fluency, and decisive career readiness.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button variant="primary" size="lg" as={Link} to="/admissions" className="shadow-md">
            Apply for Student Program
          </Button>
          <Button variant="outline" size="lg" as={Link} to="/free-programs">
            View Free Student Masterclasses
          </Button>
        </div>
      </div>

      {/* Pillars Grid */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">
            Four Dimensions of Student Empowerment
          </h2>
          <p className="text-neutral-600 mt-2 max-w-2xl mx-auto text-sm sm:text-base">
            Comprehensive capability-building designed to complement university curriculums with practical mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((p, idx) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 bg-white rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-all hover:border-indigo-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700 mb-5">
                  <p.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2.5">{p.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Learning Outcomes Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 bg-neutral-50 rounded-3xl p-8 sm:p-12 border border-neutral-200/70">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-700">Holistic Outcomes</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-neutral-900 mt-2 mb-6">
            Key Capabilities Built
          </h2>
          <ul className="space-y-4">
            {outcomes.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-neutral-700 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-indigo-600" />
              Student Innovation Fellowship
            </h3>
            <p className="text-sm text-neutral-600">
              Selected student cohorts receive dedicated lab access, computing credits, and direct guidance from industry executives.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Peer-to-Peer Collaborative Circles
            </h3>
            <p className="text-sm text-neutral-600">
              Structured study circles, coding challenges, and book discussions fostering an inspiring culture of collective diligence.
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
          <Link to="/career-readiness" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-indigo-600 hover:text-indigo-700 transition-colors">
            Career Readiness →
          </Link>
          <Link to="/future-skills" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-indigo-600 hover:text-indigo-700 transition-colors">
            Future Skills →
          </Link>
          <Link to="/ai-literacy" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-indigo-600 hover:text-indigo-700 transition-colors">
            AI Literacy →
          </Link>
          <Link to="/free-programs" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-indigo-600 hover:text-indigo-700 transition-colors">
            Free Masterclasses →
          </Link>
        </div>
      </div>
    </div>
  );
}
