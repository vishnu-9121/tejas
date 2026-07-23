import React from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { Lock, Download } from 'lucide-react';

export const Resources = () => {
  const { user } = useAuthStore();

  const resources = [
    { id: 1, title: 'Admissions Brochure 2026', desc: 'Complete overview of our programs and campus life.', premium: false },
    { id: 2, title: 'Fee Structure & Scholarships', desc: 'Detailed breakdown of tuition and financial aid options.', premium: false },
    { id: 3, title: 'Academic Calendar', desc: 'Important dates for the upcoming academic year.', premium: false },
    { id: 4, title: 'Leadership Blueprint (PDF)', desc: 'Exclusive guide on developing executive leadership skills.', premium: true },
    { id: 5, title: 'Case Study: Alumni Success', desc: 'Deep dive into the career trajectories of our top alumni.', premium: true },
    { id: 6, title: 'Interview Preparation Kit', desc: 'Frameworks and common questions for the admissions interview.', premium: true },
  ];

  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <SectionHeader 
        title="Student Resources" 
        description="Helpful guides, policies, and materials. Premium resources are reserved for our community members." 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {resources.map(res => (
          <div key={res.id} className="p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all bg-white relative overflow-hidden group">
            {res.premium && !user && (
              <div className="absolute top-4 right-4 bg-gray-100 text-gray-500 p-2 rounded-full">
                <Lock className="w-4 h-4" />
              </div>
            )}
            
            <h3 className="font-bold text-lg mb-2 text-gray-900 pr-8">{res.title}</h3>
            <p className="text-gray-600 mb-6 text-sm">{res.desc}</p>
            
            {res.premium && !user ? (
              <Link to="/signup">
                <Button variant="outline" className="w-full">
                  Create Account to Unlock
                </Button>
              </Link>
            ) : (
              <Button variant="ghost" className="text-primary-600 hover:text-primary-700 px-0 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
