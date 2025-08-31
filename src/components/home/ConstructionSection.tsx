
import React, { useRef } from 'react';
import WistiaEmbed from './ContructionPromo';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const ConstructionSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Construction journey milestones with images
  const milestones = [
    {
      title: "Land Acquisition",
      date: "August 2023",
      description: "We successfully acquired 1/2 acre of land in a prime location for our new church building.",
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1200",
      completed: true
    },
    {
      title: "Project Planning",
      date: "November 2023",
      description: "Architectural designs were completed and approved by the church board and local authorities.",
      image: "/assets/image (45).jpg",
      completed: true
    },
    {
      title: "Ground Breaking",
      date: "May 2025",
      description: "The official ground breaking ceremony was held with church members and community leaders.",
      image: "/assets/image (30).jpg",
      completed: true
    },
    {
      title: "Foundation Work",
      date: "August 2025",
      description: "Site clearing and foundation work has begun, setting the structural base for our new church.",
      image: "/assets/dev.jpeg",
      completed: false
    }
  ];
  
  return (
    <section className="relative py-20 text-white overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-church-800 bg-opacity-85 z-10"></div>
        <img 
          src="/assets/image (45).jpg"
          alt="Church Construction"
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container relative z-20">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="section-title text-white animate-on-scroll">Building Our Future Church</h2>
          <p className="section-subtitle text-white/90 animate-on-scroll animate-delay-1">
            Join us in our mission to build a new sanctuary for worship, fellowship, and community service.
          </p>
        </div>
        
        {/* Journey Carousel */}
        <div className="mb-16 animate-on-scroll">
          <h3 className="text-2xl font-bold mb-6 text-center">Our Construction Journey</h3>
          <Carousel className="w-full">
            <CarouselContent>
              {milestones.map((milestone, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardContent className="flex flex-col p-0 aspect-[4/3]">
                        <div className="relative h-40">
                          <img 
                            src={milestone.image} 
                            alt={milestone.title} 
                            loading='lazy'
                            className="w-full h-full object-cover"
                          />
                          {milestone.completed && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                              Completed
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <div className="text-sm text-white/70 mb-1">{milestone.date}</div>
                          <h4 className="text-lg font-bold mb-2">{milestone.title}</h4>
                          <p className="text-sm text-white/90 flex-1">{milestone.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 lg:-left-12 bg-white/20 border-white/30 text-white hover:bg-white/30" />
            <CarouselNext className="right-0 lg:-right-12 bg-white/20 border-white/30 text-white hover:bg-white/30" />
          </Carousel>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
          <div className="animate-on-scroll animate-delay-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 w-full ">
              <WistiaEmbed />
            </div>
          </div>
          
          <div className="animate-on-scroll animate-delay-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-2xl font-bold mb-4">Support Our Construction</h3>
              <p className="mb-6">
                Your contribution, whether big or small, brings us one step closer to completing our new church building. Together, we can create a place of worship that will serve generations to come.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-church-600 flex items-center justify-center">
                    <span className="font-bold">1</span>
                  </div>
                  <span>Pray for the success of our construction project</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-church-600 flex items-center justify-center">
                    <span className="font-bold">2</span>
                  </div>
                  <span>Contribute financially through our church account</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-church-600 flex items-center justify-center">
                    <span className="font-bold">3</span>
                  </div>
                  <span>Volunteer your skills and time to the project</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-church-600 flex items-center justify-center">
                    <span className="font-bold">4</span>
                  </div>
                  <span>Spread the word and invite others to support</span>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Link
                  to='/donate'
                  className="btn bg-church-600 hover:bg-church-700 text-white flex-1 text-center btn-lg"
                >
                  Donate Now
                </Link>
                <a href="https://forms.gle/schMhtN6arvjUHmd8" className="btn bg-white text-church-700 hover:bg-gray-100 flex-1 text-center">
                  Join a Group
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConstructionSection;
