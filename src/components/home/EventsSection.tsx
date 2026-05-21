import React, { useRef, useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { eventAPI } from '@/utils/api';
import { format } from 'date-fns';

interface Event {
  id: number;
  slug: string;
  title: string;
  description: string;
  venue: string;
  date: string;
  to_date: string;
  from_date: string;
  time: string;
  image: string;
  created_at: string;
}

const EventsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
  try {
    const response = await eventAPI.list();
    if (response.ok) {
      const data = await response.json();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const parseDate = (dateStr: string) => {
        const [y, m, d] = dateStr.split("-").map(Number);
        return new Date(y, m - 1, d); // local midnight
      };

      const upcoming = data
        .filter((event: Event) => {
          // Case 1: Event has from_date & to_date (range event)
          if (event.from_date && event.to_date) {
            const toDate = parseDate(event.to_date);
            return toDate >= today;
          }

          // Case 2: Single-day event
          if (event.date) {
            const eventDate = parseDate(event.date);
            return eventDate >= today;
          }

          return false;
        })
        .sort((a: Event, b: Event) => {
          const getSortDate = (event: Event) =>
            event.from_date
              ? parseDate(event.from_date).getTime()
              : parseDate(event.date).getTime();

          return getSortDate(a) - getSortDate(b);
        })
        .slice(0, 2);

      setUpcomingEvents(upcoming);
    }
  } catch (error) {
    console.error("Error fetching events:", error);
  } finally {
    setLoading(false);
  }
};


  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));
    
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);
  
  return (
    <section id="events" className="section bg-white relative overflow-hidden" ref={sectionRef}>
      <div className="absolute top-1/2 -left-32 w-72 h-72 rounded-full bg-church-50 blur-3xl pointer-events-none" />
      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-church-50 text-church-700 text-xs font-semibold uppercase tracking-widest">
            <Calendar size={14} /> What's coming up
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A192F] font-serif animate-on-scroll">
            Upcoming Events
          </h2>
          <p className="mt-3 text-slate-600 text-lg animate-on-scroll animate-delay-1 max-w-xl mx-auto">
            Join us for these upcoming events and activities at our church.
          </p>
        </div>

        <div className="md:w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 text-center py-12 text-slate-500">Loading events...</div>
          ) : upcomingEvents.length > 0 ? (
            upcomingEvents.map((event, index) => (
              <div
                key={event.id}
                className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
              >
                <div className="w-full aspect-video relative overflow-hidden">
                  <img
                    src={`https://churchmedia.kahawawendanisda.org${event.image}`}
                    alt={event.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=60';
                    }}
                  />
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-xs font-semibold text-church-700">
                    {format(new Date(event.date), 'MMM d, yyyy')}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-[#0A192F] mb-2 group-hover:text-church-700 transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex items-center text-slate-500 text-sm mb-3">
                    <Calendar size={14} className="mr-2" />
                    <span>{event.time} • {event.venue}</span>
                  </div>
                  <p className="text-slate-600 text-sm mb-5 line-clamp-2 leading-relaxed">{event.description}</p>
                  <Link
                    to={`/events/${event.slug}`}
                    className="mt-auto inline-flex items-center gap-1 text-church-700 font-semibold text-sm hover:text-church-800"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12 text-slate-500">
              No upcoming events at this time. Check back soon!
            </div>
          )}
        </div>

        <div className="mt-10 text-center animate-on-scroll">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-church-600 hover:bg-church-700 text-white font-semibold transition-colors shadow-lg shadow-church-900/10"
          >
            View All Events
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;

