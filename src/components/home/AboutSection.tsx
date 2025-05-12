
import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <section id="about" className="section bg-gradient-to-b from-gray-50 to-white py-16 md:py-24" ref={sectionRef}>
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="section-title animate-on-scroll relative inline-block">
            About Our Church
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-church-600 rounded-full"></span>
          </h2>
          <p className="section-subtitle animate-on-scroll animate-delay-1 text-gray-700">
            Building a community of faith, hope, and love in Kahawa Wendani and beyond.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="col-span-1 lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white shadow-lg border-0 overflow-hidden transform transition-all duration-300 hover:shadow-xl animate-on-scroll animate-delay-1">
                <div className="h-2 bg-church-600 w-full"></div>
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 rounded-full bg-church-100 mx-auto flex items-center justify-center mb-4 border-4 border-white shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-church-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-church-700">Our Mission</h3>
                  <p className="text-gray-600">
                    Make disciples of Jesus Christ who live as His loving witnesses and proclaim to all people the everlasting gospel of the Three Angels' Messages in preparation for His soon return (Matt 28:18-20, Acts 1:8, Rev 14:6-12).
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-lg border-0 overflow-hidden transform transition-all duration-300 hover:shadow-xl animate-on-scroll animate-delay-2">
                <div className="h-2 bg-church-600 w-full"></div>
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 rounded-full bg-church-100 mx-auto flex items-center justify-center mb-4 border-4 border-white shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-church-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-church-700">Our Vision</h3>
                  <p className="text-gray-600">
                    In harmony with Bible revelation, Seventh-day Adventists see as the climax of God's plan the restoration of all His creation to full harmony with His perfect will and righteousness.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-lg border-0 overflow-hidden transform transition-all duration-300 hover:shadow-xl animate-on-scroll animate-delay-3 md:col-span-2">
                <div className="h-2 bg-church-600 w-full"></div>
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 rounded-full bg-church-100 mx-auto flex items-center justify-center mb-4 border-4 border-white shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-church-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-church-700">Our Core Values</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    <div className="bg-church-50 p-3 rounded-lg">
                      <h4 className="font-bold text-church-700">Faith</h4>
                      <p className="text-sm text-gray-600">Trusting God's leading</p>
                    </div>
                    <div className="bg-church-50 p-3 rounded-lg">
                      <h4 className="font-bold text-church-700">Service</h4>
                      <p className="text-sm text-gray-600">Following Christ's example</p>
                    </div>
                    <div className="bg-church-50 p-3 rounded-lg">
                      <h4 className="font-bold text-church-700">Community</h4>
                      <p className="text-sm text-gray-600">Loving one another</p>
                    </div>
                    <div className="bg-church-50 p-3 rounded-lg">
                      <h4 className="font-bold text-church-700">Integrity</h4>
                      <p className="text-sm text-gray-600">Living with honesty</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="col-span-1 animate-on-scroll animate-delay-2">
            <Card className="bg-white shadow-lg h-full border-0 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-28 h-28">
                <div className="absolute transform rotate-45 bg-church-600 text-white text-sm font-bold py-1 right-[-35px] top-[32px] w-[170px] text-center">
                  Join Us
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6 text-center text-church-700 border-b border-church-100 pb-3">Why Choose Our Church?</h3>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-left font-medium">Spiritual Growth</AccordionTrigger>
                    <AccordionContent>
                      Deep Bible studies and prayer meetings that nurture your personal relationship with God.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-left font-medium">Community Support</AccordionTrigger>
                    <AccordionContent>
                      A loving church family that stands with you through life's joys and challenges.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-left font-medium">Service Opportunities</AccordionTrigger>
                    <AccordionContent>
                      Numerous ways to use your gifts to serve others and make a difference in our community.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="mt-8 relative">
                  <img src="/assets/image (4).jpg" alt="Church Service" className="w-full h-48 object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg flex items-end">
                    <div className="p-4 text-white">
                      <p className="text-sm font-medium">Join us every Saturday</p>
                      <p className="text-xs">9:00 AM - Bible Study</p>
                      <p className="text-xs">11:00 AM - Worship Service</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <Link
            to='/about'
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-church-600 hover:bg-church-700 transition-colors duration-300 shadow-md hover:shadow-lg animate-on-scroll"
          >
            Read More About Us
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
