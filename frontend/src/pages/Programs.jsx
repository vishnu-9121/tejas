import React, { useState } from 'react';
import { ProgramCard } from '../components/cards/ProgramCard';
import { Button } from '../components/ui/Button';
import { Search, Filter, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { programService } from '@/services/programService';
import { CareerCounselor } from '@/components/academics/CareerCounselor';

const DUMMY_PROGRAMS = [
  { _id: "1", title: "Global Leadership Certificate", category: "Leadership", description: "Develop advanced leadership skills for the modern world.", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800", slug: "global-leadership" },
  { _id: "2", title: "Startup Engineering", category: "Entrepreneurship", description: "From idea to execution: building scalable startups.", image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=800", slug: "startup-engineering" },
  { _id: "3", title: "Mastering Communication", category: "Communication", description: "Learn to articulate vision and lead teams effectively.", image: "https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80&w=800", slug: "mastering-communication" }
];

const FREE_PROGRAMS_ITEMS = [
  { _id: "fp-1", title: "Foundations of Generative AI & Prompting", category: "Free Programs", description: "Learn Large Language Models, prompt patterns, and AI engineering productivity.", image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800", slug: "free-generative-ai" },
  { _id: "fp-2", title: "Executive Leadership & Strategy Masterclass", category: "Free Programs", description: "Frameworks for strategic decision making, negotiation, and high-performance team culture.", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800", slug: "free-executive-leadership" },
  { _id: "fp-3", title: "Full-Stack Web Architecture Bootcamp", category: "Free Programs", description: "Build scalable modern web applications using React, Node.js, and Cloud APIs.", image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800", slug: "free-web-bootcamp" }
];

export const Programs = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: programsData, isLoading, error } = useQuery({
    queryKey: ['public-programs', 'all'],
    queryFn: () => programService.getPrograms({ status: 'published' }),
  });

  const basePrograms = programsData?.data?.data?.length > 0 ? programsData.data.data : DUMMY_PROGRAMS;
  const allProgramsList = [...basePrograms, ...FREE_PROGRAMS_ITEMS];

  const categories = ['All', 'Free Programs', 'Undergraduate', 'Postgraduate', 'Executive', 'Certification'];

  const filteredPrograms = allProgramsList.filter(prog => {
    const matchesCategory = activeCategory === 'All' ? prog.category !== 'Free Programs' : prog.category === activeCategory;
    const matchesSearch = prog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prog.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-outfit text-gray-900 mb-6">
            Academic <span className="text-primary-600">Programs</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Discover our comprehensive range of programs designed to transform ambitious individuals into visionary global leaders.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 space-y-4 md:space-y-0">
          
          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  activeCategory === category
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search programs..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-[450px] animate-pulse border border-gray-100 shadow-sm"></div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-12 h-12 mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Oops! Something went wrong.</h3>
            <p>Failed to load programs. Please try again later.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredPrograms.length === 0 && (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-200">
            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No programs found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn't find any programs matching your current filters. Try adjusting your search or category selection.
            </p>
            <Button 
              variant="outline" 
              className="mt-6"
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Programs Grid */}
        {!isLoading && !error && filteredPrograms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => (
              <ProgramCard key={program._id || program.slug} {...program} />
            ))}
          </div>
        )}

        {/* Talk to Our Career Counselor Section */}
        <div className="mt-20">
          <CareerCounselor />
        </div>
      </div>
    </div>
  );
};
