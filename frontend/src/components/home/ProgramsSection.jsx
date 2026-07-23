import React, { useState, useMemo, useCallback } from "react";
import { ProgramCard } from "../cards/ProgramCard";
import { Button } from "../ui/Button";
import { useQuery } from '@tanstack/react-query';
import { programService } from '@/services/programService';

const CATEGORIES = ["All", "Leadership", "Entrepreneurship", "Communication", "Human Excellence"];

const DUMMY_PROGRAMS = [
  { _id: "1", title: "Global Leadership Certificate", category: "Leadership", description: "Develop advanced leadership skills for the modern world.", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800", slug: "global-leadership" },
  { _id: "2", title: "Startup Engineering", category: "Entrepreneurship", description: "From idea to execution: building scalable startups.", image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=800", slug: "startup-engineering" },
  { _id: "3", title: "Mastering Communication", category: "Communication", description: "Learn to articulate vision and lead teams effectively.", image: "https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80&w=800", slug: "mastering-communication" }
];

export function ProgramsSection() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleCategorySelect = useCallback((cat) => {
    setSelectedCategory(cat);
  }, []);

  const { data: programsData, isLoading } = useQuery({
    queryKey: ['public-programs'],
    queryFn: () => programService.getPrograms({ limit: 6, status: 'published' }),
  });

  const programs = programsData?.data?.data?.length > 0 ? programsData.data.data : DUMMY_PROGRAMS;

  const filteredPrograms = useMemo(() => {
    if (selectedCategory === "All") return programs;
    return programs.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());
  }, [selectedCategory, programs]);

  return (
    <section className="bg-neutral-0 py-16 md:py-24 border-b border-neutral-100">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20 flex flex-col items-center">
        <div className="h-0.5 w-12 bg-accent-500 mb-4" />
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-700 mb-2 select-none">
          Our Programs
        </span>
        <h2 className="text-3xl md:text-4xl font-semibold font-serif leading-tight text-neutral-900 mb-10 text-center">
          Designed for Real-World Impact
        </h2>

        {/* Filter categories */}
        <div className="flex items-center gap-2 max-w-full overflow-x-auto whitespace-nowrap scrollbar-none pb-6 w-full justify-start md:justify-center border-b border-neutral-100 mb-10 select-none">
          {CATEGORIES.map((cat) => {
            const isActive = cat === selectedCategory;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`
                  px-4 py-2 text-sm font-medium rounded-full border transition-all duration-200 cursor-pointer
                  ${
                    isActive
                      ? "bg-primary-700 text-neutral-0 border-primary-700 shadow-xs"
                      : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900"
                  }
                `}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Program Cards Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20 w-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredPrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {filteredPrograms.map((program) => (
              <ProgramCard key={program.slug || program._id} {...program} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 w-full">
            No programs found for this category.
          </div>
        )}

        {/* Explore More Button */}
        <Button
          variant="secondary"
          size="lg"
          onClick={() => window.location.href = "/programs"}
          className="mt-12 font-semibold"
        >
          View All Programs
        </Button>
      </div>
    </section>
  );
}
