import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const slides = [
  {
    image: "/assets/hero.JPG",
    eyebrow: "Nairobi East Conference",
    title: "Where Faith Meets Community",
    subtitle: "Welcome to your church home. Join us as we grow together in Christ, share everlasting truth, and serve our neighborhood.",
  },
  {
    image: "https://images.unsplash.com/photo-1523803326055-9729b9e02e5a?q=80&w=1471&auto=format&fit=crop",
    eyebrow: "Sabbath Worship",
    title: "Come Worship With Us",
    subtitle: "Every Sabbath morning we gather for Bible study, fellowship, and divine service in spirit and truth.",
  },
  {
    image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=1470&auto=format&fit=crop",
    eyebrow: "Together in Christ",
    title: "Growing in Faith Together",
    subtitle: "A vibrant family of believers committed to discipleship, mission, and the soon return of Jesus.",
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const pause = () => {
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative h-screen min-h-[640px] w-full overflow-hidden bg-[#0A192F]">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-[1200ms] ease-in-out",
            currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          {/* Modern layered gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A192F]/95 via-[#0A192F]/70 to-[#0A192F]/30 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 via-transparent to-transparent z-10" />

          <div className="relative z-20 h-full flex items-center">
            <div className="container">
              <div className="max-w-2xl">
                <span
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-church-600/20 border border-church-400/40 text-church-100 text-xs font-semibold uppercase tracking-widest transition-all duration-700",
                    currentSlide === index ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-church-400 animate-pulse" />
                  {slide.eyebrow}
                </span>
                <h1
                  className={cn(
                    "mt-6 text-white font-bold tracking-tight transition-all duration-1000 delay-150",
                    "text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05]",
                    currentSlide === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  )}
                >
                  {slide.title}
                </h1>
                <p
                  className={cn(
                    "mt-6 text-lg md:text-xl text-white/80 max-w-xl leading-relaxed transition-all duration-1000 delay-300",
                    currentSlide === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  )}
                >
                  {slide.subtitle}
                </p>
                <div
                  className={cn(
                    "mt-10 flex flex-wrap gap-4 transition-all duration-1000 delay-500",
                    currentSlide === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  )}
                >
                  <Link
                    to="/giving"
                    className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-church-600 hover:bg-church-500 text-white font-semibold shadow-lg shadow-church-900/40 transition-all"
                  >
                    Give Tithes & Offerings
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/30 text-white font-semibold transition-all"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation */}
      <button
        onClick={() => { setCurrentSlide((p) => (p - 1 + slides.length) % slides.length); pause(); }}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white flex items-center justify-center transition-all"
        aria-label="Previous"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => { setCurrentSlide((p) => (p + 1) % slides.length); pause(); }}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white flex items-center justify-center transition-all"
        aria-label="Next"
      >
        <ChevronRight size={20} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-10 left-0 right-0 z-30 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => { setCurrentSlide(index); pause(); }}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              currentSlide === index ? "bg-church-400 w-10" : "bg-white/40 hover:bg-white/60 w-6"
            )}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
