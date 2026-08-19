import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Compass, Zap, Brain, Layers, 
  CheckCircle2, ArrowRight, Lightbulb, Workflow, 
  Globe, ShieldCheck 
} from 'lucide-react';
import { SEO } from '@/components/ui/SEO';
import { Button } from '@/components/ui/Button';

export default function FutureSkills() {
  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOccupationalProgram",
        "name": "Future Skills Training & Future-Ready Careers Program",
        "description": "Cross-disciplinary training program fostering 21st-century foundational skills: complex problem solving, systems thinking, digital literacy, and cognitive agility.",
        "provider": {
          "@type": "EducationalOrganization",
          "name": "Tejas Academy of Excellence",
          "url": "https://unlocktejas.com"
        },
        "url": "https://unlocktejas.com/future-skills"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://unlocktejas.com/" },
          { "@type": "ListItem", "position": 2, "name": "Future Skills", "item": "https://unlocktejas.com/future-skills" }
        ]
      }
    ]
  };

  const skillTracks = [
    {
      icon: Brain,
      title: "Complex Problem-Solving & Critical Thinking",
      desc: "Deconstruct ambiguous multi-variable business problems using first-principles reasoning and structured hypothesis validation."
    },
    {
      icon: Layers,
      title: "Systems Thinking & Cross-Domain Synthesis",
      desc: "Understand how technology, human behavior, supply chains, and economic incentives interact to form interconnected systems."
    },
    {
      icon: Zap,
      title: "Adaptability & Rapid Learning Agility",
      desc: "Develop meta-learning frameworks to master new technical tools, programming languages, and industry domains in compressed timelines."
    },
    {
      icon: Workflow,
      title: "Digital Fluency & Collaborative Intelligence",
      desc: "Master asynchronous remote teamwork, digital productivity suites, data visualization, and cloud-native workflows."
    }
  ];

  const outcomes = [
    "Navigate technological disruption with confidence and cognitive agility.",
    "Formulate structured solutions to unstructured, real-world industry problems.",
    "Collaborate seamlessly in modern distributed and hybrid workplace environments.",
    "Integrate human creativity and critical reasoning with automated technological tools."
  ];

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        pageKey="future-skills"
        title="Future Skills Training | Future-Ready Skills & Careers | Tejas Academy"
        description="Equip yourself with 21st-century future skills: complex problem solving, systems thinking, digital collaboration, adaptability, and technological agility."
        canonical="https://unlocktejas.com/future-skills"
        keywords="Future Skills, Future Skills Academy, Future Skills Training, Future-Ready Skills, 21st Century Skills, Critical Thinking, Problem Solving, Digital Literacy"
        schema={pageSchema}
      />

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-800 text-xs font-bold uppercase tracking-wider mb-4">
          <Zap className="w-3.5 h-3.5 text-violet-600" />
          21st Century Capabilities
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-neutral-900 tracking-tight mb-6">
          Future Skills for a Changing World
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
          The future belongs to those who think across boundaries, adapt rapidly to emerging paradigms, and leverage technology with human insight. Tejas Academy prepares you to thrive in the new economy.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button variant="primary" size="lg" as={Link} to="/admissions" className="shadow-md">
            Apply for Admission
          </Button>
          <Button variant="outline" size="lg" as={Link} to="/employability-skills">
            Explore Employability Skills
          </Button>
        </div>
      </div>

      {/* Skill Tracks Grid */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">
            Four Foundational Pillars of Future Readiness
          </h2>
          <p className="text-neutral-600 mt-2 max-w-2xl mx-auto text-sm sm:text-base">
            Essential cognitive and collaborative capabilities that transcend specific software tools or temporary trends.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillTracks.map((st, idx) => (
            <motion.div
              key={st.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 bg-white rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-all hover:border-violet-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-violet-700 mb-5">
                  <st.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2.5">{st.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{st.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Learning Outcomes Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 bg-neutral-50 rounded-3xl p-8 sm:p-12 border border-neutral-200/70">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-violet-700">Competence Compounding</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-neutral-900 mt-2 mb-6">
            Future-Ready Learning Outcomes
          </h2>
          <ul className="space-y-4">
            {outcomes.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-neutral-700 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Applied Problem Hackathons
            </h3>
            <p className="text-sm text-neutral-600">
              Students engage in live scenario hackathons solving actual enterprise case challenges evaluated by distinguished mentors.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              Global Capability Standards
            </h3>
            <p className="text-sm text-neutral-600">
              Curricula aligned with World Economic Forum future-of-work benchmarks and premier national skilling frameworks.
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
          <Link to="/ai-literacy" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-violet-600 hover:text-violet-700 transition-colors">
            AI Literacy →
          </Link>
          <Link to="/employability-skills" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-violet-600 hover:text-violet-700 transition-colors">
            Employability Skills →
          </Link>
          <Link to="/career-readiness" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-violet-600 hover:text-violet-700 transition-colors">
            Career Readiness →
          </Link>
          <Link to="/student-development" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-violet-600 hover:text-violet-700 transition-colors">
            Student Development →
          </Link>
        </div>
      </div>
    </div>
  );
}
