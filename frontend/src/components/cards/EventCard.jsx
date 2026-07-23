import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

export const EventCard = React.memo(({ title, description, date, time, location, image, type }) => {
  return (
    <div className="flex flex-col sm:flex-row bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="sm:w-1/3 relative h-48 sm:h-auto">
        <img src={image || 'https://via.placeholder.com/400x300'} alt={title} loading="lazy" className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs font-bold text-primary-600 uppercase tracking-wide">{type}</div>
      </div>
      <div className="p-6 sm:w-2/3 flex flex-col justify-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-500">
          <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary-500" /> {date}</div>
          <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary-500" /> {time}</div>
          <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary-500" /> {location}</div>
        </div>
      </div>
    </div>
  );
});
EventCard.displayName = 'EventCard';
