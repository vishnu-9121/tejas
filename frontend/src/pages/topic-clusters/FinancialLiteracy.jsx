import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, DollarSign, PieChart, ShieldCheck, 
  CheckCircle2, ArrowRight, Wallet, Landmark, 
  Sparkles, LineChart 
} from 'lucide-react';
import { SEO } from '@/components/ui/SEO';
import { Button } from '@/components/ui/Button';

export default function FinancialLiteracy() {
  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOccupationalProgram",
        "name": "Financial Literacy & Wealth Management Education Program",
        "description": "Comprehensive practical financial literacy curriculum covering personal budgeting, capital markets, valuation fundamentals, asset allocation, and wealth architecture.",
        "provider": {
          "@type": "EducationalOrganization",
          "name": "Tejas Academy of Excellence",
          "url": "https://unlocktejas.com"
        },
        "url": "https://unlocktejas.com/financial-literacy"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://unlocktejas.com/" },
          { "@type": "ListItem", "position": 2, "name": "Financial Literacy", "item": "https://unlocktejas.com/financial-literacy" }
        ]
      }
    ]
  };

  const modules = [
    {
      icon: Wallet,
      title: "Personal Finance Architecture & Budgeting",
      desc: "Learn disciplined cash flow management, emergency reserves, debt management, and compound interest wealth mechanisms."
    },
    {
      icon: LineChart,
      title: "Capital Markets & Investment Fundamentals",
      desc: "Master equity analysis, fixed income instruments, index funds, asset allocation models, and risk-adjusted portfolio construction."
    },
    {
      icon: PieChart,
      title: "Corporate Finance & Financial Modeling",
      desc: "Deconstruct balance sheets, P&L statements, cash-flow diagnostics, valuation multiples, and startup cap-table modeling."
    },
    {
      icon: Landmark,
      title: "Tax Planning, Governance & Wealth Protection",
      desc: "Understand direct and indirect tax strategies, compliance, insurance planning, and estate protection for long-term wealth stability."
    }
  ];

  const outcomes = [
    "Formulate personalized, data-backed financial plans and diversified investment portfolios.",
    "Perform fundamental financial statement analysis on public and private enterprises.",
    "Evaluate investment opportunities using quantitative valuation and risk metrics.",
    "Navigate complex financial decisions with fiscal discipline, prudence, and foresight."
  ];

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        pageKey="financial-literacy"
        title="Financial Literacy & Financial Management | Tejas Academy"
        description="Build robust financial foundations: personal finance, capital allocation, investment analysis, budgeting, and wealth architecture education."
        canonical="https://unlocktejas.com/financial-literacy"
        keywords="Financial Literacy, Financial Literacy Program, Financial Education, Financial Management, Personal Finance Education, Money Management Skills, Financial Planning"
        schema={pageSchema}
      />

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-4">
          <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
          Fiscal Mastery & Wealth Architecture
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-neutral-900 tracking-tight mb-6">
          Financial Literacy & Money Management Skills
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
          Financial literacy is an essential life capability. At Tejas Academy, we provide practical, unvarnished education on capital management, investment principles, and long-term economic independence.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button variant="primary" size="lg" as={Link} to="/admissions" className="shadow-md">
            Enroll in Finance Program
          </Button>
          <Button variant="outline" size="lg" as={Link} to="/programs">
            View All Programs
          </Button>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">
            Four Core Financial Competencies
          </h2>
          <p className="text-neutral-600 mt-2 max-w-2xl mx-auto text-sm sm:text-base">
            From personal money management to advanced corporate financial modeling and wealth architecture.
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
              className="p-6 bg-white rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-all hover:border-amber-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 mb-5">
                  <m.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2.5">{m.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Learning Outcomes Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 bg-neutral-50 rounded-3xl p-8 sm:p-12 border border-neutral-200/70">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700">Analytical Outcomes</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-neutral-900 mt-2 mb-6">
            Actionable Financial Mastery
          </h2>
          <ul className="space-y-4">
            {outcomes.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-neutral-700 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 mb-2">
              <PieChart className="w-4 h-4 text-amber-600" />
              Real-World Financial Simulation Labs
            </h3>
            <p className="text-sm text-neutral-600">
              Students build comprehensive spreadsheets and financial projections simulating startup cash burn, debt structuring, and equity dilution.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Ethics in Financial Stewardship
            </h3>
            <p className="text-sm text-neutral-600">
              Grounded in the foundational virtue of Integrity, emphasizing transparency, fiduciary responsibility, and long-term societal value.
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
          <Link to="/business-entrepreneurship" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-amber-600 hover:text-amber-700 transition-colors">
            Business & Entrepreneurship →
          </Link>
          <Link to="/career-readiness" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-amber-600 hover:text-amber-700 transition-colors">
            Career Readiness →
          </Link>
          <Link to="/future-skills" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-amber-600 hover:text-amber-700 transition-colors">
            Future Skills →
          </Link>
          <Link to="/programs" className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-amber-600 hover:text-amber-700 transition-colors">
            Explore All Programs →
          </Link>
        </div>
      </div>
    </div>
  );
}
