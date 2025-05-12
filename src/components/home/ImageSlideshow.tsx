
import React, { useState, useEffect } from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const images = [
  {
    src: "/assets/image (5).jpg",
    alt: "Church Activity"
  },
  {
    src: "/assets/image (6).jpg",
    alt: "Church Service"
  },
  {
    src: "/assets/image (7).jpg",
    alt: "Church Event"
  },
  {
    src: "/assets/image (8).jpg", 
    alt: "Church Members"
  },
  {
    src: "/assets/image (9).jpg",
    alt: "Church Building"
  }
];

const ImageSlideshow = () => {
  const [autoPlay, setAutoPlay] = useState(true);
  const [api, setApi] = useState<any>();
  
  useEffect(() => {
    if (!api || !autoPlay) {
      return;
    }
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000);
    
    return () => {
      clearInterval(interval);
    };
  }, [api, autoPlay]);
  
  const handleMouseEnter = () => setAutoPlay(false);
  const handleMouseLeave = () => setAutoPlay(true);
  
  return (
    <section className="section bg-gray-50">
      <div className="container">
        <h2 className="section-title mb-2">Glimpses of Our Church</h2>
        <p className="section-subtitle mb-10">
          Moments captured during our church events, services, and gatherings.
        </p>
        
        <div 
          className="w-full max-w-5xl mx-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Carousel setApi={setApi} className="w-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-2">
                    <div className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
                      <img 
                        src={image.src} 
                        alt={image.alt} 
                        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-4">
              <CarouselPrevious className="relative static lg:absolute border-church-600 text-church-600 hover:bg-church-100 hover:text-church-700 hover:border-church-700" />
              <CarouselNext className="relative static lg:absolute border-church-600 text-church-600 hover:bg-church-100 hover:text-church-700 hover:border-church-700" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default ImageSlideshow;
