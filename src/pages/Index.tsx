
import React, { useEffect } from 'react';
import Hero from '@/components/home/Hero';
import AboutSection from '@/components/home/AboutSection';
import ConstructionSection from '@/components/home/ConstructionSection';
import MediaSection from '@/components/home/MediaSection';
import EventsSection from '@/components/home/EventsSection';
import PastorateSection from '@/components/home/PastorateSection';
import BlogPreview from '@/components/home/BlogPreview';
import LivestreamSection from '@/components/home/LivestreamSection';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Index = () => {
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
        <Hero />
        <AboutSection />
        <LivestreamSection />
        <ConstructionSection />
        <MediaSection />
        <EventsSection />
        <PastorateSection />
        <BlogPreview />
      </main>
      <Footer />
    </>
  );
};

export default Index;
