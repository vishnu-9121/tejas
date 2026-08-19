import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Cpu, Terminal, Sparkles, Binary, 
  CheckCircle2, ArrowRight, ShieldCheck, Database, 
  Network, Code2 
} from 'lucide-react';
import { SEO } from '@/components/ui/SEO';
import { Button } from '@/components/ui/Button';

export default function AILiteracy() {
  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOccupationalProgram",
        "name": "AI Literacy & Generative AI Skills Program",
        "description": "Comprehensive applied AI literacy curriculum covering prompt architecture, large language models, AI productivity workflows, and ethical technology governance.",
        "provider": {
          "@type": "EducationalOrganization",
          "name": "Tejas Academy of Excellence",
          "url": "https://unlocktejas.com"
        },
        "url": "https://unlocktejas.com/ai-literacy"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://unlocktejas.com/" },
          { "@type": "ListItem", "position": 2, "name": "AI Literacy", "item": "https://unlocktejas.com/ai-literacy" }
        ]
      }
    ]
  };

  const modules = [
    {
      icon: Terminal,
      title: "Prompt Engineering & LLM Architecture",
      desc: "Master few-shot prompting, chain-of-thought reasoning, context window management, and structured JSON output generation."
    },
    {
      icon: Cpu,
      title: "AI Workflows & Business Automation",
      desc: "Integrate LLM agents, API pipelines, automated data synthesis, and autonomous task engines into enterprise business workflows."
    },
    {
      icon: Database,
      title: "Applied Machine Learning Fundamentals",
      desc: "Understand predictive algorithms, supervised vs unsupervised learning, data preprocessing, embeddings, and vector databases."
    },
    {
      icon: ShieldCheck,
      title: "AI Ethics & Algorithmic Governance",
      desc: "Explore bias mitigation, data privacy, intellectual property rights, security guardrails, and responsible AI deployment."
    }
  ];

  const outcomes = [
    "Build custom AI productivity agents to automate analytical and operational tasks.",
    "Evaluate and deploy foundational AI models suited for specific business requirements.",
    "Architect Retrieval-Augmented Generation (RAG) knowledge retrieval pipelines.",
    "Apply rigorous ethical standards and privacy guardrails to enterprise AI implementations."
  ];

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        pageKey="ai-literacy"
        title="AI Literacy & AI Skills Training | Tejas Academy"
        description="Learn practical AI literacy, prompt engineering, generative AI workflows, machine learning concepts, and ethical AI systems at Tejas Academy of Excellence."
        canonical="https://unlocktejas.com/ai-literacy"
        keywords="AI Literacy, AI Literacy Program, Generative AI Training, AI Education, AI for Business, AI for Entrepreneurs, AI Skills, Prompt Engineering"
        schema={pageSchema}
      />

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
          Technological Fluency & DeepTech
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-neutral-900 tracking-tight mb-6">
          AI Literacy & Future-Ready AI Skills
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
          Artificial Intelligence is transforming every discipline and industry. At Tejas Academy, we demystify AI to empower students, entrepreneurs, and professionals with applied, hands-on fluency.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button variant="primary" size="lg" as={Link} to="/admissions" className="shadow-md">
            Enroll in AI Program
          </Button>
          <Button variant="outline" size="lg" as={Link} to="/free-programs">
            View Free Masterclasses
          </Button>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">
            Comprehensive AI Curriculum Architecture
          </h2>
          <p className="text-neutral-600 mt-2 max-w-2xl mx-auto text-sm sm:text-base">
            From prompt engineering fundamentals to full-stack autonomous AI workflows and ethical governance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((m, idx) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 bg-white rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-all hover:border-cyan-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-700 mb-5">
                  <m.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2.5">{m.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Outcomes & Hands-On GPU Lab */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 bg-neutral-50 rounded-3xl p-8 sm:p-12 border border-neutral-200/70">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">Applied Competence</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-neutral-900 mt-2 mb-6">
            Real-World AI Outcomes
          </h2>
          <ul className="space-y-4">
            {outcomes.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-neutral-700 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 mb-2">
              <Network className="w-4 h-4 text-cyan-600" />
              Hands-On Applied AI Computing Labs
            </h3>
            <p className="text-sm text-neutral-600">
              Students build on modern cloud GPU architectures, interacting with cutting-edge open-weights models, APIs, and real-time inference tools.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 mb-2">
              <Code2 className="w-4 h-4 text-emerald-600" />
              AI for Non-Technical Disciplines
            </h3>
            <p className="text-sm text-neutral-600">
              Specialized pathways enabling finance, marketing, and operations professionals to leverage generative AI without requiring deep coding backgrounds.
            </p>
          </div>
        </div>
      </div>

      {/* Answer Engine Optimization (AEO) / Direct FAQ Section */}
      <div className="mb-20">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">Factual Knowledge Base</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 mt-2">
            Frequently Asked Questions on AI Literacy
          </h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          <div className="p-6 bg-white rounded-2xl border border-neutral-200/80 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900 mb-2">What is AI Literacy?</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              AI Literacy is the foundational understanding of how Artificial Intelligence and Machine Learning models operate, combined with the practical capability to use generative tools, prompt architectures, and AI workflows responsibly and effectively.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-neutral-200/80 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900 mb-2">Why is AI Literacy essential for students and professionals?</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              As AI integrates into everyday business, engineering, and creative software, professionals equipped with AI literacy achieve 3x to 5x higher analytical throughput, automate routine operations, and make informed strategic decisions regarding technology adoption.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-neutral-200/80 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900 mb-2">Who can learn AI Literacy at Tejas Academy?</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Our AI curriculum offers dual pathways: an applied engineering track for software and data students, and an executive productivity track for management, finance, and non-technical business professionals.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-neutral-200/80 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900 mb-2">How does AI Literacy connect to career readiness?</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Employers increasingly benchmark candidates on their ability to solve domain problems with modern AI-augmented workflows. AI literacy gives candidates demonstrable project portfolios and competitive technical confidence.
            </p>
          </div>
        </div>
      </div>

      {/* Internal Linking Cluster */}
      <div className="border-t border-neutral-200 pt-12">
        <h3 className="text-lg font-bold text-neutral-900 mb-4 text-center">
          Explore Connected Academic Capabilities
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/future-skills" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-cyan-600 hover:text-cyan-700 transition-colors">
            Future Skills →
          </Link>
          <Link to="/career-readiness" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-cyan-600 hover:text-cyan-700 transition-colors">
            Career Readiness →
          </Link>
          <Link to="/business-entrepreneurship" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-cyan-600 hover:text-cyan-700 transition-colors">
            Business & Entrepreneurship →
          </Link>
          <Link to="/programs" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-cyan-600 hover:text-cyan-700 transition-colors">
            Explore All Programs →
          </Link>
        </div>
      </div>
    </div>
  );
}
