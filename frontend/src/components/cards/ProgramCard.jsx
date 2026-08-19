import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, MapPin, Award } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export const ProgramCard = React.memo(({ 
  id, 
  slug, 
  title, 
  description, 
  shortDescription, 
  category, 
  duration, 
  fees, 
  location, 
  mode, 
  image, 
  posterImage, 
  poster, 
  featuredImage, 
  thumbnailUrl 
}) => {
  const displayImage = posterImage || poster || featuredImage || thumbnailUrl || image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80';
  const displayDescription = shortDescription || description;
  const programRoute = slug || id || '';

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full hover:-translate-y-1">
      {/* Poster Image Container */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <img 
          src={displayImage.includes('?') ? displayImage : `${displayImage}?auto=format&w=800&q=80`} 
          alt={`${title} - Tejas Academy Degree Program`} 
          width="400"
          height="208"
          loading="lazy" 
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute top-3 left-3">
          <Badge variant="primary" className="shadow-sm">{category || 'Degree'}</Badge>
        </div>
        {fees !== undefined && fees > 0 && (
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-black text-gray-900 shadow">
            ₹{fees.toLocaleString()}
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {displayDescription}
        </p>

        <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 mb-6 mt-auto pt-2 border-t border-gray-50">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary-600" /> {duration || '1 Year'}
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary-600" /> {mode || location || 'On-Campus'}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <Link 
            to={`/programs/${programRoute}`} 
            className="inline-flex items-center text-xs font-bold text-gray-700 hover:text-primary-600 transition-colors"
          >
            View Details <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link 
            to={`/admissions?program=${encodeURIComponent(title || '')}`} 
            className="inline-flex items-center text-xs font-bold px-3.5 py-2 rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white transition-all shadow-sm"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  );
});

ProgramCard.displayName = 'ProgramCard';
export default ProgramCard;
