import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export const ProgramCard = React.memo(({ id, slug, title, description, category, duration, location, image }) => {
  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img src={image || 'https://via.placeholder.com/400x300'} alt={title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-4 left-4">
          <Badge variant="primary">{category}</Badge>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 mt-auto">
          <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {duration}</div>
          <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {location}</div>
        </div>
        <Link to={`/programs/${slug}`} className="inline-flex items-center font-semibold text-primary-600 hover:text-primary-700 transition-colors">
          View Details <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
});
ProgramCard.displayName = 'ProgramCard';
