
import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Map, Users, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const MissionsSection = () => {
  // Gallery of mission images with details
  const missionImages = [
    { 
      src: "/assets/image (46).jpg", 
      alt: "Mission outreach",
      title: "Prison Outreach",
      location: "Kamiti Prisons",
      date: "March 12, 2025"
    },
    { 
      src: "/assets/image (49).jpg", 
      alt: "Community service",
      title: "Elderly Home",
      location: "Kariobangi, Nairobi",
      date: "January 5, 2025" 
    },
    { 
      src: "/assets/image (24).jpg", 
      alt: "Bible study group",
      title: "Mulufumba Mission Outreach",
      location: "Busia, Kenya",
      date: "April 13, 2025"
    },
    { 
      src: "/assets/image (31).jpg", 
      alt: "Medical mission",
      title: "Medical Mission",
      location: "East Side Clinic",
      date: "February 18, 2025"
    }
  ];

  return (
    <section className="section bg-gradient-to-r from-blue-50 to-church-50">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12 animate-on-scroll">
          <h2 className="section-title">Answering Christ's Call to Mission</h2>
          <p className="section-subtitle">
            Spreading the gospel and serving communities around the world
          </p>
        </div>
        
        {/* Mission statement and call to action */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
          <div className="animate-on-scroll animate-delay-1">
            <h3 className="text-2xl md:text-3xl font-bold mb-6">Our Mission Field Is Global</h3>
            <p className="text-lg mb-6">
              "Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit." — Matthew 28:19
            </p>
            <p className="mb-8">
              As Seventh-day Adventists, we are called to share the everlasting gospel and prepare the world for Christ's return. Through various mission initiatives, our church members are actively involved in spreading God's love both locally and internationally.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to='/contact' className="btn btn-primary btn-lg">
                Join a Mission Trip
              </Link>
            </div>
          </div>
          
          {/* Main mission image with overlay quote */}
          <div className="animate-on-scroll animate-delay-2">
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <img 
                src="/assets/image .jpg" 
                alt="Mission work" 
                className="w-full h-[400px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <p className="font-serif italic mb-2">
                    "The church exists by mission, just as fire exists by burning."
                  </p>
                  <p className="text-sm">- Emil Brunner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mission highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: <Globe className="h-10 w-10 text-church-600" />,
              title: "Global Reach",
              description: "Our mission work bringing hope and healing worldwide."
            },
            {
              icon: <Users className="h-10 w-10 text-church-600" />,
              title: "Community Service",
              description: "Serving local needs through food banks, health clinics, and disaster relief."
            },
            {
              icon: <Map className="h-10 w-10 text-church-600" />,
              title: "Mission Trips",
              description: "Short-term missions that provide life-changing experiences for all involved."
            },
            {
              icon: <Share className="h-10 w-10 text-church-600" />,
              title: "Media Evangelism",
              description: "Reaching millions through digital platforms."
            }
          ].map((item, index) => (
            <Card key={index} className="border-none shadow-lg animate-on-scroll" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-church-100 rounded-full">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                <p>{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Mission gallery with overlay text */}
        <div className="animate-on-scroll animate-delay-3">
          <h3 className="text-2xl font-bold mb-6 text-center">Recent Mission Activities</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {missionImages.map((image, index) => (
              <div 
                key={index} 
                className="relative overflow-hidden rounded-lg h-64 group"
              >
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-90 flex flex-col justify-end p-4 text-white">
                  <h4 className="text-lg font-bold">{image.title}</h4>
                  <p className="text-sm mb-1">{image.location}</p>
                  <p className="text-xs font-semibold bg-church-600 inline-block px-2 py-1 rounded-sm self-start">
                    {image.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionsSection;
