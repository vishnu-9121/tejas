import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Building2, CheckCircle2, ArrowRight, PhoneCall, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { sanityService } from '@/services/sanityService';
import { SEO } from '@/components/ui/SEO';

export default function ForInstitutions() {
  const { data: servicesData } = useQuery({
    queryKey: ['sanity', 'institution-services'],
    queryFn: () => sanityService.getInstitutionServices(),
    staleTime: 5 * 60 * 1000,
  });

  const services = servicesData && servicesData.length > 0 ? servicesData : [
    {
      _id: 'inst-1',
      title: 'Faculty Development Programs (FDP)',
      category: 'Faculty Upskilling',
      description: 'Comprehensive workshops empowering educators with the latest pedagogical tools, AI research methods, and industry case studies.',
      keyBenefits: ['AI Curriculum Integration', 'Research Paper Publishing Support', 'Certificates of Academic Mastery']
    },
    {
      _id: 'inst-2',
      title: 'Institutional Placement & Skill Training Bootcamps',
      category: 'Student Employability',
      description: 'Customized bootcamp modules designed to elevate student interview readiness, coding benchmarks, and soft skills.',
      keyBenefits: ['Mock Technical Interviews', 'Placement Assessment Engine', 'Direct Corporate MoUs']
    },
    {
      _id: 'inst-3',
      title: 'Academic MoUs & Innovation Lab Setup',
      category: 'Campus Infrastructure',
      description: 'Establish state-of-the-art AI, IoT, and Robotics laboratories on your campus backed by industry mentorship.',
      keyBenefits: ['Hardware & Software Setup', 'Industry Project Licences', 'Joint Certification Programs']
    }
  ];

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
      <SEO 
        title="Solutions for Educational Institutions & Universities" 
        description="Partner with Tejas Academy of Excellence for Faculty Development Programs (FDP), student placement bootcamps, and academic MoUs." 
        canonical="https://unlocktejas.com/for-institutions"
      />
      <SectionHeader 
        title="Solutions for Educational Institutions & Universities" 
        description="Partner with Tejas Academy of Excellence for Faculty Development Programs (FDP), student placement bootcamps, and academic MoUs." 
      />

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {services.map((svc) => (
          <div 
            key={svc._id} 
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
                {svc.keyBenefits?.map((b, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-gray-700 dark:text-gray-200">
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
          <h3 className="text-2xl sm:text-3xl font-serif font-bold">Partner Your University with Tejas Academy</h3>
          <p className="text-sm text-primary-100/90 leading-relaxed">Schedule a consultation with our Institutional Partnerships Director today.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Button as={Link} to="/contact" variant="gold" size="lg" leftIcon={<PhoneCall className="w-4 h-4" />} className="font-bold">
            Contact Partnerships Desk
          </Button>
        </div>
      </div>
    </div>
  );
}
