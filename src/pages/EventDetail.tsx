import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { eventAPI } from "@/utils/api";
import { Calendar, MapPin, Clock, ArrowLeft, Download, Video } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Event {
  id: number;
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

export default function EventDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const formatEventDate = () => {
    const fromDate = (event as any)?.from_date || event?.date;
    const toDate = (event as any)?.to_date;


    if (fromDate && toDate) {
      return `${format(new Date(fromDate), 'MMMM d, yyyy')} - ${format(new Date(toDate), 'MMMM d, yyyy')}`;
    }


    return format(new Date(fromDate), 'MMMM d, yyyy');
  };

  useEffect(() => {
    if (slug) {
      fetchEvent(slug);
    }
  }, [slug]);

  const fetchEvent = async (slug: string) => {
    try {
      const response = await eventAPI.detail(slug);
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
        <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading event details...</p>
        </div>
      </div>
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

      <main>
        {/* Generic Hero Section */}
        <section className="relative h-[300px] flex items-center justify-center">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-fixed bg-gradient-to-r from-primary/80 to-primary/60 z-10"></div>
            <img 
              src={`https://churchmedia.kahawawendanisda.org${event.image}`}
              alt="Church event"
              className="w-full h-full object-top object-cover"
            />
          </div>
          <div className="container relative z-20 text-white">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-4 text-white hover:bg-white/20 border"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Button>
            <h1 className="text-4xl md:text-5xl font-bold">{event.title}</h1>
          </div>
        </section>

        {/* Main Content with Sticky Sidebar */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Event Image */}
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={`https://churchmedia.kahawawendanisda.org${event.image}`}
                  alt={event.title}
                  className="w-full h-[400px] object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80';
                  }}
                />
              </div>

              {/* Event Details */}
              <div className="space-y-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-accent px-4 py-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="font-medium">{formatEventDate()}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-accent px-4 py-2 rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="font-medium">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-accent px-4 py-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="font-medium">{event.venue}</span>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                  <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                </div>
              </div>
            </div>

            {/* Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Quick Actions */}
                {/* <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full" size="lg">
                      Register for Event
                    </Button>
                    <Button variant="outline" className="w-full">
                      Share Event
                    </Button>
                  </CardContent>
                </Card> */}

                {/* Downloads Section */}
                {/* <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Downloads
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="/campmeeting2025booklet.pdf" target="_blank">
                        Event Booklet (PDF)
                      </a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="/q3exodus.pdf" target="_blank">
                        Study Guide (PDF)
                      </a>
                    </Button>
                  </CardContent>
                </Card> */}

                {/* Media Section */}
                {/* <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5" />
                      Related Media
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="/media">
                        Watch Previous Events
                      </a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="/media">
                        View Photo Gallery
                      </a>
                    </Button>
                  </CardContent>
                </Card> */}

                {/* Contact Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Have questions about this event? Contact our events team.
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="/contact">
                        Contact Us
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Bottom CTA Section */}
          <div className="mt-16 bg-primary text-primary-foreground rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Don't Miss This Event!</h2>
            <p className="text-lg mb-6 opacity-90">
              Join us for an inspiring time of worship, fellowship, and spiritual growth.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to='/events'
              >
                  <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                View All Events
              </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
