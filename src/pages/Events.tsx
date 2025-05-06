
import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const eventsData = {
  upcoming: [
    {
      id: 1,
      title: "Quarterly Business Meeting",
      date: "May 5, 2025",
      time: "3:00 PM - 5:00 PM",
      location: "Church Fellowship Hall",
      department: "Church Board",
      description: "Review of the church's quarterly activities, financial reports, and planning for the next quarter.",
      thumbnail: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=600",
    },
    {
      id: 2,
      title: "Youth Camp",
      date: "June 12-15, 2025",
      time: "All Day",
      location: "Naivasha Campgrounds",
      department: "Youth Ministry",
      description: "Annual youth camp focused on spiritual growth, leadership development, and fellowship for young people aged 16-30.",
      thumbnail: "https://images.unsplash.com/photo-1521245585218-15db1fcc89e1?q=80&w=600",
    },
    {
      id: 3,
      title: "Family Life Seminar",
      date: "July 2, 2025",
      time: "9:00 AM - 1:00 PM",
      location: "Church Main Sanctuary",
      department: "Family Life",
      description: "A special seminar on building strong families, effective communication, and resolving conflicts in relationships.",
      thumbnail: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=600",
    },
    {
      id: 4,
      title: "Health Expo",
      date: "July 17, 2025",
      time: "10:00 AM - 4:00 PM",
      location: "Church Grounds",
      department: "Health Ministries",
      description: "Community health expo offering free health screenings, nutrition information, exercise demonstrations, and health lectures.",
      thumbnail: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600",
    },
    {
      id: 5,
      title: "Women's Ministry Retreat",
      date: "August 8-10, 2025",
      time: "Friday 6 PM - Sunday 2 PM",
      location: "Sawela Lodge, Naivasha",
      department: "Women's Ministry",
      description: "Annual women's retreat with guest speakers, workshops, prayer sessions, and fellowship activities.",
      thumbnail: "https://images.unsplash.com/photo-1594799295708-affee8077e29?q=80&w=600",
    },
    {
      id: 6,
      title: "Bible Study Marathon",
      date: "September 5, 2025",
      time: "8:00 AM - 8:00 PM",
      location: "Church Main Sanctuary",
      department: "Personal Ministries",
      description: "12-hour continuous Bible study event covering the book of Revelation with different speakers and interactive sessions.",
      thumbnail: "https://images.unsplash.com/photo-1529071753888-4942fe4b19cc?q=80&w=600",
    }
  ],
  past: [
    {
      id: 7,
      title: "Easter Celebration Service",
      date: "April 1, 2025",
      time: "11:00 AM - 1:00 PM",
      location: "Church Main Sanctuary",
      department: "Worship Committee",
      description: "Special resurrection service celebrating Christ's victory over death with choir performances and special readings.",
      thumbnail: "https://images.unsplash.com/photo-1496677302437-af0950563b7d?q=80&w=600",
    },
    {
      id: 8,
      title: "Church Cleanup Day",
      date: "March 15, 2025",
      time: "8:00 AM - 2:00 PM",
      location: "Church Grounds",
      department: "Deacons",
      description: "Community effort to clean, repair, and beautify our church facility and surrounding grounds.",
      thumbnail: "https://images.unsplash.com/photo-1542652735873-fb2825bba4c6?q=80&w=600",
    },
    {
      id: 9,
      title: "Youth Day Program",
      date: "March 8, 2025",
      time: "9:00 AM - 6:00 PM",
      location: "Church Main Sanctuary",
      department: "Youth Ministry",
      description: "Full day of youth-led worship, seminars, and activities focused on empowering young people in their faith journey.",
      thumbnail: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=600",
    }
  ]
};

const Events = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    // Intersection Observer for scroll animations
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
    <>
      <Header />
      
      <main className="">
        {/* Hero Section */}
        <section className="relative h-[400px] flex items-center justify-center">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000" 
              alt="Church Events" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container relative z-20 text-white text-center">
            <h1 className="mb-4">Church Events</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Discover our upcoming events and activities and join us in worship, fellowship, and service.
            </p>
          </div>
        </section>
        
        {/* Events Tabs */}
        <section className="section bg-white">
          <div className="container">
            <Tabs 
              defaultValue="upcoming" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="animate-on-scroll"
            >
              <div className="flex justify-center mb-12">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                  <TabsTrigger value="past">Past Events</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="upcoming">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {eventsData.upcoming.map((event, index) => (
                    <div 
                      key={event.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden animate-on-scroll"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <img 
                        src={event.thumbnail} 
                        alt={event.title} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-xl">{event.title}</h3>
                          <span className="bg-church-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {event.department}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-gray-600 mb-2">
                          <Calendar size={16} className="mr-2 shrink-0" />
                          <span>{event.date}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600 mb-2">
                          <Clock size={16} className="mr-2 shrink-0" />
                          <span>{event.time}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600 mb-4">
                          <MapPin size={16} className="mr-2 shrink-0" />
                          <span>{event.location}</span>
                        </div>
                        
                        <p className="text-gray-700 mb-4 line-clamp-3">
                          {event.description}
                        </p>
                        
                        <div className="flex justify-end">
                          <button className="text-church-600 font-medium hover:text-church-800 transition-colors">
                            View Details →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="past">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {eventsData.past.map((event, index) => (
                    <div 
                      key={event.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden animate-on-scroll"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <div className="relative">
                        <img 
                          src={event.thumbnail} 
                          alt={event.title} 
                          className="w-full h-48 object-cover filter grayscale"
                        />
                        <div className="absolute top-3 right-3 bg-gray-800 text-white text-xs px-3 py-1 rounded">
                          Past Event
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-xl">{event.title}</h3>
                          <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {event.department}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-gray-600 mb-2">
                          <Calendar size={16} className="mr-2 shrink-0" />
                          <span>{event.date}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600 mb-2">
                          <Clock size={16} className="mr-2 shrink-0" />
                          <span>{event.time}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600 mb-4">
                          <MapPin size={16} className="mr-2 shrink-0" />
                          <span>{event.location}</span>
                        </div>
                        
                        <p className="text-gray-700 mb-4 line-clamp-3">
                          {event.description}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 text-sm">Completed</span>
                          <button className="text-church-600 font-medium hover:text-church-800 transition-colors">
                            View Gallery →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Calendar Section */}
        <section className="section bg-gray-50">
          <div className="container">
            <h2 className="section-title animate-on-scroll">Church Calendar</h2>
            <p className="section-subtitle animate-on-scroll animate-delay-1">
              View our complete church calendar to plan your participation.
            </p>
            <div className="mt-8 flex justify-center animate-on-scroll animate-delay-2">
              <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
                <div className="aspect-w-16 aspect-h-9">
                  <iframe 
                    src="https://calendar.google.com/calendar/embed?src=kahawawendanisdachurch%40gmail.com&ctz=Africa%2FNairobi" 
                    className="w-full h-[600px] border-0"
                    frameBorder="0" 
                    scrolling="no"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Event Registration */}
        <section className="section bg-church-600 text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-on-scroll">
                Want to Receive Event Updates?
              </h2>
              <p className="text-xl mb-8 animate-on-scroll animate-delay-1">
                Sign up for our newsletter to receive updates about upcoming events and activities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-on-scroll animate-delay-2">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-1 px-4 py-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-church-300"
                />
                <button className="bg-white text-church-700 hover:bg-gray-100 px-6 py-3 rounded-md font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default Events;
