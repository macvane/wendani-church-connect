
import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Map, Users, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const MissionsSection = () => {
  // Gallery of mission images
  const missionImages = [
    { 
      src: "/assets/image (12).jpg", 
      alt: "Mission outreach" 
    },
    { 
      src: "/assets/image (36).jpg", 
      alt: "Community service" 
    },
    { 
      src: "/assets/image (25).jpg", 
      alt: "Bible study group" 
    },
    { 
      src: "/assets/image (31).jpg", 
      alt: "Medical mission" 
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
              <Button size="lg" className="bg-church-600 hover:bg-church-700">
                Join a Mission Trip
              </Button>
              <Link to="/mission">
                <Button size="lg" variant="outline" className="border-church-600 text-church-600">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Main mission image with overlay quote */}
          <div className="animate-on-scroll animate-delay-2">
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <img 
                src="/assets/image (19).jpg" 
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
              description: "Our mission work spans over 200 countries, bringing hope and healing worldwide."
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
              description: "Reaching millions through radio, television, and digital platforms."
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
        
        {/* Mission gallery */}
        <div className="animate-on-scroll animate-delay-3">
          <h3 className="text-2xl font-bold mb-6 text-center">Recent Mission Activities</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {missionImages.map((image, index) => (
              <div 
                key={index} 
                className="relative overflow-hidden rounded-lg h-48 md:h-64"
              >
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionsSection;
