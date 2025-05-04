
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BaptismSection = () => {
  return (
    <section className="section bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          <div className="order-2 md:order-1 animate-on-scroll">
            <h2 className="section-title mb-6 text-left">Begin Your Journey Through Baptism</h2>
            <p className="text-lg mb-6">
              Baptism is a sacred ceremony that symbolizes your commitment to follow Christ and join our church family. It represents the washing away of sin and the beginning of a new life in Christ.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-church-100 text-church-600 flex items-center justify-center mr-3 mt-1">
                  <span>1</span>
                </div>
                <p>Learn about the significance and meaning of baptism in the Adventist faith</p>
              </div>
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-church-100 text-church-600 flex items-center justify-center mr-3 mt-1">
                  <span>2</span>
                </div>
                <p>Complete Bible studies to prepare for your baptism</p>
              </div>
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-church-100 text-church-600 flex items-center justify-center mr-3 mt-1">
                  <span>3</span>
                </div>
                <p>Make your public commitment to Christ through baptism by immersion</p>
              </div>
            </div>
            <Link to="/baptism">
              <Button size="lg" className="bg-church-600 hover:bg-church-700">
                Request Baptism
              </Button>
            </Link>
          </div>
          
          <div className="order-1 md:order-2 animate-on-scroll">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1563494756541-8664a7b41326?q=80&w=800" 
                alt="Baptism" 
                className="rounded-lg shadow-lg w-full"
              />
              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-lg shadow-md max-w-xs hidden md:block">
                <p className="text-sm italic text-gray-600">
                  "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit."
                </p>
                <p className="text-right font-medium text-sm mt-2">Matthew 28:19</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BaptismSection;
