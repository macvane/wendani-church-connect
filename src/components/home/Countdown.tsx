import React, { useState, useEffect } from 'react';

const Countdown = () => {
  const calculateTimeLeft = () => {
    const difference = +new Date('2025-08-10T08:00:00') - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval] && timeLeft[interval] !== 0) {
      return;
    }

    timerComponents.push(
      <div key={interval} className="text-center space-y-2">
        <span className="text-4xl md:text-6xl font-light ">
          {String(timeLeft[interval]).padStart(2, '0')}
        </span>
        <span className="block bg-gray-600 rounded-md px-3 text-sm  uppercase">{interval}</span>
      </div>
    );
  });

  return (
    <section className="w-full py-16 bg-church-900 text-white">
      <div className="w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0">
        <div className="flex flex-col justify-center items-center">
          <div className="space-y-2 text-center">
            <h4 className="text-2xl md:text-3xl font-bold underline ">CAMP MEETING 2025</h4>
            <p className="text-white/70 text-lg">AUGUST 10, 2025 8:00AM</p>
          </div>
        </div>

        <div className="flex justify-center items-center space-x-4 md:space-x-8">
          {timerComponents.length ? timerComponents : <div className="text-2xl md:text-4xl font-bold text-center flex flex-col justify-center items-center space-y-2"><p>The camp meeting has begun!</p></div>}
        </div>
      </div>
    </section>
  );
};

export default Countdown;