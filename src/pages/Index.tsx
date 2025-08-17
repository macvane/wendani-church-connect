
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

// Components
import Hero from '@/components/home/Hero';
import Countdown from '@/components/home/Countdown';
import AboutSection from '@/components/home/AboutSection';
import ConstructionSection from '@/components/home/ConstructionSection';
import MediaSection from '@/components/home/MediaSection';
import EventsSection from '@/components/home/EventsSection';
import PastorateSection from '@/components/home/PastorateSection';
import BlogPreview from '@/components/home/BlogPreview';
import LivestreamSection from '@/components/home/LivestreamSection';
import BaptismSection from '@/components/home/BaptismSection';
import MissionsSection from '@/components/home/MissionsSection';
import ImageSlideshow from '@/components/home/ImageSlideshow';
import CtaSection from '@/components/home/CtaSection';
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
      <Helmet>
        <title>Home - Kahawa Wendani SDA Church</title>
        <meta name="description" content="Welcome to Kahawa Wendani SDA Church, a vibrant Seventh-day Adventist community in Nairobi. Join us for worship and fellowship." />
        <link rel="canonical" href="https://kahawawendanisda.org/" />
      </Helmet>
      <Header />
      <main>
        <Hero />
        <AboutSection />
        <BaptismSection />
        <EventsSection />
        <MissionsSection />
        <MediaSection />
        <ConstructionSection />
        <PastorateSection />
        {/* <ImageSlideshow /> */}
        <BlogPreview />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
};

export default Index;
