// src/pages/EventDetail.jsx
import React from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { allEventsData } from "./Events"; // import your shared data
import { Calendar, MapPin, Clock } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function EventDetail() {
  const { slug } = useParams();
const event = allEventsData.find((e) => e.slug === slug);

  if (!event) {
    return <div className="text-center py-20 text-red-500">Event not found.</div>;
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
              src={event.thumbnail} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container relative z-20 text-white text-center">
            <h1 className="">{event.title}</h1>
          </div>
        </section>

        <div className="w-[90%] mx-auto py-[3rem]">
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
        <div className="flex flex-wrap items-center text-gray-600 gap-4 mb-6">
          <span className="flex items-center gap-1"><Calendar size={16} /> {event.date}</span>
          <span className="flex items-center gap-1"><Clock size={16} /> {event.time}</span>
          <span className="flex items-center gap-1"><MapPin size={16} /> {event.location}</span>
        </div>

        <p className="text-lg leading-relaxed mb-8">{event.description}</p>

        <div className="border-t pt-6">
          <p className="text-sm text-gray-500">Department: <strong>{event.department}</strong></p>
        </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
