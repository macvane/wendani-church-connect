import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { MapPin, Mail, Clock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useToast } from '@/hooks/use-toast';
import { contactAPI } from '@/utils/api';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Intersection Observer for scroll animations (no changes needed here)
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
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await contactAPI.create({
        full_name: formData.get('name') as string,
        email: formData.get('email') as string || undefined,
        phone_number: formData.get('phone') as string,
        subject: formData.get('subject') as string,
        message: formData.get('message') as string,
      });

      if (response.ok) {
        toast({
          title: "Message Sent!",
          description: "Thank you for contacting us. We'll get back to you soon.",
        });
        e.currentTarget.reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Submission Failed",
        description: "Could not send the message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact - Kahawa Wendani SDA Church</title>
        <meta name="description" content="Get in touch with Kahawa Wendani SDA Church. Find our address in Nairobi for your visit, service times, phone number, and email." />
        <link rel="canonical" href="https://kahawawendanisda.org/contact" />
      </Helmet>

      <Header />
      
      <main className="">
        {/* Hero Section */}
        <section className="relative h-[400px] flex items-center justify-center">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1505455184862-554165e5f6ba?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Contact Us" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container relative z-20 text-white text-center">
            <h1 className="mb-4">Contact Us</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Get in touch with us for any questions, prayer requests, or information about our church.
            </p>
          </div>
        </section>
        
        {/* Contact Info and Form */}
        <section className="section bg-white">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1 animate-on-scroll">
                <h2 className="text-2xl font-bold mb-6">Church Information</h2>
                
                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="bg-church-100 p-3 rounded-full mr-4">
                      <MapPin className="h-6 w-6 text-church-600" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Location</h3>
                      <p className="text-gray-600">Kahawa Wendani, Nairobi, Kenya</p>
                      <p className="text-gray-600">Near Kahawa Wendani Primary School</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-church-100 p-3 rounded-full mr-4">
                      <Mail className="h-6 w-6 text-church-600" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Email</h3>
                      <p className="text-church-600 hover:underline transition-all duration-500 ease-linear "><a href="mailto:info@kahawawendanisda.org">info@kahawawendanisda.org</a></p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-church-100 p-3 rounded-full mr-4">
                      <Clock className="h-6 w-6 text-church-600" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Service Hours</h3>
                      <p className="text-gray-600">Sabbath School: 8:00 AM</p>
                      <p className="text-gray-600">Divine Service: 11:00 AM</p>
                      <p className="text-gray-600">Afternoon Program: 2:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-2 animate-on-scroll animate-delay-1">
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block font-medium mb-1 text-gray-700">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" // Changed to 'name' for simplicity
                        placeholder='Full name'
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block font-medium mb-1 text-gray-700">
                        Email Address 
                      </label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email"
                        placeholder='youremail@gmail.com'
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block font-medium mb-1 text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone"
                      placeholder='Your number'
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block font-medium mb-1 text-gray-700">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      id="subject" 
                      name="subject"
                      placeholder='Your subject'
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block font-medium mb-1 text-gray-700">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      id="message" 
                      name="message"
                      placeholder='Your message'
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-600 focus:border-transparent"
                    ></textarea>
                  </div>
                  
                  <div>
                    {/* *** MODIFIED: Button state is now dynamic *** */}
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full px-8 py-3 bg-church-600 text-white rounded-md font-medium hover:bg-church-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? 'Sending Message...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
        
        {/* Map Section */}
        <section className="section bg-gray-50 pb-0">
          <div className="container mb-8">
            <h2 className="section-title animate-on-scroll">Find Us</h2>
            <p className="section-subtitle animate-on-scroll animate-delay-1">
              We're located in Kahawa Wendani, Nairobi. Join us this Sabbath!
            </p>
          </div>
          <div className="h-[500px] w-full animate-on-scroll animate-delay-2">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.941452822009!2d36.92801547418274!3d-1.2012572355374502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f3fc0686896b5%3A0x39495f1958453491!2sKahawa%20Wendani%20SDA!5e0!3m2!1sen!2ske!4v1746551897290!5m2!1sen!2ske" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              loading="lazy"
            ></iframe>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default Contact;