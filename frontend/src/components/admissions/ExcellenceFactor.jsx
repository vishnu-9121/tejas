import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowRight, CheckCircle2, Sparkles, RefreshCw, PhoneCall, Compass } from 'lucide-react';
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

  const defaultSteps = [
    {
      questionNumber: 1,
      questionTitle: 'What is your primary professional ambition?',
      questionSubtitle: 'Select the statement that best aligns with your career vision.',
      options: [
        { 
          label: 'BUILDING & LEADING VENTURES', 
          description: 'Entrepreneurship, innovation, business creation, and venture leadership', 
          recommendedCategory: 'Venture Leadership & Entrepreneurship',
          recommendedDetails: 'Designed for ambitious founders, startup architects, and innovators looking to build scalable global enterprises.'
        },
        { 
          label: 'LEADING BUSINESSES & STRATEGY', 
          description: 'Business leadership, product thinking, strategic decision-making, and organizational growth', 
          recommendedCategory: 'Business Leadership & Strategic Management',
          recommendedDetails: 'Designed for future corporate leaders, product heads, and strategic thinkers aiming for high-impact organizational leadership.'
        },
        { 
          label: 'SHAPING THE FUTURE', 
          description: 'AI, technology, policy, social innovation, and transformational leadership', 
          recommendedCategory: 'Emerging Tech, AI & Transformational Leadership',
          recommendedDetails: 'Designed for pioneers building generative technologies, ethical AI frameworks, and transformative systemic solutions.'
        }
      ]
    },
    {
      questionNumber: 2,
      questionTitle: 'What learning environment best enables your vision?',
      questionSubtitle: 'Choose the learning ecosystem that matches your operational style.',
      options: [
        { 
          label: 'Venture Incubation & Rapid Prototyping Labs', 
          description: 'Active startup sandboxes, angel pitch sessions, product-market fit sprints, and venture mentor guidance', 
          recommendedCategory: 'Venture Leadership & Entrepreneurship' 
        },
        { 
          label: 'Executive Case Labs & Boardroom Simulations', 
          description: 'Real-world P&L management, strategic negotiation, product leadership, and organizational scaling', 
          recommendedCategory: 'Business Leadership & Strategic Management' 
        },
        { 
          label: 'Advanced AI Research Labs & Frontier Tech Sprints', 
          description: 'Hands-on neural model training, ethical AI governance, and transformational innovation', 
          recommendedCategory: 'Emerging Tech, AI & Transformational Leadership' 
        }
      ]
    }
  ];

  const steps = stepsData && stepsData.length > 0 ? stepsData : defaultSteps;

  const handleSelectOption = (option) => {
    const updated = { ...selectedAnswers, [currentStep]: option };
    setSelectedAnswers(updated);
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

  const primaryChoice = selectedAnswers[0] || {};
  const recommendedStream = primaryChoice.recommendedCategory || 'Venture Leadership & Strategy';
  const recommendedDescription = primaryChoice.recommendedDetails || 'Our industry-immersed curriculum and global executive mentorship will accelerate your career vision.';

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto select-none">
      <div className="bg-gradient-to-br from-gray-900 via-[#102012] to-gray-950 rounded-3xl p-6 sm:p-10 border border-amber-500/30 text-white shadow-2xl relative overflow-hidden ring-1 ring-amber-400/20">
        
        {/* Background Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Badge */}
        <div className="flex flex-col items-center text-center gap-3 mb-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-xs uppercase tracking-widest">
            <Sparkles className="w-4 h-4 fill-current text-amber-400" /> Know Your Excellence Factor
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Discover Your Ideal Academic Path
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl">
            Select the options that match your ambition to unlock a personalized program recommendation tailored to your goals.
          </p>
        </div>

        {!isCompleted ? (
          <div className="relative z-10">
            {/* Progress Step Bar */}
            <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
              {steps.map((st, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${idx === currentStep ? 'bg-amber-400 text-gray-950 font-extrabold shadow-lg shadow-amber-400/30 ring-2 ring-amber-300' : idx < currentStep ? 'bg-emerald-500 text-white' : 'bg-gray-800/80 text-gray-400 border border-gray-700'}`}>
                    {idx < currentStep ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`h-1 w-16 sm:w-24 rounded-full transition-colors ${idx < currentStep ? 'bg-emerald-500' : 'bg-gray-800'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-4 max-w-2xl mx-auto"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5 font-serif">
                    {steps[currentStep].questionTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-200/80">
                    {steps[currentStep].questionSubtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {steps[currentStep].options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      className="w-full text-left p-4 sm:p-5 rounded-2xl bg-white/5 hover:bg-white/12 border border-white/10 hover:border-amber-400/60 transition-all flex items-center justify-between group cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    >
                      <div className="pr-4">
                        <div className="font-extrabold text-sm sm:text-base text-white group-hover:text-amber-300 tracking-wide transition-colors">
                          {opt.label}
                        </div>
                        {opt.description && (
                          <div className="text-xs sm:text-sm text-gray-300 group-hover:text-emerald-100/90 mt-1 leading-relaxed transition-colors">
                            {opt.description}
                          </div>
                        )}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-amber-400 group-hover:text-gray-950 flex items-center justify-center text-gray-400 transition-all shrink-0">
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
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
            className="text-center max-w-xl mx-auto space-y-6 relative z-10"
          >
            <div className="w-16 h-16 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/40 flex items-center justify-center mx-auto shadow-xl ring-4 ring-amber-400/10">
              <Trophy className="w-8 h-8 text-amber-400" />
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Your Personalized Recommendation</span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                {recommendedStream}
              </h3>
              <p className="text-sm text-emerald-100/90 mt-3 leading-relaxed">
                {recommendedDescription}
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
                Apply for Admissions
              </Button>
              <Button
                as={Link}
                to="/programs"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto font-semibold"
              >
                Explore Track Programs
              </Button>
            </div>

            <div>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-gray-400 hover:text-white inline-flex items-center gap-1.5 pt-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retake Question Evaluation
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}

export default ExcellenceFactor;
