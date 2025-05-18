
import React, { useRef, useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { allEventsData } from '@/pages/Events';
import { isDatePassed } from '@/utils/dateUtils';

const EventsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<typeof allEventsData>([]);
  
  useEffect(() => {
    // Filter and sort upcoming events
    const upcoming = [...allEventsData]
      .filter(event => !isDatePassed(event.date))
      .sort((a, b) => {
        const dateA = new Date(a.date.split('-')[0]);
        const dateB = new Date(b.date.split('-')[0]);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 4); // Get only the first 4 upcoming events
      
    console.log('Upcoming events for homepage:', upcoming);
    setUpcomingEvents(upcoming);
  }, []);
  
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event, index) => (
              <div 
                key={event.id}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row "
                style={{animationDelay: `${index * 0.1 + 0.2}s`}}
              >
                <div className="sm:w-1/3">
                  <img 
                    src={event.thumbnail} 
                    alt={event.title} 
                    className="w-full h-48 sm:h-full object-cover"
                  />
                </div>
                <div className="p-6 sm:w-2/3 flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-xl">{event.title}</h3>
                    <span className="bg-church-600 text-white text-xs px-2 py-1 rounded">
                      {event.department}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Calendar size={16} className="mr-2" />
                    <span>{event.date} • {event.time}</span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Location: {event.location}
                  </p>
                  <div className="mt-auto">
                    <Link 
                      to={`/events`} 
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
