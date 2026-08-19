import React from 'react';
import { EventCard } from '../components/cards/EventCard';
import { Calendar, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { eventService } from '@/services/eventService';
import { SEO } from '@/components/ui/SEO';

const FALLBACK_EVENTS = [
  { _id: 'e1', title: 'Global AI & Deep-Tech Summit 2026', description: 'Keynotes from international robotics researchers, panel discussions on autonomous systems, and student capstone exhibitions.', date: '2026-09-15', location: 'Main Amphitheatre, Campus', category: 'Conference', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800' },
  { _id: 'e2', title: 'Executive Capability & Venture Masterclass', description: 'Interactive workshop with corporate CEOs covering strategic leadership, venture scaling, and capital allocation.', date: '2026-10-05', location: 'Seminar Hall B, Campus', category: 'Workshop', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800' },
  { _id: 'e3', title: 'National Student Innovation Hackathon', description: '48-hour continuous coding and prototyping challenge addressing real-world enterprise problem statements.', date: '2026-11-20', location: 'Innovation Hub, Campus', category: 'Hackathon', image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800' }
];

export const Events = () => {
  const { data: eventsData, isLoading, error } = useQuery({
    queryKey: ['public-events', 'all'],
    queryFn: () => eventService.getEvents({ sort: 'date' }),
  });

  const rawEvents = eventsData?.data?.data || eventsData?.data || [];
  const events = Array.isArray(rawEvents) && rawEvents.length > 0 ? rawEvents : FALLBACK_EVENTS;

  return (
    <div className="py-16 md:py-24 bg-gray-50 min-h-screen">
      <SEO 
        title="Campus Events, Workshops & Masterclasses" 
        description="Stay updated with upcoming academic seminars, AI workshops, corporate guest lectures, and cultural events at Tejas Academy of Excellence."
        url="https://unlocktejas.com/events"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-outfit text-gray-900 mb-6">
            Campus <span className="text-primary-600">Events</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Stay updated with the latest workshops, seminars, cultural fests, and guest lectures happening at Tejas Academy.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-xl h-96 animate-pulse border border-gray-100 shadow-sm"></div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-12 h-12 mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Oops! Something went wrong.</h3>
            <p>Failed to load events.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && events.length === 0 && (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-200">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No upcoming events</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Check back later for new event announcements!
            </p>
          </div>
        )}

        {/* Events Grid */}
        {!isLoading && !error && events.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {events.map((event) => (
              <EventCard 
                key={event._id} 
                {...event} 
                type={event.category}
                date={new Date(event.date).toLocaleDateString()} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
