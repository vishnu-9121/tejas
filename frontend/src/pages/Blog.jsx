import React, { useState } from 'react';
import { BlogCard } from '../components/cards/BlogCard';
import { Input } from '../components/ui/Input';
import { Search } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useQuery } from '@tanstack/react-query';
import { blogService } from '@/services/blogService';
import { FinalCTA } from '@/components/home/FinalCTA';
import { SEO } from '@/components/ui/SEO';

const DUMMY_BLOGS = [
  { _id: "1", title: "The Future of AI in Education", excerpt: "How artificial intelligence is reshaping the learning landscape.", coverImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800", slug: "future-of-ai", author: { firstName: "Dr.", lastName: "Smith" }, publishedAt: new Date().toISOString(), readTime: 5, category: "Technology" },
  { _id: "2", title: "Leadership in the 21st Century", excerpt: "Key traits every modern leader must cultivate.", coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800", slug: "modern-leadership", author: { firstName: "Prof.", lastName: "Johnson" }, publishedAt: new Date().toISOString(), readTime: 7, category: "Leadership" },
  { _id: "3", title: "Building Resilient Teams", excerpt: "Strategies for fostering team resilience and adaptability.", coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800", slug: "resilient-teams", author: { firstName: "Sarah", lastName: "Lee" }, publishedAt: new Date().toISOString(), readTime: 4, category: "Management" },
  { _id: "4", title: "Embracing Digital Transformation", excerpt: "Why businesses must adapt or risk falling behind in the digital age.", coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800", slug: "digital-transformation", author: { firstName: "Michael", lastName: "Chen" }, publishedAt: new Date().toISOString(), readTime: 6, category: "Business" },
  { _id: "5", title: "The Psychology of Decision Making", excerpt: "Understanding cognitive biases to make better strategic choices.", coverImage: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800", slug: "decision-making", author: { firstName: "Dr.", lastName: "Williams" }, publishedAt: new Date().toISOString(), readTime: 8, category: "Psychology" },
  { _id: "6", title: "Sustainable Entrepreneurship", excerpt: "Building ventures that prioritize planet, people, and profit.", coverImage: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=800", slug: "sustainable-entrepreneurship", author: { firstName: "Emma", lastName: "Davis" }, publishedAt: new Date().toISOString(), readTime: 5, category: "Entrepreneurship" }
];

export const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: blogsData, isLoading } = useQuery({
    queryKey: ['public-blogs', { search: searchQuery }],
    queryFn: () => blogService.getBlogs({ search: searchQuery, status: 'published' }),
  });

  const blogs = blogsData?.data?.data?.length > 0 ? blogsData.data.data : DUMMY_BLOGS;

  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <SEO 
        title="Tejas Insights & Articles" 
        description="Perspectives on artificial intelligence, executive leadership, technological transformation, and higher education excellence."
        url="https://unlocktejas.com/insights"
      />
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <SectionHeader title="Tejas Insights" description="Latest news, insights, and stories from our community." />
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <Input 
            className="pl-10"
            placeholder="Search articles..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-xl h-96 animate-pulse border border-gray-100 shadow-sm"></div>
          ))}
        </div>
      )}

      {/* Blog Grid */}
      {!isLoading && blogs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {blogs.map((blog) => (
            <BlogCard 
              key={blog._id} 
              {...blog} 
              author={blog.author?.firstName ? `${blog.author.firstName} ${blog.author.lastName}` : 'Admin'} 
              date={new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()} 
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && blogs.length === 0 && (
        <div className="text-center py-24 text-gray-500">
          No articles found matching your criteria.
        </div>
      )}

      {/* Newsletter Subscription Block at the End of Tejas Insights */}
      <div className="mt-20 -mx-4 sm:-mx-6 lg:-mx-8">
        <FinalCTA />
      </div>
    </div>
  );
};

export default Blog;
