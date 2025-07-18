
import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Helmet } from 'react-helmet-async';

const About = () => {
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

  // Sample church leaders data
  const churchLeaders = [
    {
      id: 1,
      name: "Pst. Macjoe Masesi",
      position: "District Pastor",
      image: "/leaders/pastor.JPG",
      bio: "Pst. Macjoe Masesi has been leading our church for 3 years with wisdom and compassion."
    },
    {
      id: 2,
      name: "Eld. Calvince Ouma",
      position: "First Church Elder",
      image: "/leaders/elder.jpg",
      bio: "Eld. Calvince Ouma has served as First Elder for 1 year, bringing energy and vision to our church."
    },
    {
      id: 3,
      name: "C.L. Hellen Wandollah",
      position: "Church Leader",
      image: "/leaders/leader.jpeg",
      bio: "C.L. Hellen Wandollah leads our church with dedication and servant leadership."
    }
  ];

  return (
    <>
      <Helmet>
        <title>About - Kahawa Wendani SDA Church</title>
        <meta name="description" content="The name “Wendani,” a rich Kikuyu word meaning “love,” perfectly embodies the spirit and essence of our church." />
        <link rel="canonical" href="https://kahawawendanisda.org/about" />
      </Helmet>

      <Header />
      
      <main className="">
        {/* Hero Section */}
        <section className="relative h-[400px] flex items-center justify-center">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
            <img 
              src="/assets/image (45).jpg" 
              alt="Church Building" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container relative z-20 text-white text-center">
            <h1 className="mb-4">About Our Church</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Learn about our history, mission, vision, and the leaders who serve our congregation.
            </p>
          </div>
        </section>
        
        {/* History Section */}
        <section className="section bg-white">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="section-title text-left animate-on-scroll">Our History</h2>
              
              <div className="prose max-w-none animate-on-scroll animate-delay-1">
                <p className="text-lg mb-4">
                The name “Wendani,” a rich Kikuyu word meaning “love,” perfectly embodies the spirit and essence of our church. SDA Church Kahawa Wendani has a deep-rooted history, originating from SDA Kahawa Garrison, where Wendani Sabbath School was born on July 23, 2005.
                </p>
                
                <p className="text-lg">
                On June 23, 2007, Wendani Sabbath School was formally organized into a church under the guidance of Pastor Marundu and Pastor Nzioka. We celebrated our first Holy Communion on July 14, 2007, marking a significant milestone in our spiritual journey. Since then, our church has continually evolved, relocating to our current location on June 29, 2013.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Mission & Vision */}
        <section className="section bg-gray-50">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="animate-on-scroll">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 font-serif">Our Mission</h2>
                  <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-church-600">
                    <p className="text-lg">
                    Make disciples of Jesus Christ who live as His loving witnesses and proclaim to all people the everlasting gospel of the Three Angels’ Messages in preparation for His soon return (Matt 28:18-20, Acts 1:8, Rev 14:6-12).
                    </p>
                  </div>
                </div>
                
                <div className="animate-on-scroll animate-delay-1">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 font-serif">Our Vision</h2>
                  <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-church-600">
                    <p className="text-lg">
                    In harmony with Bible revelation, Seventh-day Adventists see as the climax of God’s plan the restoration of all His creation to full harmony with His perfect will and righteousness.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Church Leaders */}
        <section className="section bg-white">
          <div className="container">
            <h2 className="section-title animate-on-scroll">Our Church Leaders</h2>
            <p className="section-subtitle animate-on-scroll animate-delay-1">
              Meet the dedicated team who serves our church and guides our spiritual journey.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {churchLeaders.map((leader, index) => (
                <div 
                  key={leader.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden animate-on-scroll"
                  style={{animationDelay: `${index * 0.1 + 0.2}s`}}
                >
                  <img 
                    src={leader.image} 
                    alt={leader.name} 
                    loading="lazy"
                    className="w-full h-[25rem] object-cover"
                  />
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-1">{leader.name}</h3>
                    <p className="text-church-600 font-medium mb-3">{leader.position}</p>
                    <p className="text-gray-600">
                      {leader.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-church-600 text-white">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-on-scroll">Join Our Church Family</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8 animate-on-scroll animate-delay-1">
              We'd love to welcome you to our services and activities. Come worship with us and be part of our church family.
            </p>
            <div className="animate-on-scroll animate-delay-2">
              <a href="/contact" className="btn bg-white text-church-700 hover:bg-gray-100 btn-lg">
                Visit Us This Sabbath
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default About;
