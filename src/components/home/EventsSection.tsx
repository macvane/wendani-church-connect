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
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        
        // Filter upcoming events and get first 2
        const upcoming = data
          .filter((event: Event) => new Date(event.date) >= now)
          .sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 2);
        
        setUpcomingEvents(upcoming);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
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
    <section id="events" className="section bg-gray-50" ref={sectionRef}>
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="section-title animate-on-scroll">Upcoming Events</h2>
          <p className="section-subtitle animate-on-scroll animate-delay-1">
            Join us for these upcoming events and activities at our church.
          </p>
        </div>
        
        <div className="md:w-[85%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading ? (
            <div className="col-span-2 text-center py-12">
              <p className="text-lg text-gray-600">Loading events...</p>
            </div>
          ) : upcomingEvents.length > 0 ? (
            upcomingEvents.map((event, index) => (
              <div 
                key={event.id}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
                style={{animationDelay: `${index * 0.1 + 0.2}s`}}
              >
                <div className="w-full h-[12rem] md:h-[17rem] relative">
                  <img 
                    src={`https://macvane.pythonanywhere.com${event.image}`}
                    alt={event.title} 
                    loading="lazy"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&auto=format&fit=crop&q=60';
                    }}
                  />
                </div>
                <div className="p-6 w-full flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-xl">{event.title}</h3>
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Calendar size={16} className="mr-2" />
                    <span>{format(new Date(event.date), 'MMM d, yyyy')} • {event.time}</span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Location: {event.venue}
                  </p>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="mt-auto">
                    <Link 
                      to={`/events/${event.slug}`}
                      className="text-church-600 font-medium hover:text-church-700"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <p className="text-lg text-gray-600">No upcoming events at this time. Check back soon!</p>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center animate-on-scroll">
          <Link to="/events" className="btn btn-primary btn-lg">
            View All Events
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
