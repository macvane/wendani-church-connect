
import React, { useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';

const events = [
  {
    id: 1,
    title: "Quarterly Business Meeting",
    date: "May 5, 2025",
    time: "3:00 PM - 5:00 PM",
    location: "Church Fellowship Hall",
    department: "Church Board",
    thumbnail: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=400",
  },
  {
    id: 2,
    title: "Youth Camp",
    date: "June 12-15, 2025",
    time: "All Day",
    location: "Naivasha Campgrounds",
    department: "Youth Ministry",
    thumbnail: "https://images.unsplash.com/photo-1521245585218-15db1fcc89e1?q=80&w=400",
  },
  {
    id: 3,
    title: "Family Life Seminar",
    date: "July 2, 2025",
    time: "9:00 AM - 1:00 PM",
    location: "Church Main Sanctuary",
    department: "Family Life",
    thumbnail: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=400",
  },
  {
    id: 4,
    title: "Health Expo",
    date: "July 17, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "Church Grounds",
    department: "Health Ministries",
    thumbnail: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=400",
  }
];

const EventsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
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
          {events.map((event, index) => (
            <div 
              key={event.id}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row animate-on-scroll"
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
                  <a 
                    href={`/events/${event.id}`} 
                    className="text-church-600 font-medium hover:text-church-700"
                  >
                    View Details →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center animate-on-scroll">
          <a href="/events" className="btn btn-primary btn-lg">
            View All Events
          </a>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
