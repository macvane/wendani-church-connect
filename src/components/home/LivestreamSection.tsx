
import React from 'react';
import { Youtube, Play, Video, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const LivestreamSection = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--secondary)/0.1),transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-on-scroll">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 mb-6 shadow-lg shadow-red-500/25">
              <Youtube className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Connect Through Our YouTube Channel
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Experience our worship services, sermons, and community events from anywhere in the world. 
              Join thousands of viewers in our growing online congregation.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 animate-on-scroll">
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 bg-gradient-to-br from-background to-background/50">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold">Live Services</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  Join our live Sabbath services every week and special events as they happen. 
                  Interact with our community through live chat.
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                  onClick={() => window.open('https://www.youtube.com/@KahawaWendaniSDAChurchOfficial/streams', '_blank')}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Live Stream
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 bg-gradient-to-br from-background to-background/50">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Video className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Previous Sermons</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  Access our complete library of past sermons, Bible studies, and inspirational messages. 
                  Never miss a word of spiritual growth.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  size="lg"
                  onClick={() => window.open('https://www.youtube.com/@KahawaWendaniSDAChurchOfficial/videos', '_blank')}
                >
                  <Video className="w-5 h-5 mr-2" />
                  Browse All Videos
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Stats and CTA */}
          <div className="text-center animate-on-scroll">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
              <div className="group">
                <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">500+</div>
                <div className="text-sm text-muted-foreground">Videos Available</div>
              </div>
              <div className="group">
                <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">Live</div>
                <div className="text-sm text-muted-foreground">Every Sabbath</div>
              </div>
              <div className="group">
                <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">Global</div>
                <div className="text-sm text-muted-foreground">Community</div>
              </div>
            </div>
            
            <Button 
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-8"
              size="lg"
              onClick={() => window.open('https://www.youtube.com/@KahawaWendaniSDAChurchOfficial?sub_confirmation=1', '_blank')}
            >
              <Users className="w-5 h-5 mr-2" />
              Subscribe to Our Channel
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LivestreamSection;
