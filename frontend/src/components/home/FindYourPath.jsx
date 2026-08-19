import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Briefcase, BookOpen, GraduationCap, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';

const QUESTIONS = [
  {
    id: 1,
    title: "What describes you best?",
    options: [
      { id: 'hs', label: 'High School Student', icon: BookOpen },
      { id: 'ug', label: 'Undergraduate Student', icon: GraduationCap },
      { id: 'pro', label: 'Working Professional', icon: Briefcase },
    ]
  },
  {
    id: 2,
    title: "What is your primary goal?",
    options: [
      { id: 'tech', label: 'Master Technology & AI', icon: CheckCircle2 },
      { id: 'biz', label: 'Learn Business Leadership', icon: CheckCircle2 },
      { id: 'ent', label: 'Start My Own Company', icon: CheckCircle2 },
    ]
  }
];

export function FindYourPath() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (optionId) => {
    setAnswers({ ...answers, [step]: optionId });
    if (step < QUESTIONS.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      setTimeout(() => setShowResult(true), 400);
    }
  };

  const getRecommendation = () => {
    if (answers[1] === 'tech') return { title: 'Autonomous Systems & AI', link: '/programs' };
    if (answers[1] === 'biz') return { title: 'Financial Management & Wealth Creation', link: '/programs' };
    if (answers[1] === 'ent') return { title: 'Executive Leadership & Innovation', link: '/programs' };
    return { title: 'Explore All Programs', link: '/programs' };
  };

  return (
    <section className="py-12 bg-white relative z-20 -mt-10 mb-10 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-3xl shadow-xl shadow-primary-900/5 border border-neutral-100 overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Promo */}
        <div className="bg-primary-900 p-8 md:p-12 md:w-5/12 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <h3 className="text-3xl font-serif font-bold mb-4 relative z-10">Find Your Path</h3>
          <p className="text-primary-100 mb-8 relative z-10 leading-relaxed">
            Answer two quick questions to discover the perfect program tailored to your career aspirations.
          </p>
          <div className="flex gap-2 relative z-10 mt-auto">
            {QUESTIONS.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step && !showResult ? 'bg-accent-500' : 'bg-white/20'}`} />
            ))}
          </div>
        </div>

        {/* Right Side: Quiz */}
        <div className="p-8 md:p-12 md:w-7/12 relative min-h-[300px] flex items-center bg-gray-50">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <h4 className="text-xl font-bold text-gray-900 mb-6">{QUESTIONS[step].title}</h4>
                <div className="space-y-3">
                  {QUESTIONS[step].options.map(opt => {
                    const Icon = opt.icon;
                    const isSelected = answers[step] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelect(opt.id)}
                        className={`w-full flex items-center p-4 rounded-xl border text-left transition-all duration-200 ${
                          isSelected 
                            ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500/20 shadow-sm' 
                            : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-md'
                        }`}
                      >
                        <div className={`p-2 rounded-lg mr-4 ${isSelected ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                          <Icon size={20} />
                        </div>
                        <span className={`font-semibold ${isSelected ? 'text-primary-700' : 'text-gray-700'}`}>
                          {opt.label}
                        </span>
                        <ChevronRight className={`ml-auto ${isSelected ? 'text-primary-500' : 'text-gray-300'}`} size={20} />
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full text-center py-6"
              >
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Recommended For You</h4>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{getRecommendation().title}</h3>
                <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                  Based on your goals, this program offers the perfect curriculum to accelerate your career.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={() => { setStep(0); setShowResult(false); setAnswers({}); }}>
                    Retake
                  </Button>
                  <Button variant="primary" rightIcon={<ArrowRight />} as={Link} to={getRecommendation().link}>
                    View Program
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
