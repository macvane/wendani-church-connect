
import React, { useRef, useEffect } from 'react';

const PastorateSection = () => {
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
    <section className="section bg-white" ref={sectionRef}>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="animate-on-scroll">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-church-100 rounded-tl-3xl z-0"></div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-church-100 rounded-br-3xl z-0"></div>
              <img 
                src="/leaders/pastor.JPG" 
                alt="Pastor" 
                className="rounded-lg shadow-lg relative z-10 w-full h-auto"
              />
            </div>
          </div>
          
          <div className="animate-on-scroll animate-delay-2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">Pastorate Statement</h2>
            
            <div className="mb-8">
              <p className="text-lg mb-4 text-gray-700">
                "As your pastor, I am committed to guiding our church family in spiritual growth and community service. My vision is to create a church where everyone feels welcomed, valued, and empowered to grow in their relationship with Christ."
              </p>
              <p className="text-lg mb-4 text-gray-700">
                "Together, we will build a church that not only nurtures our members but also reaches out to the community, sharing God's love and message of hope with all who seek Him."
              </p>
              <p className="text-lg text-gray-700">
                "I invite you to join us on this spiritual journey as we worship, learn, serve, and grow together in faith."
              </p>
            </div>
            
            <div className="flex items-center">
              <div className="mr-4">
                <img 
                  src="/leaders/pastor.JPG" 
                  alt="Pastor Signature" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-church-600"
                />
              </div>
              <div>
                <h4 className="font-bold text-xl">Pst. Macjoe Masesi</h4>
                <p className="text-gray-600">Pastor, Kahawa District</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PastorateSection;
