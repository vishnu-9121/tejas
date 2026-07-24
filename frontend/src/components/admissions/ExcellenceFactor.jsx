import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowRight, CheckCircle2, Sparkles, RefreshCw, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { sanityService } from '@/services/sanityService';

export function ExcellenceFactor() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  const { data: stepsData } = useQuery({
    queryKey: ['sanity', 'excellence-factor'],
    queryFn: () => sanityService.getExcellenceFactorSteps(),
    staleTime: 5 * 60 * 1000,
  });

  const steps = stepsData && stepsData.length > 0 ? stepsData : [
    {
      questionNumber: 1,
      questionTitle: 'What is your primary professional ambition?',
      questionSubtitle: 'Select the statement that best aligns with your career vision.',
      options: [
        { label: 'Building High-Scale AI & Software Systems', description: 'Deep technical mastery in AI, Cloud, and Software Architecture', recommendedCategory: 'Engineering' },
        { label: 'Leading Tech Products & Business Ventures', description: 'Product management, executive strategy, and scaling tech teams', recommendedCategory: 'Management' },
        { label: 'Extracting Insights from Big Data', description: 'Predictive analytics, machine learning, and data engineering', recommendedCategory: 'Data Science' }
      ]
    },
    {
      questionNumber: 2,
      questionTitle: 'What learning environment enables your best performance?',
      questionSubtitle: 'Tell us how you absorb complex skills most effectively.',
      options: [
        { label: 'Hands-on Labs & Real-World Capstone Projects', description: 'Building functional applications and lab simulations', recommendedCategory: 'Engineering' },
        { label: 'Executive Case Studies & Strategic Workshops', description: 'Analyzing real business scenarios and strategic dilemmas', recommendedCategory: 'Management' }
      ]
    }
  ];

  const handleSelectOption = (option) => {
    setSelectedAnswers({ ...selectedAnswers, [currentStep]: option });
    if (currentStep + 1 < steps.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedAnswers({});
    setIsCompleted(false);
  };

  const recommendedStream = selectedAnswers[0]?.recommendedCategory || 'Engineering & AI';

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto select-none">
      <div className="bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900 rounded-3xl p-6 sm:p-10 border border-amber-500/30 text-white shadow-2xl relative overflow-hidden">
        
        {/* Top Header Badge */}
        <div className="flex flex-col items-center text-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-xs uppercase tracking-widest">
            <Sparkles className="w-4 h-4 fill-current" /> Know Your Excellence Factor
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Discover Your Ideal Academic Path
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
            Answer a few quick questions to evaluate your strengths and unlock a personalized program recommendation.
          </p>
        </div>

        {!isCompleted ? (
          <div>
            {/* Progress Step Bar */}
            <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
              {steps.map((st, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${idx === currentStep ? 'bg-amber-400 text-gray-950 font-extrabold shadow-lg shadow-amber-400/30' : idx < currentStep ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                    {idx < currentStep ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`h-1 w-12 sm:w-20 rounded-full transition-colors ${idx < currentStep ? 'bg-emerald-500' : 'bg-gray-800'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 max-w-2xl mx-auto"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                    {steps[currentStep].questionTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300">
                    {steps[currentStep].questionSubtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {steps[currentStep].options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(opt)}
                      className="w-full text-left p-4 sm:p-5 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-amber-400/60 transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-bold text-sm sm:text-base text-white group-hover:text-amber-300 transition-colors">
                          {opt.label}
                        </div>
                        {opt.description && (
                          <div className="text-xs text-gray-400 mt-1">
                            {opt.description}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0 ml-3" />
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          /* Results Card */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-xl mx-auto space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/40 flex items-center justify-center mx-auto shadow-xl">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Personalized Result</span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                Recommended Track: {recommendedStream}
              </h3>
              <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                Based on your preferences, our flagship programs in <span className="font-bold text-amber-300">{recommendedStream}</span> will accelerate your technical mastery and leadership trajectory.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                as={Link}
                to="/admissions"
                variant="gold"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto font-bold shadow-xl shadow-amber-500/20"
              >
                Apply for Admissions Now
              </Button>
              <Button
                as={Link}
                to="/contact"
                variant="secondary"
                size="lg"
                leftIcon={<PhoneCall className="w-4 h-4" />}
                className="w-full sm:w-auto font-semibold"
              >
                Talk to an Advisor
              </Button>
            </div>

            <button
              onClick={handleReset}
              className="text-xs text-gray-400 hover:text-white inline-flex items-center gap-1.5 pt-2 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retake Evaluation
            </button>
          </motion.div>
        )}

      </div>
    </section>
  );
}
