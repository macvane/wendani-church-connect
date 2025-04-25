
import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const choirs = [
  {
    id: "church-choir",
    name: "Church Choir",
    description: "Our main church choir ministers through beautiful hymns and anthems during divine service and special programs.",
    leader: "Emily Wanjiku",
    contact: "+254 712 345678",
    message: "Music is a divine language that transcends barriers and speaks directly to the soul. Join us as we use our voices to worship and praise our Creator.",
    videos: [
      { id: "dQw4w9WgXcQ", title: "Amazing Grace" },
      { id: "dQw4w9WgXcQ", title: "How Great Thou Art" },
      { id: "dQw4w9WgXcQ", title: "It Is Well With My Soul" },
    ]
  },
  {
    id: "youth-choir",
    name: "Youth Choir",
    description: "Our youth choir brings energy and passion through contemporary Christian music and creative arrangements.",
    leader: "Daniel Omondi",
    contact: "+254 723 456789",
    message: "We believe that worship through music should be vibrant and engaging. Join our youth choir to experience the joy of praising God through contemporary songs.",
    videos: [
      { id: "dQw4w9WgXcQ", title: "Days of Elijah" },
      { id: "dQw4w9WgXcQ", title: "Shout to the Lord" },
      { id: "dQw4w9WgXcQ", title: "10,000 Reasons" },
    ]
  },
  {
    id: "ambassadors-choir",
    name: "Ambassadors Choir",
    description: "Our Ambassadors Choir specializes in traditional African gospel music with rich harmonies and rhythms.",
    leader: "Paul Mwangi",
    contact: "+254 734 567890",
    message: "African gospel music celebrates our cultural heritage while praising God with authentic rhythms and harmonies. Join us to experience worship with African flavor.",
    videos: [
      { id: "dQw4w9WgXcQ", title: "Mungu Ni Mwema" },
      { id: "dQw4w9WgXcQ", title: "Neno Lake Bwana" },
      { id: "dQw4w9WgXcQ", title: "Bwana Asifiwe" },
    ]
  },
  {
    id: "childrens-choir",
    name: "Children's Choir",
    description: "Our children's choir nurtures young voices and helps children worship through music.",
    leader: "Grace Njoroge",
    contact: "+254 745 678901",
    message: "It's never too early to start worshipping God through music. Our children's choir is a nurturing environment where young voices grow in talent and faith.",
    videos: [
      { id: "dQw4w9WgXcQ", title: "Jesus Loves Me" },
      { id: "dQw4w9WgXcQ", title: "This Little Light of Mine" },
      { id: "dQw4w9WgXcQ", title: "He's Got The Whole World" },
    ]
  }
];

const Media = () => {
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
      
      <main>
        {/* Hero Section with Adjusted Positioning */}
        <section className="relative h-[400px] flex items-center justify-center ">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2000" 
              alt="Church Media" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container relative z-20 text-white text-center">
            <h1 className="mb-4">Church Media</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Explore our collection of sermons, choir performances, and special programs.
            </p>
          </div>
        </section>
        
        {/* Choir Tabs */}
        <section className="section bg-white">
          <div className="container">
            <h2 className="section-title animate-on-scroll">Our Choirs</h2>
            <p className="section-subtitle animate-on-scroll animate-delay-1">
              Discover the beautiful music from our various church choirs.
            </p>
            
            <Tabs defaultValue="church-choir" className="mt-12 animate-on-scroll animate-delay-2">
              <TabsList className="flex flex-wrap justify-center mb-8">
                {choirs.map(choir => (
                  <TabsTrigger key={choir.id} value={choir.id} className="px-6">
                    {choir.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {choirs.map(choir => (
                <TabsContent key={choir.id} value={choir.id}>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-2xl font-bold mb-4">{choir.name}</h3>
                        <p className="mb-4 text-gray-700">{choir.description}</p>
                        
                        <div className="border-t border-gray-200 pt-4 mt-4">
                          <h4 className="font-bold mb-2">Choir Leader</h4>
                          <p className="text-gray-700 mb-1">{choir.leader}</p>
                          <p className="text-gray-600 mb-4">{choir.contact}</p>
                          
                          <h4 className="font-bold mb-2">Join Our Choir</h4>
                          <p className="text-gray-700 mb-4">
                            {choir.message}
                          </p>
                          
                          <a href="/contact" className="btn btn-primary">
                            Contact Us to Join
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    <div className="lg:col-span-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {choir.videos.map((video, index) => (
                          <div key={index} className="rounded-lg overflow-hidden shadow-md">
                            <div className="aspect-w-16 aspect-h-9">
                              <iframe
                                src={`https://www.youtube.com/embed/${video.id}`}
                                title={video.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                              ></iframe>
                            </div>
                            <div className="p-4 bg-white">
                              <h3 className="font-bold text-lg">{video.title}</h3>
                              <p className="text-sm text-gray-500">{choir.name}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
        
        {/* Recent Sermons */}
        <section className="section bg-gray-50">
          <div className="container">
            <h2 className="section-title animate-on-scroll">Recent Sermons</h2>
            <p className="section-subtitle animate-on-scroll animate-delay-1">
              Watch recordings of our recent worship services and sermons.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i} 
                  className="rounded-lg overflow-hidden shadow-md animate-on-scroll"
                  style={{animationDelay: `${i * 0.1}s`}}
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={`https://www.youtube.com/embed/dQw4w9WgXcQ`}
                      title={`Sermon ${i}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-48"
                    ></iframe>
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="font-bold text-lg mb-1">{`Sabbath Service - April ${i + 10}, 2025`}</h3>
                    <p className="text-sm text-gray-500 mb-2">Pastor John Doe</p>
                    <p className="text-gray-700 line-clamp-2">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default Media;
