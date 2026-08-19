import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Award, Users, Compass, 
  CheckCircle2, ArrowRight, BookOpen, HeartHandshake, 
  Sparkles, Target 
} from 'lucide-react';
import { SEO } from '@/components/ui/SEO';
import { Button } from '@/components/ui/Button';

export default function LeadershipDevelopment() {
  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOccupationalProgram",
        "name": "Leadership Development & Entrepreneurial Leadership Program",
        "description": "Principled leadership training focused on character, ethical governance, strategic thinking, team dynamics, and crisis decision-making.",
        "provider": {
          "@type": "EducationalOrganization",
          "name": "Tejas Academy of Excellence",
          "url": "https://unlocktejas.com"
        },
        "url": "https://unlocktejas.com/leadership-development"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://unlocktejas.com/" },
          { "@type": "ListItem", "position": 2, "name": "Leadership Development", "item": "https://unlocktejas.com/leadership-development" }
        ]
      }
    ]
  };

  const pillars = [
    {
      icon: Compass,
      title: "Strategic & Ethical Decision-Making",
      desc: "Cultivate the analytical clarity and moral courage to make sound, principled decisions in complex, high-stakes environments."
    },
    {
      icon: Users,
      title: "Team Alignment & Servant Leadership",
      desc: "Master empathetic communication, cross-functional collaboration, conflict resolution, and empowering collective ownership."
    },
    {
      icon: Target,
      title: "Visionary Execution & Resilience",
      desc: "Transform strategic goals into disciplined execution roadmaps while maintaining team morale through volatile challenges."
    },
    {
      icon: HeartHandshake,
      title: "Emotional Intelligence & Self-Mastery",
      desc: "Develop self-awareness, active listening, stress resilience, and authentic personal gravitas required of executive leaders."
    }
  ];

  const outcomes = [
    "Lead multidisciplinary teams through complex project execution with accountability.",
    "Formulate long-term organizational strategy grounded in ethical principles.",
    "Deliver persuasive, high-impact keynote presentations and executive briefings.",
    "Cultivate a resilient growth mindset capable of pivoting under market turbulence."
  ];

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        pageKey="leadership-development"
        title="Leadership Development Programs | Tejas Academy"
        description="Cultivate courageous, ethical, and strategic leadership capabilities. Leadership training programs for students, young leaders, and professionals."
        canonical="https://unlocktejas.com/leadership-development"
        keywords="Leadership Development, Leadership Training, Student Leadership Programs, Youth Leadership, Strategic Thinking, Decision Making Skills, Communication Skills"
        schema={pageSchema}
      />

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Character & Executive Mastery
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-neutral-900 tracking-tight mb-6">
          Leadership Development & Entrepreneurial Leadership
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
          True leadership is not a title—it is the compounding outcome of character, competence, clarity of vision, and responsible stewardship. Tejas Academy shapes leaders who inspire and deliver.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button variant="primary" size="lg" as={Link} to="/admissions" className="shadow-md">
            Join Leadership Cohort
          </Button>
          <Button variant="outline" size="lg" as={Link} to="/about/vision-mission">
            Read Academic Philosophy
          </Button>
        </div>
      </div>

      {/* Pillars Grid */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">
            Four Dimensions of Principled Leadership
          </h2>
          <p className="text-neutral-600 mt-2 max-w-2xl mx-auto text-sm sm:text-base">
            Equipping future leaders with the cognitive rigor and emotional balance to navigate 21st-century organizational challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 bg-white rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-all hover:border-emerald-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 mb-5">
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
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">Executive Competencies</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-neutral-900 mt-2 mb-6">
            Core Leadership Capabilities
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
              <Award className="w-4 h-4 text-emerald-600" />
              Youth & Student Leadership Initiatives
            </h3>
            <p className="text-sm text-neutral-600">
              Interactive student councils, simulated crisis war-rooms, and public discourse panels that challenge learners to lead under pressure.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Rooted in the 6 Foundational Virtues
            </h3>
            <p className="text-sm text-neutral-600">
              Anchored in Integrity, Discipline, Courage, Curiosity, Service, and Excellence to ensure leadership produces enduring societal value.
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
          <Link to="/human-excellence" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-emerald-600 hover:text-emerald-700 transition-colors">
            Human Excellence →
          </Link>
          <Link to="/business-entrepreneurship" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-emerald-600 hover:text-emerald-700 transition-colors">
            Business & Entrepreneurship →
          </Link>
          <Link to="/professional-development" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-emerald-600 hover:text-emerald-700 transition-colors">
            Professional Development →
          </Link>
          <Link to="/career-readiness" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-emerald-600 hover:text-emerald-700 transition-colors">
            Career Readiness →
          </Link>
        </div>
      </div>
    </div>
  );
}
