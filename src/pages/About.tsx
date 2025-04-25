
import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

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
      bio: "Pst. Macjoe Masesi has been leading our church for 8 years with wisdom and compassion."
    },
    {
      id: 2,
      name: "Sarah Johnson",
      position: "First Elder",
      image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?q=80&w=300",
      bio: "Sarah has served as First Elder for 3 years, bringing energy and vision to our church."
    },
    {
      id: 3,
      name: "C.L. Hellen Wandollah",
      position: "Church Leader",
      image: "/leaders/leader.jpeg",
      bio: "Michael leads our team of deacons with dedication and servant leadership."
    },
    {
      id: 4,
      name: "Grace Mwangi",
      position: "Head Deaconess",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300",
      bio: "Grace has been instrumental in organizing church activities and caring for members."
    },
    {
      id: 5,
      name: "David Ochieng",
      position: "Youth Leader",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300",
      bio: "David leads our vibrant youth ministry with passion and creativity."
    },
    {
      id: 6,
      name: "Ruth Njeri",
      position: "Sabbath School Superintendent",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300",
      bio: "Ruth brings enthusiasm and innovation to our Sabbath School programs."
    }
  ];

  return (
    <>
      <Header />
      
      <main className="">
        {/* Hero Section */}
        <section className="relative h-[400px] flex items-center justify-center">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1466442929976-97f336a657be?q=80&w=2000" 
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
                The name “Wendani,” a rich Kikuyu word meaning “love,” perfectly embodies the spirit and essence of our church. Sda Church Kahawa Wendani has a deep-rooted history, originating from SDA Kahawa Garrison, where Wendani Sabbath School was born on July 23, 2005.
                </p>
                
                <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="rounded-lg overflow-hidden shadow-md">
                    <img 
                      src="https://images.unsplash.com/photo-1473177104440-ffee2f376098?q=80&w=600" 
                      alt="Early Church Meeting" 
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4 bg-gray-50">
                      <p className="text-sm text-gray-600">Early church meetings in the late 1990s</p>
                    </div>
                  </div>
                  
                  <div className="rounded-lg overflow-hidden shadow-md">
                    <img 
                      src="https://images.unsplash.com/photo-1524230572899-a752b3835840?q=80&w=600" 
                      alt="Current Church Building" 
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4 bg-gray-50">
                      <p className="text-sm text-gray-600">Our current church facility (since 2010)</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-lg mb-4">
                Our journey began on a bright Sabbath morning when members of the church, expecting their usual worship at Kahawa Garrison, were unexpectedly denied entry. The Garrison commander had issued a directive that restricted civilian access, allowing only soldiers and their families to worship inside the barracks. Despite the abrupt change, our members displayed unwavering faith, worshiping under the sun by the roadside that day.
                </p>
                
                <p className="text-lg mb-4">
                In the spirit of resilience and community, the church leadership quickly found a temporary worship place in an incomplete house nearby, graciously offered by the Kerimu family. As our congregation grew, we continued our services outdoors until we relocated to Mama Mbau’s compound, and later to a space provided by Brother Denvas Nyamari Gekonde’s family. Our steadfast journey reflects our commitment to faith and fellowship.
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
