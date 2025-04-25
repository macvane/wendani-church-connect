
import React, { useRef, useEffect } from 'react';

const ConstructionSection = () => {
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
    <section className="relative py-20 text-white overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-church-800 bg-opacity-85 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2600"
          alt="Church Construction"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container relative z-20">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="section-title text-white animate-on-scroll">Building Our Future Church</h2>
          <p className="section-subtitle text-white/90 animate-on-scroll animate-delay-1">
            Join us in our mission to build a new sanctuary for worship, fellowship, and community service.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="animate-on-scroll">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-2xl font-bold mb-4">Our Progress So Far</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm font-medium">
                    <span>Land Acquisition</span>
                    <span>100%</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div className="bg-church-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1 text-sm font-medium">
                    <span>Foundation</span>
                    <span>80%</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div className="bg-church-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1 text-sm font-medium">
                    <span>Structural Work</span>
                    <span>45%</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div className="bg-church-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1 text-sm font-medium">
                    <span>Interior & Finishes</span>
                    <span>10%</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div className="bg-church-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1 text-sm font-medium">
                    <span>Overall Completion</span>
                    <span>40%</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div className="bg-church-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Funds Raised:</span>
                  <span className="font-medium">KES 12,500,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Target:</span>
                  <span className="font-medium">KES 30,000,000</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="animate-on-scroll animate-delay-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-2xl font-bold mb-4">Support Our Construction</h3>
              <p className="mb-6">
                Your contribution, whether big or small, brings us one step closer to completing our new church building. Together, we can create a place of worship that will serve generations to come.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-church-600 flex items-center justify-center">
                    <span className="font-bold">1</span>
                  </div>
                  <span>Pray for the success of our construction project</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-church-600 flex items-center justify-center">
                    <span className="font-bold">2</span>
                  </div>
                  <span>Contribute financially through our church account</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-church-600 flex items-center justify-center">
                    <span className="font-bold">3</span>
                  </div>
                  <span>Volunteer your skills and time to the project</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-church-600 flex items-center justify-center">
                    <span className="font-bold">4</span>
                  </div>
                  <span>Spread the word and invite others to support</span>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <a href="#" className="btn bg-church-600 hover:bg-church-700 text-white flex-1 text-center">
                  Donate Now
                </a>
                <a href="#" className="btn bg-white text-church-700 hover:bg-gray-100 flex-1 text-center">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConstructionSection;
