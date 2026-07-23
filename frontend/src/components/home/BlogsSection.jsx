import React from "react";
import { BlogCard } from "../cards/BlogCard";
import { Button } from "../ui/Button";
import { useQuery } from '@tanstack/react-query';
import { blogService } from '@/services/blogService';

const DUMMY_BLOGS = [
  { _id: "1", title: "The Future of AI in Education", excerpt: "How artificial intelligence is reshaping the learning landscape.", coverImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800", slug: "future-of-ai", author: "Dr. Smith", date: new Date().toISOString(), readTime: 5, category: "Technology" },
  { _id: "2", title: "Leadership in the 21st Century", excerpt: "Key traits every modern leader must cultivate.", coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800", slug: "modern-leadership", author: "Prof. Johnson", date: new Date().toISOString(), readTime: 7, category: "Leadership" },
  { _id: "3", title: "Building Resilient Teams", excerpt: "Strategies for fostering team resilience and adaptability.", coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800", slug: "resilient-teams", author: "Sarah Lee", date: new Date().toISOString(), readTime: 4, category: "Management" }
];

export function BlogsSection() {
  const { data: blogsData, isLoading } = useQuery({
    queryKey: ['public-blogs'],
    queryFn: () => blogService.getBlogs({ limit: 3, status: 'published' }),
  });
  const blogs = blogsData?.data?.data?.length > 0 ? blogsData.data.data : DUMMY_BLOGS;
  return (
    <section className="bg-neutral-50 py-16 md:py-24 border-b border-neutral-100">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20 flex flex-col items-center">
        <div className="h-0.5 w-12 bg-accent-500 mb-4" />
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-700 mb-2 select-none">
          Tejas Insights
        </span>
        <h2 className="text-3xl md:text-4xl font-semibold font-serif leading-tight text-neutral-900 mb-16 text-center">
          Latest Institutional Publications
        </h2>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {isLoading ? (
            <div className="col-span-3 flex justify-center items-center py-20 w-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : blogs.length > 0 ? (
            blogs.slice(0, 3).map((blog) => (
              <BlogCard key={blog.slug || blog._id} {...blog} />
            ))
          ) : (
            <div className="col-span-3 text-center py-10 text-gray-500 w-full">
              No recent publications found.
            </div>
          )}
        </div>

        <Button
          variant="secondary"
          size="md"
          onClick={() => window.location.href = "/blog"}
          className="mt-12 font-semibold"
        >
          Read Our Blog
        </Button>
      </div>
    </section>
  );
}
