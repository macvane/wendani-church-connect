
import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CountdownTimer from '@/components/home/CountdownTimer';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isDatePassed } from '@/utils/dateUtils';
import { Helmet } from 'react-helmet-async';

// Create a shared events data structure for the whole application
export const allEventsData = [
  {
    id: 1,
    title: "Camp Meeting 2025",
    date: "Aug 16, 2025",
    time: "8:00 AM - 5:00 PM",
    location: "Church Main Sactuary",
    department: "Camp Meeting",
    description: "Mark your calendars! Our 2025 Camp Meeting will take place from 10th to 16th August 2025. ",
    thumbnail: "/posters/camp.jpg",
  },
  {
    id: 2,
    title: "Youth Sabbath | Choir Day & Music Concert",
    date: "Sep 06, 2025",
    time: "8:00 AM - 5:00 PM",
    location: "Church Main Sactuary",
    department: "AYM",
    description: "Join us for a spirit-filled Sabbath of music and worship with our Youth Choir. Be uplifted by inspiring hymns and heartfelt praise. ",
    thumbnail: "/posters/aymsabbath.jpg",
  },
  {
    id: 3,
    title: "District Family Life Week Of Prayer",
    date: "Sep 07 - 13, 2025",
    time: "5:30 PM - 7:00 PM",
    location: "Church Main Sactuary",
    department: "Family Life",
    description: "Join us for District Family Life Week of Prayer. Experience uplifting worship, inspiring messages, and meaningful programs designed to nurture and strengthen families in Christ.",
    thumbnail: "/posters/togetherness.jpg",
  },
  {
    id: 4,
    title: "District Family Life Sabbath",
    date: "Sep 13, 2025",
    time: "8:00 AM - 5:00 PM",
    location: "K.Sukari SDA Church",
    department: "Family Life",
    description: "Celebrate Family Life Sabbath with us. A full day of fellowship, worship, and programs designed to strengthen families in Christ. ",
    thumbnail: "/posters/togetherness.jpg",
  },
  {
    id: 5,
    title: "Holy Communion Sabbath",
    date: "Sep 27, 2025",
    time: "8:00 AM - 5:00 PM",
    location: "Church Main Sactuary",
    department: "Deaconary",
    description: "Join us for Holy Communion Sabbath a sacred day of worship, reflection, and renewal as we share in the Lord’s Supper.",
    thumbnail: "https://i.pinimg.com/736x/34/ba/24/34ba24065590465282be3d9cabd3ed50.jpg",
  },
];

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  department: string;
  description: string;
  thumbnail: string;
}

const Events = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);

  // Categorize events based on their dates
  useEffect(() => {
    const upcoming: Event[] = [];
    const past: Event[] = [];
    
    allEventsData.forEach(event => {
      if (isDatePassed(event.date)) {
        past.push(event);
      } else {
        upcoming.push(event);
      }
    });
    
    // Sort upcoming events by date (nearest first)
    upcoming.sort((a, b) => {
      const dateA = new Date(a.date.split('-')[0]);
      const dateB = new Date(b.date.split('-')[0]);
      return dateA.getTime() - dateB.getTime();
    });
    
    // Sort past events by date (most recent first)
    past.sort((a, b) => {
      const dateA = new Date(a.date.split('-')[0]);
      const dateB = new Date(b.date.split('-')[0]);
      return dateB.getTime() - dateA.getTime();
    });
    
    setUpcomingEvents(upcoming);
    setPastEvents(past);
  }, []);

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
      <Helmet>
        <title>Events - Kahawa Wendani SDA Church</title>
        <meta name="description" content="Find out what's happening at Kahawa Wendani SDA Church! Explore our calendar for upcoming events, including worship services, community outreach, youth programs, and special meetings in Nairobi. We invite you to join us." />
        <link rel="canonical" href="https://kahawawendanisda.org/events" />
      </Helmet>

      <Header />
      
      <main className="">
        {/* Hero Section */}
        <section className="relative h-[400px] flex items-center justify-center">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
            <img 
              src="/assets/image (47).jpg" 
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
              className=""
            >
              <div className="flex justify-center mb-12">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                  <TabsTrigger value="past">Past Events</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="upcoming">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {upcomingEvents.map((event, index) => (
                    <div 
                      key={event.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden "
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <div className='h-[14rem] relative '>
                        <img 
                          src={event.thumbnail} 
                          alt={event.title} 
                          loading="lazy"
                          className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute top-2 right-2 bg-church-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          {event.department}
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-xl">{event.title}</h3>
                          
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
                        
                        {/* <div className="flex justify-end">
                          <button className="text-church-600 font-medium hover:text-church-800 transition-colors">
                            View Details →
                          </button>
                        </div> */}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="past">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {pastEvents.map((event, index) => (
                    <div 
                      key={event.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden "
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <div className="relative">
                        <img 
                          src={event.thumbnail} 
                          alt={event.title} 
                          className="w-full h-[15rem] object-cover filter grayscale"
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
      </main>
      <Footer />
    </>
  );
};

export default Events;
