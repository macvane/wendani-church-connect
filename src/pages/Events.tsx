
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
    title: "Ambs Nature Sabbath",
    date: "May 17, 2025",
    time: "8:00 AM - 5:00 PM",
    location: "Michuki Park",
    department: "Ambassadors Dpt.",
    description: "Annual youth camp focused on spiritual growth, leadership development, and fellowship for young people aged 16-30.",
    thumbnail: "https://images.unsplash.com/photo-1578359968130-76b59bb5af13?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGljbmljfGVufDB8fDB8fHww",
  },
  {
    id: 3,
    title: "District Adventurers Sabbath",
    date: "May 17, 2025",
    time: "8:00 AM - 5:00 PM",
    location: "Church Main Sanctuary",
    department: "Adventurers Dpt",
    description: "A special seminar on building strong families, effective communication, and resolving conflicts in relationships.",
    thumbnail: "https://metrosda.org/wp-content/uploads/2022/07/adventurer-club-2.png",
  },
  {
    id: 4,
    title: "Music Sabbath",
    date: "May 24, 2025",
    time: "8:00 AM - 5:00 PM",
    location: "Church Main Sanctuary",
    department: "Music Dpt.",
    description: "Community health expo offering free health screenings, nutrition information, exercise demonstrations, and health lectures.",
    thumbnail: "https://images.unsplash.com/photo-1512733596533-7b00ccf8ebaf?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 5,
    title: "AWM (Emphasis) Sabbath",
    date: "June 14, 2025",
    time: "8:00 AM - 5:00 PM",
    location: "Church Main Sanctuary",
    department: "AWM Dpt.",
    description: "Annual women's retreat with guest speakers, workshops, prayer sessions, and fellowship activities.",
    thumbnail: "https://media.istockphoto.com/id/1987917916/photo/portrait-of-young-multiracial-girls-smiling-at-camera-standing-together-outdoors.webp?a=1&b=1&s=612x612&w=0&k=20&c=54Xb396qnnUWBBKb9kJR147gpOpHgDu-RWJcZ10TFe8=",
  },
  {
    id: 6,
    title: "AWM Week Of Prayer",
    date: "June 14, 2025",
    time: "8:00 AM - 5:00 PM",
    location: "Church Main Sanctuary",
    department: "AWM Dpt.",
    description: "12-hour continuous Bible study event covering the book of Revelation with different speakers and interactive sessions.",
    thumbnail: "https://media.istockphoto.com/id/1987917916/photo/portrait-of-young-multiracial-girls-smiling-at-camera-standing-together-outdoors.webp?a=1&b=1&s=612x612&w=0&k=20&c=54Xb396qnnUWBBKb9kJR147gpOpHgDu-RWJcZ10TFe8=",
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
