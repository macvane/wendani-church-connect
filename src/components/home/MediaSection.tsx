
import React, { useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from 'react-router-dom';

const MediaSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
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

  // These would be replaced with actual video IDs from the church's YouTube channel
  const sermonVideos = [
    { id: "N24zpN3AUzc?si=wqZijH6TflzZtTOd&amp;start=11521", title: " Make No Delay" }, 
    { id: "A90ftLtiGOU?si=KFGBFNfUaAVWfn2i&amp;start=16225", title: " The 'HEARTBEAT' Of Mission " },
    { id: "LmPDCRZ98rs?si=DawX54qOdBTbRrkG&amp;start=10418", title: "Getting Ready to Meet God" } 
  ];
  
  const musicVideos = [
    { id: "bBk9d4FfVfk", title: "Umefedheheshwa - Church Choir" },
    { id: "ZGbM1oTzrVM", title: "Usisongwesongwe - Youth Choir" },
    { id: "UyXrGFvm9mc", title: "Mambo Ya Kale - Ambassadors Choir" }
  ];

  const campMeetingVideos = [
    { id: "AtARIfHwNAw?si=X_E6N2jc7p8cZTB0", title: "Camp Meeting 2024 - Closing Day" }, 
    { id: "hwbcAwd9xg4?si=9yDWcXTZvSY956c-", title: "Camp Meeting 2024 - Sanctuary Message" },
    { id: "yyGJgIiAED4?si=DMG5t5nLaABgDiKU", title: "Camp Meeting 2024 - The Hidden God" }
  ];
  
  return (
    <section id="media" className="section bg-white" ref={sectionRef}>
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="section-title animate-on-scroll">Media Gallery</h2>
          <p className="section-subtitle animate-on-scroll animate-delay-1">
            Watch our latest sermons, music performances, and events from our church.
          </p>
        </div>
        
        <Tabs defaultValue="sermons" className="animate-on-scroll">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
            <TabsTrigger value="sermons">Sermons</TabsTrigger>
            <TabsTrigger value="music">Music</TabsTrigger>
            <TabsTrigger value="campmeeting">Camp Meeting</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sermons" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sermonVideos.map((video, index) => (
                <div key={index} className="rounded-lg overflow-hidden shadow-md">
                  <div className="aspect-w-16 aspect-h-9 h-[14rem]">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="font-bold text-lg mb-1">{video.title}</h3>
                    <p className="text-sm text-gray-500">Kahawa Wendani SDA Church</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="music" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {musicVideos.map((video, index) => (
                <div key={index} className="rounded-lg overflow-hidden shadow-md">
                  <div className="aspect-w-16 aspect-h-9 h-[14rem]">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="font-bold text-lg mb-1">{video.title}</h3>
                    <p className="text-sm text-gray-500">Kahawa Wendani SDA Church</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="campmeeting" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {campMeetingVideos.map((video, index) => (
                <div key={index} className="rounded-lg overflow-hidden shadow-md">
                  <div className="aspect-w-16 aspect-h-9 h-[14rem]">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="font-bold text-lg mb-1">{video.title}</h3>
                    <p className="text-sm text-gray-500">Kahawa Wendani SDA Church</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 text-center animate-on-scroll">
          <Link to="/media" className="btn btn-primary btn-lg">
            View All Media
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MediaSection;
