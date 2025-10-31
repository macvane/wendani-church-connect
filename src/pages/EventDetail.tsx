import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { eventAPI } from "@/utils/api";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";

interface Event {
  id: number;
  title: string;
  description: string;
  venue: string;
  date: string;
  time: string;
  image: string;
  created_at: string;
}

export default function EventDetail() {
  const { slug } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchEvent(parseInt(slug));
    }
  }, [slug]);

  const fetchEvent = async (id: number) => {
    try {
      const response = await eventAPI.detail(id);
      if (response.ok) {
        const data = await response.json();
        setEvent(data);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="text-center py-20">Loading event details...</div>
        <Footer />
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Header />
        <div className="text-center py-20 text-red-500">Event not found.</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{event.title} | Church Events</title>
      </Helmet>

      <Header />

      <main className="">
        {/* Hero Section */}
        <section className="relative h-[400px] flex items-center justify-center">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
            <img 
              src={`https://macvane.pythonanywhere.com${event.image}`}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&auto=format&fit=crop&q=60';
              }}
            />
          </div>
          <div className="container relative z-20 text-white text-center">
            <h1 className="">{event.title}</h1>
          </div>
        </section>

        <div className="w-[90%] mx-auto py-[3rem]">
          <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
          <div className="flex flex-wrap items-center text-gray-600 gap-4 mb-6">
            <span className="flex items-center gap-1"><Calendar size={16} /> {format(new Date(event.date), 'MMM d, yyyy')}</span>
            <span className="flex items-center gap-1"><Clock size={16} /> {event.time}</span>
            <span className="flex items-center gap-1"><MapPin size={16} /> {event.venue}</span>
          </div>

          <p className="text-lg leading-relaxed mb-8">{event.description}</p>
        </div>
      </main>

      <Footer />
    </>
  );
}
