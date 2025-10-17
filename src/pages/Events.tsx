
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
    id: 1,
    title: "Development Sabbath",
    date: "Oct 04, 2025",
    time: "8:00 AM - 5:00 PM",
    location: "Church Main Sactuary",
    department: "Development Dpt.",
    description: "Mark your calendars! Our Development Sabbath will take place on 4th October 2025. ",
    thumbnail: "/posters/development.png",
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
  {
  id: 5,
  title: "ADVENTURERS’ FAMILY CAMP OUT",
  date: "Nov 11–16, 2025",
  time: "8:00 AM - 5:00 PM",
  location: "KAMITI HOSTEL GROUNDS",
  department: "Adventurers Dept.",
  description: "Join us for the Adventurers’ Family Camp Out from 11th to 16th November 2025 at Kamiti Hostel Grounds — a week of worship, fun, and family bonding in nature. Registration closes on 14th October.",
  thumbnail: "https://i.pinimg.com/1200x/6e/2f/e1/6e2fe1b894d912e2b3c537f633c3bd26.jpg",
},
  {
  id: 5,
  title: "ANNUAL PATHFINDER FAIR",
  date: "Nov 23, 2025",
  time: "8:00 AM - 5:00 PM",
  location: "RIVERSIDE BURUBURU",
  department: "Pathfinders Dept.",
  description: "The Annual Pathfinder Fair will be held on 23rd November 2025 at Riverside Buruburu. Registration is KES 250 per participant, payable by 16th November 2025.",
  thumbnail: "https://i.pinimg.com/736x/11/fa/01/11fa01bf5d67d680594decadc5a75b47.jpg",
}
,
  {
  id: 5,
  title: "PATHFINDER CAMPOUT",
  date: "Dec 9–14, 2025",
  time: "8:00 AM - 5:00 PM",
  location: "NYAHURURU ADVENTIST PRIMARY SCHOOL",
  department: "Pathfinders Dept.",
  description: "The Pathfinder Campout will be held at Nyahururu Adventist Primary School from 9th to 14th December 2025. Registration is KES 1,300 per participant, payable by 1st December 2025.",
  thumbnail: "data:image/jpeg;base64,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",
},
{
  id: 5,
  title: "DISTRICT AYS YOUTH MISSION/CRUSADE",
  date: "Dec 14–27, 2025",
  time: "8:00 AM - 5:00 PM",
  location: "Mukurweini, Nyeri County",
  department: "Ays Dept.",
  description: "The District AYS Youth Mission/Crusade will run from 14th to 27th December 2025 in Mukurweini, Nyeri County. Let’s remember our youths in prayer as they prepare, and all are encouraged to plan and participate.",
  thumbnail: "https://i.pinimg.com/736x/18/77/57/1877571d94437db2b3e59ff7b2a0e657.jpg",
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
                          <h3 className="font-semibold text-lg">{event.title}</h3>
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
                        
                        <p className="text-gray-700 mb-4 line-clamp-">
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
