
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
      name: "John Doe",
      position: "Senior Pastor",
      image: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=300",
      bio: "Pastor John has been leading our church for 8 years with wisdom and compassion."
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
      name: "Michael Kimani",
      position: "Head Deacon",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300",
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
      
      <main className="pt-16">
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
                  Kahawa Wendani SDA Church was established in 1995 with just 15 members meeting in a small rented hall. Through God's leading and the dedication of its founding members, the church has grown to become a vibrant spiritual community serving hundreds of worshippers every Sabbath.
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
                  In the early 2000s, the congregation had grown to over 100 members, necessitating a move to a larger facility. Through sacrificial giving and dedicated fundraising efforts, the church purchased land in Kahawa Wendani and began constructing its first permanent building.
                </p>
                
                <p className="text-lg mb-4">
                  By 2010, the first phase of our current church building was completed, providing a sanctuary capable of seating 300 worshippers. The church has continued to grow both spiritually and numerically, launching various ministries to serve both members and the wider community.
                </p>
                
                <p className="text-lg">
                  Today, Kahawa Wendani SDA Church stands as a testament to God's faithfulness and the unwavering commitment of its members. We continue to build on the foundation laid by our pioneers as we look forward to completing our new sanctuary that will accommodate our growing congregation.
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
                      To spread the everlasting gospel in the context of the three angels' messages of Revelation 14 and lead people to accept Jesus as their personal Savior, unite with His church, and nurture them in preparation for His soon return.
                    </p>
                  </div>
                </div>
                
                <div className="animate-on-scroll animate-delay-1">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 font-serif">Our Vision</h2>
                  <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-church-600">
                    <p className="text-lg">
                      To be a beacon of light in our community, reflecting Christ's character, and nurturing a spiritual environment where all can grow in grace and prepare for Christ's soon return.
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
                    className="w-full h-64 object-cover"
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
