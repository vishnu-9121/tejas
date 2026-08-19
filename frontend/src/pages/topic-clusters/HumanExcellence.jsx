import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, Shield, Compass, Sparkles, 
  CheckCircle2, ArrowRight, Award, Eye, 
  Flame, Anchor 
} from 'lucide-react';
import { SEO } from '@/components/ui/SEO';
import { Button } from '@/components/ui/Button';

export default function HumanExcellence() {
  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOccupationalProgram",
        "name": "The Tejas Imperative of Human Excellence",
        "description": "Foundational human excellence curriculum developing 5 core dimensions: Intellectual, Character, Emotional, Professional, and Societal mastery grounded in the 6 virtues.",
        "provider": {
          "@type": "EducationalOrganization",
          "name": "Tejas Academy of Excellence",
          "url": "https://unlocktejas.com"
        },
        "url": "https://unlocktejas.com/human-excellence"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://unlocktejas.com/" },
          { "@type": "ListItem", "position": 2, "name": "Human Excellence", "item": "https://unlocktejas.com/human-excellence" }
        ]
      }
    ]
  };

  const dimensions = [
    {
      icon: Compass,
      title: "1. Intellectual Mastery",
      desc: "Critical reasoning, first-principles logic, multi-domain curiosity, and continuous learning discipline."
    },
    {
      icon: Shield,
      title: "2. Character & Moral Courage",
      desc: "Unyielding adherence to integrity, accountability, personal honesty, and ethical courage under pressure."
    },
    {
      icon: Heart,
      title: "3. Emotional Balance & Self-Leadership",
      desc: "Equanimity under volatility, self-awareness, active empathy, and psychological resilience in crisis."
    },
    {
      icon: Award,
      title: "4. Professional Competence",
      desc: "Relentless craftsmanship, high-velocity execution, deep domain capability, and workplace excellence."
    },
    {
      icon: Anchor,
      title: "5. Societal Responsibility",
      desc: "Servant leadership, community upliftment, nation building, and creating lasting value beyond personal profit."
    }
  ];

  const virtues = [
    { name: "Integrity", desc: "Unyielding moral courage and honesty in thought, word, and deed." },
    { name: "Discipline", desc: "Consistent daily habits and rigorous execution essential for compounding capability." },
    { name: "Courage", desc: "The boldness to question dogma, embrace intellectual challenges, and pioneer positive change." },
    { name: "Curiosity", desc: "Inquisitive pursuit of deep knowledge and multidisciplinary exploration." },
    { name: "Service", desc: "Commitment to servant leadership and uplifting society and the nation." },
    { name: "Excellence", desc: "Relentless striving for the highest standards in character, craft, and intellect." }
  ];

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        pageKey="human-excellence"
        title="Human Excellence & Personal Development | Tejas Academy"
        description="Explore the 5 dimensions of Human Excellence: Intellectual, Character, Emotional, Professional, and Societal mastery grounded in ethical discipline."
        canonical="https://unlocktejas.com/human-excellence"
        keywords="Human Excellence, Personal Development, Personal Growth, Self Leadership, Character Building, Emotional Intelligence, 6 Virtues"
        schema={pageSchema}
      />

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold uppercase tracking-wider mb-4">
          <Heart className="w-3.5 h-3.5 text-rose-600" />
          The Institutional Soul of Tejas
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-neutral-900 tracking-tight mb-6">
          The Tejas Imperative of Human Excellence
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
          Education is not merely the transmission of information—it is the deliberate transformation of human character, intellectual capability, emotional balance, and purposeful leadership.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button variant="primary" size="lg" as={Link} to="/about/vision-mission" className="shadow-md">
            Read Full Philosophy
          </Button>
          <Button variant="outline" size="lg" as={Link} to="/leadership-development">
            Leadership Programs
          </Button>
        </div>
      </div>

      {/* 5 Dimensions Grid */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">
            The Five Dimensions of Human Excellence
          </h2>
          <p className="text-neutral-600 mt-2 max-w-2xl mx-auto text-sm sm:text-base">
            Every curriculum, mentorship cohort, and student project at Tejas Academy integrates this 5-dimensional framework.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dimensions.map((d, idx) => (
            <motion.div
              key={d.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 bg-white rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-all hover:border-rose-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-700 mb-5">
                  <d.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2.5">{d.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{d.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* The 6 Foundational Virtues */}
      <div className="mb-20 bg-neutral-900 text-white rounded-3xl p-8 sm:p-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Moral Charter</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-2">
            The 6 Foundational Virtues
          </h2>
          <p className="text-neutral-400 mt-2 text-sm sm:text-base">
            Valour in Heart. Discipline in Habit. Vigilance in Mind. Resilience in Spirit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {virtues.map((v) => (
            <div key={v.name} className="p-6 bg-neutral-800/80 border border-neutral-700 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-lg font-bold text-white">{v.name}</h3>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Internal Topic Cluster Links */}
      <div className="border-t border-neutral-200 pt-12">
        <h3 className="text-lg font-bold text-neutral-900 mb-4 text-center">
          Explore Connected Academic Capabilities
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/about/vision-mission" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-rose-600 hover:text-rose-700 transition-colors">
            Vision & Mission →
          </Link>
          <Link to="/leadership-development" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-rose-600 hover:text-rose-700 transition-colors">
            Leadership Development →
          </Link>
          <Link to="/career-readiness" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-rose-600 hover:text-rose-700 transition-colors">
            Career Readiness →
          </Link>
          <Link to="/programs" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-rose-600 hover:text-rose-700 transition-colors">
            Explore All Programs →
          </Link>
        </div>
      </div>
    </div>
  );
}
