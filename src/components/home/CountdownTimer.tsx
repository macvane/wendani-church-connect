import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC = () => {
  // Camp meeting date - set to July 25, 2025 (you can adjust this date)
  const targetDate = new Date('2025-07-25T08:00:00').getTime();

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setIsExpired(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired) {
    return (
      <section className="section bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-3xl font-bold text-primary">Camp Meeting</h2>
            </div>
            <p className="text-lg text-muted-foreground">
              The camp meeting has begun! Join us for this blessed time of fellowship and worship.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section bg-gradient-to-r from-primary/10 to-primary/5">
      <div className="container text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Clock className="w-8 h-8 text-primary mr-3" />
            <h2 className="text-3xl font-bold text-primary">Camp Meeting Countdown</h2>
          </div>
          
          <p className="text-lg text-muted-foreground mb-8">
            Join us for our annual camp meeting - a blessed time of spiritual renewal and fellowship
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-primary/10">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {timeLeft.days.toString().padStart(2, '0')}
              </div>
              <div className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-wide">
                Days
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 border border-primary/10">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-wide">
                Hours
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 border border-primary/10">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-wide">
                Minutes
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 border border-primary/10">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-wide">
                Seconds
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <p className="text-muted-foreground">
              <span className="font-semibold">Date:</span> July 25, 2025 | 
              <span className="font-semibold"> Time:</span> 8:00 AM
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountdownTimer;