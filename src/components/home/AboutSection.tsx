
import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AboutSection = () => {
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
  
  return (
    <section id="about" className="section bg-gray-50" ref={sectionRef}>
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="section-title animate-on-scroll">About Our Church</h2>
          <p className="section-subtitle animate-on-scroll animate-delay-1">
            Building a community of faith, hope, and love in Kahawa Wendani and beyond.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center animate-on-scroll animate-delay-1">
            <div className="h-20 w-20 rounded-full bg-church-100 mx-auto flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-church-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Our Mission</h3>
            <p className="text-gray-600">
            Make disciples of Jesus Christ who live as His loving witnesses and proclaim to all people the everlasting gospel of the Three Angels’ Messages in preparation for His soon return (Matt 28:18-20, Acts 1:8, Rev 14:6-12).
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center animate-on-scroll animate-delay-2">
            <div className="h-20 w-20 rounded-full bg-church-100 mx-auto flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-church-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Our Vision</h3>
            <p className="text-gray-600">
            In harmony with Bible revelation, Seventh-day Adventists see as the climax of God’s plan the restoration of all His creation to full harmony with His perfect will and righteousness.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center animate-on-scroll animate-delay-3">
            <div className="h-20 w-20 rounded-full bg-church-100 mx-auto flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-church-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Our Values</h3>
            <p className="text-gray-600">
              Faith, service, integrity, community, and discipleship guide everything we do as we strive to create a loving church family.
            </p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link
            to='/about'
            className="btn btn-primary btn-lg animate-on-scroll"
          >
            Read More About Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
