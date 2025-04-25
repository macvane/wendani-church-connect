
import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-16">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10">
          <div>
            <h3 className="text-xl font-bold mb-4 relative">
              <span className="relative z-10">About Us</span>
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-church-600"></span>
            </h3>
            <p className="mb-4">Kahawa Wendani SDA Church is committed to spreading the gospel and serving the community with love and compassion.</p>
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-church-600 flex items-center justify-center">
                <span className="text-white font-bold">KW</span>
              </div>
              <span className="font-serif font-bold text-xl">Kahawa Wendani SDA</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 relative">
              <span className="relative z-10">Quick Links</span>
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-church-600"></span>
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-church-300 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-church-300 transition-colors">Events</Link>
              </li>
              <li>
                <Link to="/media" className="hover:text-church-300 transition-colors">Media</Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-church-300 transition-colors">Blogs</Link>
              </li>
              <li>
                <Link to="/prayer" className="hover:text-church-300 transition-colors">Prayer Requests</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-church-300 transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 relative">
              <span className="relative z-10">Service Times</span>
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-church-600"></span>
            </h3>
            <ul className="space-y-2">
              <li className="flex flex-col">
                <span className="font-medium">Sabbath School</span>
                <span className="text-gray-400">Saturday 9:00 AM - 10:45 AM</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium">Divine Service</span>
                <span className="text-gray-400">Saturday 11:00 AM - 1:00 PM</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium">Afternoon Program</span>
                <span className="text-gray-400">Saturday 2:00 PM - 4:00 PM</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium">Midweek Prayer</span>
                <span className="text-gray-400">Wednesday 5:30 PM - 6:30 PM</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 relative">
              <span className="relative z-10">Contact Info</span>
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-church-600"></span>
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-church-500 mt-1 shrink-0" />
                <span>Kahawa Wendani, Nairobi, Kenya</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-church-500 shrink-0" />
                <span>info@kahawawendanisda.org</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-church-500 shrink-0" />
                <span>+254 700 000000</span>
              </li>
              <li className="flex items-start space-x-3">
                <Book size={18} className="text-church-500 mt-1 shrink-0" />
                <div>
                  <span className="block">Sabbath School: 9:00 AM</span>
                  <span className="block">Divine Service: 11:00 AM</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 py-6 text-center">
          <p className="text-gray-400">
            &copy; {year} Kahawa Wendani SDA Church. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
