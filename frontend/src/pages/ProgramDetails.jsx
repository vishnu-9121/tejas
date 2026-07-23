import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';
import { SEO } from '@/components/ui/SEO';

const DUMMY_PROGRAMS = [
  { _id: "1", title: "Global Leadership Certificate", category: "Leadership", description: "Develop advanced leadership skills for the modern world. This comprehensive program spans multiple disciplines to forge resilient, adaptable leaders capable of navigating global complexities.", duration: "6 Months", format: "Online", credits: 15, tuitionFee: 4500, slug: "global-leadership", curriculum: [{ termName: "Term 1", courses: [{title: "Foundations of Leadership"}, {title: "Ethics in Business"}] }] },
  { _id: "2", title: "Startup Engineering", category: "Entrepreneurship", description: "From idea to execution: building scalable startups. Learn the technical and business fundamentals required to launch your own venture.", duration: "1 Year", format: "Hybrid", credits: 30, tuitionFee: 8000, slug: "startup-engineering", curriculum: [{ termName: "Semester 1", courses: [{title: "Product Design"}, {title: "Venture Capital basics"}] }] },
  { _id: "3", title: "Mastering Communication", category: "Communication", description: "Learn to articulate vision and lead teams effectively. This course focuses on public speaking, negotiation, and corporate communications.", duration: "3 Months", format: "On-Campus", credits: 10, tuitionFee: 2500, slug: "mastering-communication", curriculum: [{ termName: "Core", courses: [{title: "Public Speaking 101"}, {title: "Crisis Communication"}] }] }
];

export const ProgramDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['program', slug],
    queryFn: () => api.get(`/programs/${slug}`),
  });

  let program = data?.data?.data;
  
  if (error || !program) {
    program = DUMMY_PROGRAMS.find(p => p.slug === slug);
  }

  if (isLoading) {
    return (
      <div className="py-20 max-w-7xl mx-auto px-4 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="py-20 max-w-7xl mx-auto px-4 flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Program Not Found</h2>
        <Button variant="outline" onClick={() => navigate('/programs')}>Back to Programs</Button>
      </div>
    );
  }

  const tabs = [
    { label: 'Overview', content: <p className="text-gray-700 whitespace-pre-line">{program.description || 'No overview available.'}</p> },
    { 
      label: 'Curriculum', 
      content: program.curriculum?.length > 0 ? (
        <div className="space-y-4">
          {program.curriculum.map((term, i) => (
            <div key={i} className="mb-4">
              <h4 className="font-bold text-gray-900 mb-2">{term.termName}</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {term.courses.map((course, j) => (
                  <li key={j}>{course.title || course.code}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-700">Curriculum details not available.</p>
      )
    },
    { label: 'Outcomes', content: <p className="text-gray-700 whitespace-pre-line">{program.outcomes || 'No outcomes specified.'}</p> }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": program.title,
    "description": program.description || `Enroll in the ${program.title} program at Tejas Academy.`,
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Tejas Academy of Excellence",
      "sameAs": "https://tejasacademy.edu.in"
    }
  };

  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <SEO 
        title={program.title}
        description={program.description?.substring(0, 160) || `${program.title} program offered by Tejas Academy`}
        keywords={`${program.title}, ${program.category}, Tejas Academy, Education, Course`}
        schema={schema}
      />
      <SectionHeader 
        title={program.title} 
        subtitle={program.category}
        align="left" 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
            <Tabs tabs={tabs} />
          </div>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-primary-50 p-6 rounded-xl border border-primary-100">
            <h3 className="text-xl font-bold text-primary-900 mb-4">Program Details</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex justify-between">
                <span className="text-gray-600 font-medium">Duration</span>
                <span className="text-gray-900 font-bold">{program.duration || 'N/A'}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 font-medium">Format</span>
                <span className="text-gray-900 font-bold">{program.format || 'N/A'}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 font-medium">Credits</span>
                <span className="text-gray-900 font-bold">{program.credits || 'N/A'}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 font-medium">Tuition</span>
                <span className="text-gray-900 font-bold">${program.tuitionFee?.toLocaleString() || 'N/A'}</span>
              </li>
            </ul>
            <Button className="w-full" onClick={() => navigate('/admissions')}>Apply for this Program</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
