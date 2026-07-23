import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag, Share2 } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { useQuery } from '@tanstack/react-query';
import { blogService } from '@/services/blogService';

const DUMMY_BLOGS = [
  { _id: "1", title: "The Future of AI in Education", content: "Artificial intelligence is reshaping the learning landscape by providing personalized learning experiences. In this article, we explore how machine learning models can predict student performance and adapt curriculums in real time.\n\nFurthermore, AI-driven tools are empowering educators to automate administrative tasks, allowing them to focus more on mentoring and guiding students. The future of education is not just about technology; it's about leveraging technology to make education more human-centric.", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200", slug: "future-of-ai", author: { firstName: "Dr.", lastName: "Smith" }, publishedAt: new Date().toISOString(), readTime: 5, category: "Technology", tags: ["AI", "EdTech", "Future"] },
  { _id: "2", title: "Leadership in the 21st Century", content: "Key traits every modern leader must cultivate in an era of rapid change. Empathy, adaptability, and a continuous learning mindset are no longer optional—they are essential.\n\nWe discuss case studies of successful leaders who navigated their organizations through global crises and digital transformations.", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200", slug: "modern-leadership", author: { firstName: "Prof.", lastName: "Johnson" }, publishedAt: new Date().toISOString(), readTime: 7, category: "Leadership", tags: ["Leadership", "Management", "Growth"] },
  { _id: "3", title: "Building Resilient Teams", content: "Strategies for fostering team resilience and adaptability. A resilient team can bounce back from setbacks and thrive under pressure.\n\nDiscover the core principles of psychological safety and how to build a culture where failure is seen as a stepping stone to innovation.", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200", slug: "resilient-teams", author: { firstName: "Sarah", lastName: "Lee" }, publishedAt: new Date().toISOString(), readTime: 4, category: "Management", tags: ["Teamwork", "Resilience", "Culture"] },
  { _id: "4", title: "Embracing Digital Transformation", content: "Why businesses must adapt or risk falling behind in the digital age. Digital transformation isn't just about implementing new software; it's a fundamental shift in how organizations deliver value to customers.\n\nWe explore a step-by-step framework for initiating digital changes that prioritize user experience and streamline operations.", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200", slug: "digital-transformation", author: { firstName: "Michael", lastName: "Chen" }, publishedAt: new Date().toISOString(), readTime: 6, category: "Business", tags: ["Digital", "Strategy", "Innovation"] },
  { _id: "5", title: "The Psychology of Decision Making", content: "Understanding cognitive biases to make better strategic choices. Every day, leaders face complex decisions heavily influenced by unseen psychological biases.\n\nBy learning to recognize anchors, confirmation biases, and loss aversion, professionals can systematically improve their decision-making frameworks.", image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=1200", slug: "decision-making", author: { firstName: "Dr.", lastName: "Williams" }, publishedAt: new Date().toISOString(), readTime: 8, category: "Psychology", tags: ["Psychology", "Leadership", "Decisions"] },
  { _id: "6", title: "Sustainable Entrepreneurship", content: "Building ventures that prioritize planet, people, and profit. The modern startup ecosystem is shifting focus towards triple-bottom-line accounting.\n\nDiscover how integrating sustainability into your core business model from day one not only attracts conscious consumers but also drives long-term profitability.", image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=1200", slug: "sustainable-entrepreneurship", author: { firstName: "Emma", lastName: "Davis" }, publishedAt: new Date().toISOString(), readTime: 5, category: "Entrepreneurship", tags: ["Sustainability", "Startups", "Impact"] }
];

export const BlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => blogService.getBlogBySlug(slug),
  });

  let blog = data?.data;
  
  if (error || !blog) {
    blog = DUMMY_BLOGS.find(b => b.slug === slug);
  }

  if (isLoading) {
    return <div className="py-24 text-center">Loading article...</div>;
  }

  if (!blog) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
        <Link to="/blog" className="text-primary-600 hover:underline">Back to Insights</Link>
      </div>
    );
  }

  return (
    <div className="py-16 md:py-24 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <button onClick={() => navigate('/blog')} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors mb-8">
          <ArrowLeft size={16} className="mr-2" /> Back to all insights
        </button>

        <div className="mb-8">
          <Badge variant="primary" className="mb-4">{blog.category}</Badge>
          <h1 className="text-3xl md:text-5xl font-bold font-outfit text-gray-900 leading-tight mb-6">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-500 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <User size={18} />
              <span>{blog.author?.firstName ? `${blog.author.firstName} ${blog.author.lastName}` : 'Tejas Admin'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {blog.image && (
          <div className="w-full h-64 md:h-[400px] rounded-2xl overflow-hidden mb-12">
            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed font-inter">
          {/* If HTML was stored, use dangerouslySetInnerHTML, otherwise render simple text */}
          <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }} />
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-wrap gap-2">
            {blog.tags?.map((tag, idx) => (
              <span key={idx} className="flex items-center text-sm bg-gray-50 text-gray-600 px-3 py-1 rounded-full border border-gray-200">
                <Tag size={12} className="mr-1" /> {tag}
              </span>
            ))}
          </div>
          
          <button className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors font-medium">
            <Share2 size={18} /> Share Article
          </button>
        </div>
      </div>
    </div>
  );
};
