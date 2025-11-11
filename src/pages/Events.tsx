import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Calendar, MapPin, Clock, SortAsc, SortDesc } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Helmet } from 'react-helmet-async';
import { eventAPI } from '@/utils/api';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Event {
  slug: string;
  title: string;
  description: string;
  venue: string;
  date: string;
  from_date: string;
  to_date: string;
  time: string;
  image: string;
  created_at: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventAPI.list();
      if (response.ok) {
        const data = await response.json();

        // Default sort (nearest → furthest)
        const sortedEvents = data.sort((a: Event, b: Event) => {
          const aDate = new Date(a.from_date || a.date);
          const bDate = new Date(b.from_date || b.date);
          return aDate.getTime() - bDate.getTime();
        });
        setEvents(sortedEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const isDatePassed = (event: Event) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (event.to_date) {
      const endDate = new Date(event.to_date);
      return endDate < today;
    }

    const eventDate = new Date(event.date);
    return eventDate < today;
  };

  const getEventDateDisplay = (event: Event) => {
    if (event.from_date && event.to_date) {
      return `${format(new Date(event.from_date), 'MMM d')} – ${format(new Date(event.to_date), 'MMM d, yyyy')}`;
    }
    return format(new Date(event.date), 'MMM d, yyyy');
  };

  // Apply sorting order (controlled by dropdown)
  const sortEvents = (eventsArray: Event[], order: 'asc' | 'desc') => {
    return [...eventsArray].sort((a, b) => {
      const aDate = new Date(a.from_date || a.date).getTime();
      const bDate = new Date(b.from_date || b.date).getTime();
      return order === 'asc' ? aDate - bDate : bDate - aDate;
    });
  };

  const upcomingEvents = sortEvents(
    events.filter((event) => !isDatePassed(event)),
    sortOrder
  );

  const pastEvents = sortEvents(
    events.filter((event) => isDatePassed(event)),
    sortOrder === 'asc' ? 'desc' : 'asc' // Past events default to most recent first
  );

  return (
    <>
      <Helmet>
        <title>Events - Kahawa Wendani SDA Church</title>
        <meta
          name="description"
          content="Stay updated with upcoming events at Kahawa Wendani SDA Church in Nairobi. Join us for worship services, fellowship, community outreach, and special programs."
        />
        <link rel="canonical" href="https://kahawawendanisda.org/events" />
      </Helmet>

      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative h-[400px] flex items-center justify-center">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&auto=format&fit=crop&q=60"
              alt="Events"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container relative z-20 text-white text-center">
            <h1 className="mb-4">Church Events</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Join us for inspiring gatherings, worship, and community events throughout the year.
            </p>
          </div>
        </section>

        {/* Events Section */}
        <section className="section bg-white">
          <div className="container">
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
                <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                <TabsTrigger value="past">Past Events</TabsTrigger>
              </TabsList>

              {/* Sort Dropdown */}
              <div className="flex justify-end mb-6">
                <Select value={sortOrder} onValueChange={(v: 'asc' | 'desc') => setSortOrder(v)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">
                      <div className="flex items-center">
                        <SortAsc className="w-4 h-4 mr-2" /> Nearest First
                      </div>
                    </SelectItem>
                    <SelectItem value="desc">
                      <div className="flex items-center">
                        <SortDesc className="w-4 h-4 mr-2" /> Furthest First
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* UPCOMING EVENTS */}
              <TabsContent value="upcoming">
                {loading ? (
                  <div className="flex items-center justify-center py-24">
                    <div className="relative flex items-center justify-center w-24 h-24">
                      <div className="absolute w-24 h-24 border-4 border-[#007780] border-t-light rounded-full animate-spin"></div>
                      <img src="/logo.png" alt="Loading..." className="w-12 h-12 object-contain" />
                    </div>
                  </div>
                ) : upcomingEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No upcoming events at the moment.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.map((event) => (
                      <div
                        key={event.slug}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="relative h-48">
                          <img
                            src={`https://macvane.pythonanywhere.com${event.image}`}
                            alt={event.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&auto=format&fit=crop&q=60';
                            }}
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-church-600" />
                              <span>{getEventDateDisplay(event)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-church-600" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-church-600" />
                              <span>{event.venue}</span>
                            </div>
                          </div>
                          <div className="mt-8">
                            <Link 
                              to={`/events/${event.slug}`}
                              className="text-church-600 font-medium hover:text-church-700"
                            >
                              View Details →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* PAST EVENTS */}
              <TabsContent value="past">
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">Loading events...</p>
                  </div>
                ) : pastEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No past events to display.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastEvents.map((event) => (
                      <div
                        key={event.slug}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden opacity-75"
                      >
                        <div className="relative h-48">
                          <img
                            src={`https://macvane.pythonanywhere.com${event.image}`}
                            alt={event.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&auto=format&fit=crop&q=60';
                            }}
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-church-600" />
                              <span>{getEventDateDisplay(event)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-church-600" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-church-600" />
                              <span>{event.venue}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Events;
