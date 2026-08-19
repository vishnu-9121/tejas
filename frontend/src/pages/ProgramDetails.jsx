import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Clock, MapPin, Award, CheckCircle2, ChevronDown, 
  Download, ArrowRight, BookOpen, Users, Calendar, Sparkles, HelpCircle, FileText, PhoneCall
} from 'lucide-react';
import { toast } from 'sonner';

import { programService } from '@/services/programService';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SEO } from '@/components/ui/SEO';
import { BrochureDownloadModal } from '@/components/modals/BrochureDownloadModal';

export const ProgramDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);
  const [downloadType, setDownloadType] = useState('brochure');
  const [isDownloading, setIsDownloading] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['program', slug],
    queryFn: () => programService.getProgramBySlug(slug),
  });

  const program = data?.data;

  const handleDownloadBrochure = async (type = 'brochure') => {
    if (!program) return;
    setDownloadType(type);

    if (!user) {
      setIsBrochureModalOpen(true);
      return;
    }

    setIsDownloading(true);
    try {
      await programService.downloadBrochure({
        programId: program._id,
        slug: program.slug || slug,
        programTitle: program.title,
        downloadType: type
      });
      toast.success(`${type === 'curriculum' ? 'Curriculum' : 'Brochure'} download started for ${program.title}!`);
    } catch (err) {
      console.warn('[ProgramDetails] Download error:', err);
      toast.error('Could not download document. Please verify your connection.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Auto-trigger download if user just logged in/registered with ?download=brochure
  useEffect(() => {
    if (searchParams.get('download') && program) {
      const type = searchParams.get('download') === 'curriculum' ? 'curriculum' : 'brochure';
      if (user) {
        handleDownloadBrochure(type);
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('download');
        setSearchParams(newParams, { replace: true });
      } else {
        setDownloadType(type);
        setIsBrochureModalOpen(true);
      }
    }
  }, [user, program, searchParams]);

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
        <h2 className="text-2xl font-bold text-gray-900">Program Not Found</h2>
        <p className="text-gray-500 max-w-md">The requested degree program or certification may have been relocated or updated.</p>
        <Button onClick={() => navigate('/programs')} variant="primary" className="mt-4">
          Explore All Programs &rarr;
        </Button>
      </div>
    );
  }

  const highlights = Array.isArray(program.highlights) ? program.highlights : [];
  const learningOutcomes = Array.isArray(program.learningOutcomes) ? program.learningOutcomes : [];
  const careerOpportunities = Array.isArray(program.careerOpportunities) ? program.careerOpportunities : [];
  const curriculum = Array.isArray(program.curriculum) ? program.curriculum : [];
  const faqs = Array.isArray(program.faqs) ? program.faqs : [];

  const programSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        "name": program.title,
        "description": program.seo?.metaDescription || program.shortDescription || program.overview || program.description,
        "provider": {
          "@type": "EducationalOrganization",
          "name": "Tejas Academy of Excellence",
          "url": "https://unlocktejas.com"
        },
        "url": `https://unlocktejas.com/programs/${slug}`,
        "image": program.posterImage || program.featuredImage || 'https://unlocktejas.com/logo.png',
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": program.mode || "On-Campus",
          "duration": program.duration || "P1Y"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://unlocktejas.com/" },
          { "@type": "ListItem", "position": 2, "name": "Programs", "item": "https://unlocktejas.com/programs" },
          { "@type": "ListItem", "position": 3, "name": program.title, "item": `https://unlocktejas.com/programs/${slug}` }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <SEO 
        title={program.seo?.metaTitle || `${program.title} | Tejas Academy of Excellence`}
        description={program.seo?.metaDescription || program.shortDescription || program.overview || program.description || 'Program details and syllabus at Tejas Academy of Excellence.'}
        canonical={`https://unlocktejas.com/programs/${slug}`}
        image={program.posterImage || program.featuredImage || 'https://unlocktejas.com/logo.png'}
        keywords={program.seo?.keywords || `${program.title}, Tejas Academy, Degree, Syllabus, Admissions`}
        schema={programSchema}
      />

      {/* Hero Header */}
      <div className="relative bg-primary-950 text-white pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-900/90 to-primary-950/80 z-10" />
        {program.posterImage && (
          <img 
            src={program.posterImage.includes('?') ? program.posterImage : `${program.posterImage}?auto=format&w=1600&q=80`} 
            alt={`${program.title} - Tejas Academy Degree Syllabus & Curriculum Banner`} 
            width="1280"
            height="450"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover opacity-20 blur-xs"
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="primary" className="bg-accent-500/20 text-accent-300 border-accent-500/30">
              {program.category || 'Academic Program'}
            </Badge>
            {program.isFeatured && (
              <Badge variant="success" className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Flagship Program
              </Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight text-white max-w-4xl leading-tight">
            {program.title}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-primary-100 max-w-3xl leading-relaxed">
            {program.shortDescription || program.overview || program.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-primary-800/60 max-w-3xl text-sm">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-accent-400 shrink-0" />
              <div>
                <p className="text-xs text-primary-300">Duration</p>
                <p className="font-bold text-white">{program.duration || 'Full-time'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-accent-400 shrink-0" />
              <div>
                <p className="text-xs text-primary-300">Mode</p>
                <p className="font-bold text-white">{program.mode || 'On-Campus'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-accent-400 shrink-0" />
              <div>
                <p className="text-xs text-primary-300">Cohort Intake</p>
                <p className="font-bold text-white">{program.intake || 60} Seats</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-accent-400 shrink-0" />
              <div>
                <p className="text-xs text-primary-300">Degree Level</p>
                <p className="font-bold text-white">{program.degreeLevel || program.level || 'Degree'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: 6 Complete Dynamic Sections */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto select-none">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'curriculum', label: 'Curriculum & Labs' },
                { id: 'outcomes', label: 'Career Outcomes' },
                { id: 'faqs', label: 'FAQs' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">Program Summary</h3>
                  <div className="prose prose-neutral max-w-none text-sm sm:text-base text-gray-600 leading-relaxed space-y-4">
                    <p>{program.overview || program.description || 'Comprehensive industry curriculum crafted by premier academic scholars and corporate experts.'}</p>
                  </div>
                </div>

                {highlights.length > 0 && (
                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 font-serif">Program Highlights</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                          <span className="text-xs sm:text-sm font-medium text-gray-800">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {program.eligibility && (
                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">Eligibility Criteria</h3>
                    <p className="text-sm text-gray-600 bg-amber-50/50 p-4 rounded-xl border border-amber-200/60 font-medium">
                      {program.eligibility}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Curriculum */}
            {activeTab === 'curriculum' && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1 font-serif">Curriculum Architecture</h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      A rigorous multi-semester academic track combining theoretical foundations with practical labs.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadBrochure('curriculum')}
                    disabled={isDownloading}
                    className="shrink-0 text-xs font-semibold"
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" /> Download Syllabus PDF
                  </Button>
                </div>

                {curriculum.length === 0 ? (
                  <p className="text-gray-500 py-8 text-center bg-gray-50 rounded-xl border border-gray-100 text-sm">
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
                          {term.semester || `Semester ${i + 1}`}
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
                    <h3 className="text-xl font-bold text-gray-900 mb-4 font-serif">What You Will Master</h3>
                    <div className="space-y-2.5">
                      {learningOutcomes.map((outcome, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-primary-50/40 rounded-xl border border-primary-100/60">
                          <CheckCircle2 className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                          <p className="text-sm font-medium text-gray-800">{outcome}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {careerOpportunities.length > 0 && (
                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 font-serif">Career Pathways & Roles</h3>
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
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 font-serif">
                  <HelpCircle className="w-5 h-5 text-primary-600" />
                  Frequently Asked Questions
                </h3>
                {faqs.length === 0 ? (
                  <p className="text-gray-500 py-6 text-center text-sm">No FAQs specified for this program.</p>
                ) : (
                  <div className="space-y-3">
                    {faqs.map((faq, index) => {
                      const isOpen = openFaqIndex === index;
                      return (
                        <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                            className="w-full px-5 py-4 text-left font-bold text-sm text-gray-900 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors cursor-pointer"
                          >
                            <span>{faq.question}</span>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {isOpen && (
                            <div className="px-5 py-4 text-sm text-gray-600 bg-white border-t border-gray-100 leading-relaxed">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Right Column: Admission Card & Brochure Download CTA */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sticky top-24">
              
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary-600">Total Program Investment</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-extrabold text-gray-900">
                      {program.fees ? `₹${Number(program.fees).toLocaleString('en-IN')}` : (program.fee || 'Contact Admissions')}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">INR Total</span>
                  </div>
                </div>

                <div className="border-y border-gray-100 py-4 space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-bold text-gray-900">{program.duration || 'Full-time'}</span>
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
                    <span className="font-bold text-gray-900">{program.degreeLevel || program.level || 'Undergraduate'}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full py-4 text-base font-bold shadow-md shadow-primary-600/20" 
                    onClick={() => navigate(`/admissions?program=${encodeURIComponent(program.title || '')}`)}
                  >
                    Apply for this Program &rarr;
                  </Button>

                  {/* Program Brochure Download CTA */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
                    onClick={() => handleDownloadBrochure('brochure')}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 text-primary-600" />
                    )}
                    <span>Download Program Brochure</span>
                  </Button>
                </div>

                <div className="bg-amber-50/60 border border-amber-200/50 rounded-xl p-3 text-[11px] text-amber-900 font-medium text-center">
                  Admissions for 2026 Batch are currently in progress. Apply early for scholarship evaluation.
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Brochure Lead Capture & Download Modal */}
      <BrochureDownloadModal
        isOpen={isBrochureModalOpen}
        onClose={() => setIsBrochureModalOpen(false)}
        program={program}
        downloadType={downloadType}
      />
    </div>
  );
};

export default ProgramDetails;
