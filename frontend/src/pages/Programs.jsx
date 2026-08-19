import React, { useState } from 'react';
import { ProgramCard } from '../components/cards/ProgramCard';
import { Button } from '../components/ui/Button';
import { Search, Filter, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { programService } from '@/services/programService';
import { CareerCounselor } from '@/components/academics/CareerCounselor';
import { SEO } from '@/components/ui/SEO';

const DUMMY_PROGRAMS = [
  { 
    _id: "btech-ai-ds", 
    title: "B.Tech in Artificial Intelligence & Data Science", 
    category: "Undergraduate", 
    description: "A cutting-edge 4-year engineering program covering Machine Learning, Neural Networks, Cloud AI, and Ethical AI Systems.", 
    duration: "4 Years",
    fees: 1200000,
    mode: "On-Campus",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800", 
    slug: "btech-in-artificial-intelligence-and-data-science" 
  },
  { 
    _id: "pgp-mgmt", 
    title: "Post Graduate Program in Management", 
    category: "Postgraduate", 
    description: "A transformative 2-year program designed to build future global leaders with strong ethical foundations.", 
    duration: "2 Years",
    fees: 1500000,
    mode: "On-Campus",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800", 
    slug: "post-graduate-program-in-management" 
  },
  { 
    _id: "bba-he", 
    title: "BBA in Human Excellence", 
    category: "Undergraduate", 
    description: "A unique undergraduate program focusing on holistic development, character building, and modern business practices.", 
    duration: "3 Years",
    fees: 800000,
    mode: "On-Campus",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800", 
    slug: "bba-in-human-excellence" 
  }
];

export const Programs = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: programsData, isLoading, error } = useQuery({
    queryKey: ['public-programs', 'all'],
    queryFn: () => programService.getPrograms({ status: 'published' }),
  });

  const apiPrograms = programsData?.data?.programs || programsData?.data?.data || (Array.isArray(programsData?.data) ? programsData.data : []);
  const allProgramsList = apiPrograms && apiPrograms.length > 0 ? apiPrograms : DUMMY_PROGRAMS;

  const categories = ['All', 'Undergraduate', 'Postgraduate', 'Executive', 'Certification', 'Engineering', 'Management'];

  const filteredPrograms = allProgramsList.filter(prog => {
    const matchesCategory = activeCategory === 'All' || (prog.category && prog.category.toLowerCase() === activeCategory.toLowerCase());
    const titleMatch = prog.title ? prog.title.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const descMatch = prog.description ? prog.description.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const catMatch = prog.category ? prog.category.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    return matchesCategory && (titleMatch || descMatch || catMatch);
  });

  return (
    <div className="py-16 md:py-24 bg-gray-50/50 min-h-screen">
      <SEO 
        title="Academic Programmes & Degrees" 
        description="Discover comprehensive undergraduate, postgraduate, and executive programmes at Tejas Academy of Excellence."
        url="https://unlocktejas.com/programs"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-700 border border-primary-100 uppercase tracking-widest mb-3">
            Knowledge → Practice → Feedback → Iteration → Mastery
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Academic <span className="text-primary-600">Programmes</span>
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            Rigorous degree programmes designed around active, reflective, and purposefully practical learning to forge ethical leaders and creative masters.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeCategory === category
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              aria-label="Search academic programs"
              placeholder="Search programs by name, topic..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-[400px] animate-pulse border border-gray-100 shadow-sm"></div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-10 h-10 mb-2 text-red-500" />
            <h3 className="text-base font-bold mb-1">Failed to load live programs</h3>
            <p className="text-xs text-red-500">Showing catalog fallback. Please check connection.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredPrograms.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 max-w-xl mx-auto">
            <Filter className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">No programs found</h3>
            <p className="text-xs text-gray-500 mb-4">
              We couldn't find any programs matching your search filters.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Programs Grid */}
        {!isLoading && filteredPrograms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => (
              <ProgramCard key={program._id || program.slug} {...program} />
            ))}
          </div>
        )}

        {/* Career Counselor Section */}
        <div className="mt-20">
          <CareerCounselor />
        </div>
      </div>
    </div>
  );
};

export default Programs;
