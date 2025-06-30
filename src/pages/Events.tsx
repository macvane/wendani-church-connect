
import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isDatePassed } from '@/utils/dateUtils';

// Create a shared events data structure for the whole application
export const allEventsData = [
  {
    id: 1,
    title: "Communication Sabbath",
    date: "May 17, 2025",
    time: "8:00 AM - 5:00 PM",
    location: "Church Main Sanctuary",
    department: "Communication Dpt.",
    description: "Review of the church's quarterly activities, financial reports, and planning for the next quarter.",
    thumbnail: "/thumbnails/com.jpg",
  },
  {
    id: 2,
    title: "AMM Audio Recording",
    date: "July 06, 2025",
    time: "8:00 AM - 5:00 PM",
    location: "TBC",
    department: "AMM",
    description: "The moment is here! AMM Ministries invites you to be part of the live audience for their highly anticipated 'Volume 2' audio recording.",
    thumbnail: "https://i.pinimg.com/736x/7f/cf/c3/7fcfc334245f2c84c5b187441def5803.jpg",
  },
  {
    id: 3,
    title: "Publishing Sabbath",
    date: "July 05, 2025",
    time: "8:00 AM - 5:00 PM",
    location: "Church Main Sanctuary",
    department: "Publishing Dpt",
    description: "Join us for Publishing Sabbath as we celebrate the vital ministry of sharing God's word through the written page",
    thumbnail: "https://images.unsplash.com/photo-1718745015015-09cd064a263b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    title: "Evangelism Sabbath",
    date: "July 12, 2025",
    time: "8:00 AM - 5:00 PM",
    location: "Church Main Sanctuary",
    department: "Evangelism Dpt.",
    description: "Community health expo offering free health screenings, nutrition information, exercise demonstrations, and health lectures.",
    thumbnail: "https://i.pinimg.com/736x/30/06/a6/3006a6eaf3e2e72edc43068cde53ab94.jpg",
  },
  {
    id: 5,
    title: "Ambassadors Cookery",
    date: "July 20, 2025",
    time: "8:00 AM - 5:00 PM",
    location: "Church Main Sanctuary",
    department: "Ambassadors Dpt.",
    description: "Get ready for a delicious experience! The Ambassadors department invites you to a special cookery event where you'll learn to create a variety of amazing dishes. ",
    thumbnail: "https://images.unsplash.com/photo-1532499016263-f2c3e89de9cd?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 6,
    title: "District Children Ministry Sabbath",
    date: "July 26, 2025",
    time: "8:00 AM - 5:00 PM",
    location: "TBC",
    department: "Children Ministries",
    description: "Join children from all our sister churches for a special day of joyful songs, amazing stories, fun activities, and powerful worship made just for you. It's going to be a blast!",
    thumbnail: "https://i.pinimg.com/736x/8c/c5/67/8cc567e015621cd2e2ed35a384dbf61c.jpg",
  },
  {
    id: 7,
    title: "District Music Sabbath",
    date: "June 21, 2025",
    time: "8:00 AM - 5:00 PM",
    location: "K.Sukari Church",
    department: "Worship Committee",
    description: "Special resurrection service celebrating Christ's victory over death with choir performances and special readings.",
    thumbnail: "https://i.pinimg.com/736x/6e/02/66/6e026627a6dd1008e61dad40b3cf8289.jpg",
  }
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
      <Header />
      
      <main className="">
        {/* Hero Section */}
        <section className="relative h-[400px] flex items-center justify-center">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
            <img 
              src="https://i.pinimg.com/736x/e8/86/f0/e886f04adcd89551b7bc2926422588f5.jpg" 
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
                      <img 
                        src={event.thumbnail} 
                        alt={event.title} 
                        className="w-full h-[15rem] object-cover"
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
