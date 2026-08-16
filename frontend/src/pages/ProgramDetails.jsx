import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Clock, MapPin, Award, CheckCircle2, ChevronDown, 
  Download, ArrowRight, BookOpen, Users, Calendar, Sparkles, HelpCircle 
} from 'lucide-react';

import { programService } from '@/services/programService';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SEO } from '@/components/ui/SEO';

export const ProgramDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['program', slug],
    queryFn: () => programService.getProgramBySlug(slug),
  });

  const program = data?.data;

  if (isLoading) {
    return (
      <div className="py-32 max-w-7xl mx-auto px-4 flex flex-col justify-center items-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading program syllabus and details...</p>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="py-32 max-w-7xl mx-auto px-4 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Program Not Found</h2>
        <p className="text-gray-600 max-w-md">
          The requested program could not be located. It may have been renamed or archived.
        </p>
        <Button variant="primary" onClick={() => navigate('/programs')}>
          Explore All Programs
        </Button>
      </div>
    );
  }

  const posterImage = program.posterImage || program.poster || program.featuredImage || program.thumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80';
  const bannerImage = program.bannerUrl || posterImage;

  const curriculum = program.curriculum || [];
  const highlights = program.highlights || [];
  const learningOutcomes = program.learningOutcomes || [];
  const careerOpportunities = program.careerOpportunities || [];
  const faqs = program.faqs || [];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <SEO 
        title={`${program.title} | Tejas Academy`}
        description={program.shortDescription || program.description?.substring(0, 160) || `${program.title} program offered by Tejas Academy`}
        keywords={`${program.title}, ${program.category}, Tejas Academy, Admissions 2026, Higher Education`}
      />

      {/* Hero Header */}
      <div className="relative bg-navy-900 text-white overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src={bannerImage} alt={program.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary" className="bg-primary-500/20 text-primary-300 border border-primary-400/30">
                {program.category || 'Undergraduate'}
              </Badge>
              {program.mode && (
                <Badge variant="default" className="bg-white/10 text-white border border-white/20">
                  {program.mode}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {program.title}
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed line-clamp-3">
              {program.shortDescription || program.description}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-400" />
                <span>Duration: <strong>{program.duration || '1 Year'}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-400" />
                <span>Seats: <strong>{program.intake || 60} Intake</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-primary-400" />
                <span>Eligibility: <strong>{program.eligibility?.substring(0, 30) || '10+2 / Graduation'}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Navigation & Content Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 flex flex-wrap gap-2">
              {[
                { id: 'overview', label: 'Program Overview' },
                { id: 'curriculum', label: 'Curriculum & Modules' },
                { id: 'outcomes', label: 'Outcomes & Careers' },
                { id: 'faqs', label: 'FAQs' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">About the Program</h3>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line space-y-3">
                    {program.overview || program.description || 'Comprehensive program curriculum engineered to build future-ready leaders.'}
                  </div>
                </div>

                {highlights.length > 0 && (
                  <div className="pt-6 border-t border-gray-100">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      Key Program Highlights
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-800">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Curriculum */}
            {activeTab === 'curriculum' && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Curriculum Architecture</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    A rigorous multi-semester academic track combining fundamental concepts with practical labs.
                  </p>
                </div>

                {curriculum.length === 0 ? (
                  <p className="text-gray-500 py-8 text-center bg-gray-50 rounded-xl border border-gray-100">
                    Curriculum outline is being finalized for the upcoming batch.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {curriculum.map((term, i) => (
                      <div key={i} className="p-5 rounded-xl border border-gray-200 bg-gray-50/60 space-y-3">
                        <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-black">
                            {i + 1}
                          </span>
                          {term.semester || `Term ${i + 1}`}
                        </h4>
                        <div className="flex flex-wrap gap-2 pl-9">
                          {(term.courses || []).map((course, j) => (
                            <span 
                              key={j} 
                              className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-800 shadow-2xs"
                            >
                              {typeof course === 'string' ? course : (course.title || course.name)}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Outcomes & Careers */}
            {activeTab === 'outcomes' && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
                {learningOutcomes.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">What You Will Master</h3>
                    <div className="space-y-2.5">
                      {learningOutcomes.map((outcome, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-primary-50/40 rounded-xl border border-primary-100/60">
                          <CheckCircle2 className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm font-medium text-gray-800">{outcome}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {careerOpportunities.length > 0 && (
                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Career Pathways & Roles</h3>
                    <div className="flex flex-wrap gap-2">
                      {careerOpportunities.map((role, idx) => (
                        <span key={idx} className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-bold text-gray-800">
                          💼 {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: FAQs */}
            {activeTab === 'faqs' && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary-600" />
                  Frequently Asked Questions
                </h3>

                {faqs.length === 0 ? (
                  <p className="text-gray-500 py-8 text-center bg-gray-50 rounded-xl border border-gray-100">
                    Have questions? Contact our admissions counselors at admissions@unlocktejas.com.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {faqs.map((faq, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                          className="w-full p-4 text-left font-bold text-gray-900 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${openFaqIndex === idx ? 'rotate-180' : ''}`} />
                        </button>
                        {openFaqIndex === idx && (
                          <div className="p-4 text-sm text-gray-700 bg-white border-t border-gray-100 leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Sticky Program Summary & Apply Card */}
          <div className="lg:col-span-1 space-y-6 sticky top-24">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Poster Cover */}
              <div className="h-52 w-full bg-gray-100 relative overflow-hidden">
                <img src={posterImage} alt={program.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  <Badge variant="primary">{program.category || 'Program'}</Badge>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Total Tuition Fee</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-gray-900">
                      ₹{(program.fees || 0).toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">INR Total</span>
                  </div>
                </div>

                <div className="border-y border-gray-100 py-4 space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-bold text-gray-900">{program.duration || '1 Year'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Mode</span>
                    <span className="font-bold text-gray-900">{program.mode || 'On-Campus'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Intake / Capacity</span>
                    <span className="font-bold text-gray-900">{program.intake || 60} Seats</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Academic Level</span>
                    <span className="font-bold text-gray-900">{program.degreeLevel || 'Undergraduate'}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full py-4 text-base font-bold shadow-md shadow-primary-600/20" 
                    onClick={() => navigate(`/admissions?program=${encodeURIComponent(program.title || '')}`)}
                  >
                    Apply for this Program &rarr;
                  </Button>

                  {program.brochureUrl && (
                    <a 
                      href={program.brochureUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-4 h-4" /> Download Prospectus
                    </a>
                  )}
                </div>

                <p className="text-[11px] text-center text-gray-400">
                  Admissions for 2026 Batch are currently in progress. Apply early to secure scholarship consideration.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProgramDetails;
