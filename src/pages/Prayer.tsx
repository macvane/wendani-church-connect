
import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/hooks/use-toast';

const Prayer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    requestType: 'personal',
    prayerRequest: '',
    isConfidential: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate sending to Google Sheets
    setTimeout(() => {
      toast({
        title: "Prayer Request Submitted",
        description: "Thank you for sharing your prayer request. Our prayer team will be praying for you.",
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        requestType: 'personal',
        prayerRequest: '',
        isConfidential: false,
      });
      
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <>
      <Header />
      
      <main>
        {/* Hero Section with Adjusted Positioning */}
        <section className="relative h-[400px] flex items-center justify-center pt-16">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1473177104440-ffee2f376098?q=80&w=2000" 
              alt="Prayer" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container relative z-20 text-white text-center">
            <h1 className="mb-4">Prayer Requests</h1>
            <p className="text-xl max-w-3xl mx-auto">
              "Don't worry about anything; instead, pray about everything." - Philippians 4:6
            </p>
          </div>
        </section>
        
        {/* Prayer Introduction */}
        <section className="section bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="section-title animate-on-scroll">We Are Here to Pray With You</h2>
              <div className="prose max-w-none animate-on-scroll animate-delay-1">
                <p className="text-lg mb-4">
                  At Kahawa Wendani SDA Church, we believe in the power of prayer. Whether you're facing personal challenges, health issues, or simply want to give thanks, our prayer team is committed to lifting your requests to God.
                </p>
                <p className="text-lg mb-4">
                  Fill out the form below to submit your prayer request. You can choose whether your request should be kept confidential (seen only by our prayer team leaders) or shared with the larger prayer team.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Prayer Request Form */}
        <section className="section bg-gray-50">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Prayer Request Form</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block font-medium mb-1 text-gray-700">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block font-medium mb-1 text-gray-700">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block font-medium mb-1 text-gray-700">
                      Phone Number
                    </label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="requestType" className="block font-medium mb-1 text-gray-700">
                      Request Type <span className="text-red-500">*</span>
                    </label>
                    <select 
                      id="requestType" 
                      name="requestType"
                      value={formData.requestType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                    >
                      <option value="personal">Personal Request</option>
                      <option value="family">Family Request</option>
                      <option value="health">Health & Healing</option>
                      <option value="financial">Financial Need</option>
                      <option value="guidance">Guidance & Direction</option>
                      <option value="thanksgiving">Thanksgiving</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="prayerRequest" className="block font-medium mb-1 text-gray-700">
                      Your Prayer Request <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      id="prayerRequest" 
                      name="prayerRequest"
                      value={formData.prayerRequest}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                      placeholder="Please share your prayer request here. Be as specific as you're comfortable with..."
                    ></textarea>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="isConfidential" 
                      name="isConfidential"
                      checked={formData.isConfidential}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-church-600 focus:ring-church-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isConfidential" className="ml-2 block text-gray-700">
                      Keep this request confidential (only prayer team leaders will see it)
                    </label>
                  </div>
                  
                  <div className="flex justify-center pt-4">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-8 py-3 bg-church-600 text-white rounded-md font-medium hover:bg-church-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Prayer Request'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
        
        {/* Scripture Verses */}
        <section className="section bg-white">
          <div className="container">
            <h2 className="section-title animate-on-scroll">Encouraging Scripture Verses</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="bg-gray-50 p-6 rounded-lg text-center animate-on-scroll">
                <p className="text-xl italic mb-4">
                  "Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God."
                </p>
                <p className="text-church-600 font-bold">- Philippians 4:6</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg text-center animate-on-scroll animate-delay-1">
                <p className="text-xl italic mb-4">
                  "Call to me and I will answer you, and will tell you great and hidden things that you have not known."
                </p>
                <p className="text-church-600 font-bold">- Jeremiah 33:3</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg text-center animate-on-scroll animate-delay-2">
                <p className="text-xl italic mb-4">
                  "Rejoice always, pray without ceasing, give thanks in all circumstances; for this is the will of God in Christ Jesus for you."
                </p>
                <p className="text-church-600 font-bold">- 1 Thessalonians 5:16-18</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default Prayer;
