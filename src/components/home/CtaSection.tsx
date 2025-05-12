
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CtaSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-church-700 to-church-900 text-white">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Join Our Community of Faith</h2>
          <p className="text-lg mb-8">
            We invite you to join us for Sabbath worship and to be part of our church family. 
            Experience the joy of fellowship and grow in faith with us.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/contact" 
              className="px-8 py-3 bg-white text-church-700 hover:bg-gray-100 rounded-md font-medium transition-colors flex items-center"
            >
              Contact Us
              <ArrowRight size={16} className="ml-2" />
            </Link>
            <Link 
              to="/events" 
              className="px-8 py-3 border border-white text-white hover:bg-white/10 rounded-md font-medium transition-colors"
            >
              View Service Times
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
