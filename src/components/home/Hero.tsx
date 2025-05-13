
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const slides = [
  {
    image: "/assets/hero.JPG",
    title: "Welcome to Kahawa Wendani SDA Church",
    subtitle: "Where faith meets community"
  },
  {
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?q=80&w=2000",
    title: "Join Us in Worship",
    subtitle: "Every Sabbath at 9:00 AM"
  },
  {
    image: "https://images.unsplash.com/photo-1524230572899-a752b3835840?q=80&w=2000",
    title: "Growing in Faith Together",
    subtitle: "Building a community of believers"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // Handle automatic slideshow
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-playing after user interaction
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };
  
  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    // Resume auto-playing after user interaction
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };
  
  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    // Resume auto-playing after user interaction
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };
  
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div 
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
          
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-10000 ease-out"
            style={{
              backgroundImage: `url(${slide.image})`,
              transform: currentSlide === index ? "scale(1.05)" : "scale(1)",
            }}
          ></div>
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center z-20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center text-white">
                <h1 
                  className={cn(
                    "font-bold mb-4 transition-all duration-1000 transform",
                    currentSlide === index ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
                  )}
                >
                  {slide.title}
                </h1>
                <p 
                  className={cn(
                    "text-xl md:text-2xl mb-8 transition-all duration-1000 delay-300 transform",
                    currentSlide === index ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
                  )}
                >
                  {slide.subtitle}
                </p>
                <div 
                  className={cn(
                    "flex gap-4 justify-center transition-all duration-1000 delay-500 transform",
                    currentSlide === index ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
                  )}
                >
                  <Link to="/about" className="btn btn-primary btn-lg">
                    Learn More
                  </Link>
                  <Link to="/contact" className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-gray-900">
                    Join Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation Arrows */}
      <button 
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              currentSlide === index ? "bg-white w-6" : "bg-white bg-opacity-50 hover:bg-opacity-75"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
