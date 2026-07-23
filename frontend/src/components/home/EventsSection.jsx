import React from "react";
import { EventCard } from "../cards/EventCard";
import { Button } from "../ui/Button";
import { useQuery } from '@tanstack/react-query';
import { eventService } from '@/services/eventService';

export function EventsSection() {
  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['public-events'],
    queryFn: () => eventService.getEvents({ limit: 3, sort: 'date' }),
  });

  const events = eventsData?.data?.data || [];
  return (
    <section className="bg-warm-50 py-16 md:py-24 border-b border-neutral-100">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Heading and info */}
        <div className="lg:col-span-5 flex flex-col items-start justify-center gap-5">
          <div className="h-0.5 w-12 bg-accent-500" />
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-700 select-none">
            Upcoming
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold font-serif leading-tight text-neutral-900">
            Workshops & <br /> Events
          </h2>
          <p className="text-base text-neutral-600 font-sans leading-relaxed max-w-md">
            Join our immersive masterclasses, interactive weekend roundtables, and networking gatherings led by industry innovators.
          </p>
          <Button
            variant="outline"
            size="md"
            onClick={() => window.location.href = "/events"}
            className="font-semibold mt-2"
          >
            View All Events
          </Button>
        </div>

        {/* Right Column: Stacked Event Cards */}
        <div className="lg:col-span-7 flex flex-col gap-6 w-full">
          {isLoading ? (
            <div className="flex justify-center items-center py-20 w-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : events.length > 0 ? (
            events.slice(0, 3).map((event) => (
              <EventCard key={event.slug || event._id} {...event} />
            ))
          ) : (
            <div className="text-center py-10 text-gray-500 w-full">
              No upcoming events found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
