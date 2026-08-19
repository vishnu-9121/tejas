import React from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';
import { Lock, Download, FileText } from 'lucide-react';
import { SEO } from '@/components/ui/SEO';

const fallbackResources = [
  { id: 'res-1', title: 'Official Academic Prospectus 2026', desc: 'Complete institutional handbook detailing pedagogy, faculties, labs, and degree curricula.', format: 'PDF (3.2 MB)', downloadUrl: '/brochure.pdf', premium: false },
  { id: 'res-2', title: 'The Tejas Imperative of Human Excellence', desc: 'Comprehensive research paper outlining our 5-dimensional framework for character and competence.', format: 'PDF (1.8 MB)', downloadUrl: '/brochure.pdf', premium: false },
  { id: 'res-3', title: 'Foundations of Applied Artificial Intelligence', desc: 'Syllabus and prerequisite roadmap for undergraduate and professional deeptech certifications.', format: 'PDF (2.4 MB)', downloadUrl: '/brochure.pdf', premium: false },
  { id: 'res-4', title: 'Executive Leadership Blueprint', desc: 'Exclusive guide on developing ethical leadership, decision making, and high-performance team culture.', format: 'PDF (2.1 MB)', downloadUrl: '/brochure.pdf', premium: true },
  { id: 'res-5', title: 'Case Studies: Innovation Labs in Action', desc: 'Deep dive into student venture prototypes, startup clinics, and patent filings.', format: 'PDF (2.9 MB)', downloadUrl: '/brochure.pdf', premium: true },
  { id: 'res-6', title: 'Admissions Evaluation & Interview Kit', desc: 'Diagnostic frameworks and guiding questions for prospective undergraduate and postgraduate scholars.', format: 'PDF (1.5 MB)', downloadUrl: '/brochure.pdf', premium: true },
];

export const Resources = () => {
  const { user } = useAuthStore();

  const { data: cmsResponse } = useQuery({
    queryKey: ['cms', 'resources'],
    queryFn: () => cmsService.getCmsData('resources'),
    staleTime: 60 * 1000,
  });

  const cmsData = cmsResponse?.data?.publishedData || cmsResponse?.data?.data || cmsResponse?.data;
  const pageTitle = cmsData?.title || "Student & Academic Resources";
  const pageSubtitle = cmsData?.subtitle || "Explore downloadable guides, research whitepapers, brochures, and foundational curriculum overviews.";

  const resources = (cmsData?.items && cmsData.items.length > 0)
    ? cmsData.items.map(item => ({
        id: item.id || item._id,
        title: item.title,
        desc: item.description || item.desc,
        format: item.format,
        downloadUrl: item.downloadUrl || '/brochure.pdf',
        premium: item.premium || false
      }))
    : fallbackResources;

  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <SEO 
        title="Learning Resources & Open Materials" 
        description="Access official brochures, academic guides, interview kits, and learning materials from Tejas Academy."
        url="https://unlocktejas.com/resources"
      />
      <SectionHeader 
        title={pageTitle} 
        description={pageSubtitle} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {resources.map(res => (
          <div key={res.id} className="p-6 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm hover:shadow-md transition-all bg-white dark:bg-gray-900 relative overflow-hidden group flex flex-col justify-between">
            <div>
              {res.premium && !user && (
                <div className="absolute top-4 right-4 bg-gray-100 dark:bg-gray-800 text-gray-500 p-2 rounded-full">
                  <Lock className="w-4 h-4" />
                </div>
              )}
              
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 border border-amber-200/50">
                <FileText className="w-5 h-5" />
              </div>

              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white pr-8">{res.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">{res.desc}</p>
            </div>
            
            {res.premium && !user ? (
              <Link to="/register">
                <Button variant="outline" className="w-full">
                  Create Account to Unlock
                </Button>
              </Link>
            ) : (
              <a 
                href={res.downloadUrl || '/brochure.pdf'} 
                download 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors pt-4 border-t border-gray-100 dark:border-gray-800"
              >
                <Download className="w-4 h-4" />
                Download Resource {res.format ? `(${res.format})` : ''}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
