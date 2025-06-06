
import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sendToGoogleSheet } from '@/utils/googleSheets';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await sendToGoogleSheet({
        ...formData,
      }, 'contact');
      
      toast({
        title: "Message Sent",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission Failed",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
                      <p className="text-gray-600">info@kahawawendanisda.org</p>
                      <p className="text-gray-600">pastor@kahawawendanisda.org</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-church-100 p-3 rounded-full mr-4">
                      <Phone className="h-6 w-6 text-church-600" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Phone</h3>
                      <a href="tel:0726 410608">
                        <p className="text-gray-600">+254 726 410608</p>
                      </a>
                      <p className="text-gray-600">+254 711 000000</p>
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
                
                {/* <div className="mt-8">
                  <h3 className="font-bold mb-2">Connect With Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-church-100 p-2 rounded-full hover:bg-church-200 transition-colors">
                      <svg className="h-6 w-6 text-church-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                      </svg>
                    </a>
                    <a href="#" className="bg-church-100 p-2 rounded-full hover:bg-church-200 transition-colors">
                      <svg className="h-6 w-6 text-church-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                      </svg>
                    </a>
                    <a href="#" className="bg-church-100 p-2 rounded-full hover:bg-church-200 transition-colors">
                      <svg className="h-6 w-6 text-church-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5 0-.28-.03-.56-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                      </svg>
                    </a>
                    <a href="#" className="bg-church-100 p-2 rounded-full hover:bg-church-200 transition-colors">
                      <svg className="h-6 w-6 text-church-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  </div>
                </div> */}
              </div>
              
              <div className="lg:col-span-2 animate-on-scroll animate-delay-1">
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                
                <form action="https://api.web3forms.com/submit" method="POST" className="space-y-6">
                  <input type="hidden" name="access_key" value="203298c2-7be9-4de5-b1c6-1b91f760bea0"></input>
                   <input type="hidden" name="redirect" value="https://wendani-v2.vercel.app/thank-you" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block font-medium mb-1 text-gray-700">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        id="name" 
                        name="full name" 
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
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full px-8 py-3 bg-church-600 text-white rounded-md font-medium hover:bg-church-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
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
