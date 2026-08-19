import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Building2, CheckCircle2, ArrowRight, PhoneCall, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';
import { sanityService } from '@/services/sanityService';
import { SEO } from '@/components/ui/SEO';

const fallbackServices = [
  {
    _id: 'inst-1',
    id: 'inst-1',
    title: 'Faculty Development Programs (FDP)',
    category: 'Faculty Upskilling',
    description: 'Comprehensive workshops empowering educators with the latest pedagogical tools, AI research methods, and industry case studies.',
    keyBenefits: ['AI Curriculum Integration', 'Research Paper Publishing Support', 'Certificates of Academic Mastery']
  },
  {
    _id: 'inst-2',
    id: 'inst-2',
    title: 'Institutional Career Development & Skill Bootcamps',
    category: 'Student Competence',
    description: 'Customized bootcamp modules designed to elevate student interview readiness, coding benchmarks, and professional skills.',
    keyBenefits: ['Mock Technical Interviews', 'Career Readiness Assessment Engine', 'Direct Corporate Alliances']
  },
  {
    _id: 'inst-3',
    id: 'inst-3',
    title: 'Academic MoUs & Innovation Lab Setup',
    category: 'Campus Infrastructure',
    description: 'Establish state-of-the-art AI, IoT, and Robotics laboratories on your campus backed by industry mentorship.',
    keyBenefits: ['Hardware & Software Setup', 'Industry Project Licences', 'Joint Certification Programs']
  }
];

export default function ForInstitutions() {
  // 1. Fetch from Custom CMS (MongoDB ContentEntry)
  const { data: cmsResponse } = useQuery({
    queryKey: ['cms', 'for-institutions'],
    queryFn: () => cmsService.getCmsData('for-institutions'),
    staleTime: 60 * 1000,
  });

  // 2. Fallback to Sanity
  const { data: sanityServices } = useQuery({
    queryKey: ['sanity', 'institution-services'],
    queryFn: () => sanityService.getInstitutionServices(),
    staleTime: 5 * 60 * 1000,
  });

  const cmsData = cmsResponse?.data?.publishedData || cmsResponse?.data?.data || cmsResponse?.data;
  
  const pageTitle = cmsData?.title || "Institutional Partnerships & Capacity Building";
  const pageSubtitle = cmsData?.subtitle || "Collaborate with Tejas Academy of Excellence on Faculty Development Programmes (FDP), applied research incubation, and student human excellence initiatives.";

  const services = (cmsData?.services && cmsData.services.length > 0)
    ? cmsData.services
    : (sanityServices && sanityServices.length > 0 ? sanityServices : fallbackServices);

  const banner = cmsData?.contactBanner || {
    title: 'Partner Your University with Tejas Academy',
    description: 'Schedule a consultation with our Institutional Partnerships Director today.',
    buttonText: 'Contact Partnerships Desk',
    buttonLink: '/contact'
  };

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Solutions for Educational Institutions & Universities" 
        description="Partner with Tejas Academy of Excellence for Faculty Development Programmes (FDP), career readiness bootcamps, and academic MoUs." 
        url="https://unlocktejas.com/for-institutions"
      />
      <SectionHeader 
        title={pageTitle} 
        description={pageSubtitle} 
      />

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {services.map((svc, idx) => (
          <div 
            key={svc._id || svc.id || idx} 
            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6" />
              </div>

              <span className="text-xs font-bold uppercase tracking-widest text-amber-500">{svc.category}</span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1 mb-3">{svc.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{svc.description}</p>

              <div className="space-y-2.5 mb-6">
                {svc.keyBenefits?.map((b, bIdx) => (
                  <div key={bIdx} className="flex items-center gap-2.5 text-xs font-semibold text-gray-700 dark:text-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              as={Link} 
              to="/contact" 
              variant="outline" 
              fullWidth
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="font-bold text-xs"
            >
              Request Partnership Proposal
            </Button>
          </div>
        ))}
      </div>

      {/* Contact Banner for Institutions */}
      <div className="mt-16 bg-gradient-to-r from-primary-900 via-primary-950 to-primary-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-amber-400/30">
        <div className="space-y-2 text-center md:text-left max-w-xl">
          <h3 className="text-2xl sm:text-3xl font-serif font-bold">{banner.title}</h3>
          <p className="text-sm text-primary-100/90 leading-relaxed">{banner.description}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Button as={Link} to={banner.buttonLink || "/contact"} variant="gold" size="lg" leftIcon={<PhoneCall className="w-4 h-4" />} className="font-bold">
            {banner.buttonText || "Contact Partnerships Desk"}
          </Button>
        </div>
      </div>
    </div>
  );
}
