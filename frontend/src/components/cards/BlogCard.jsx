import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export const BlogCard = React.memo(({ slug, title, excerpt, coverImage, author, date, category }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition-shadow h-full">
      <Link to={`/insights/${slug}`} className="relative h-48 overflow-hidden block">
        <img src={coverImage || 'https://via.placeholder.com/400x300'} alt={title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-4 left-4"><Badge variant="default" className="bg-white/90 backdrop-blur">{category}</Badge></div>
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(date).toLocaleDateString()}</span>
          <span className="flex items-center gap-1"><User className="w-3 h-3" /> {author}</span>
        </div>
        <Link to={`/insights/${slug}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">{title}</h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-3 mt-auto">{excerpt}</p>
        <Link to={`/insights/${slug}`} className="font-medium text-primary-600 hover:text-primary-700 text-sm mt-auto inline-block">Read More &rarr;</Link>
      </div>
    </div>
  );
});
BlogCard.displayName = 'BlogCard';
