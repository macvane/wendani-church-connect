
import React from 'react';
import { Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LivestreamSection = () => {
  return (
    <section className="relative py-20 bg-gradient-to-b from-church-600/10 to-transparent">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8 animate-on-scroll">
            <Youtube className="w-16 h-16 mx-auto mb-6 text-church-600" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Watch Our Live Services</h2>
            <p className="text-gray-600 mb-8">
              Join us for live streaming of our Sabbath services and special events. Can't make it in person? 
              Watch from anywhere in the world!
            </p>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white gap-2"
              size="lg"
              onClick={() => window.open('https://www.youtube.com/@KahawaWendaniSDAChurchOfficial', '_blank')}
            >
              <Youtube className="w-5 h-5" />
              Watch Live on YouTube
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LivestreamSection;
