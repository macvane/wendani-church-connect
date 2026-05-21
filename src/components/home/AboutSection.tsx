import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Eye, Heart, ArrowRight } from 'lucide-react';

const AboutSection = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const pillars = [
    {
      icon: Compass,
      title: 'Our Mission',
      body: "Make disciples of Jesus Christ who live as His loving witnesses and proclaim the everlasting gospel of the Three Angels' Messages in preparation for His soon return.",
    },
    {
      icon: Eye,
      title: 'Our Vision',
      body: 'In harmony with Bible revelation, we see as the climax of God\'s plan the restoration of all His creation to full harmony with His perfect will and righteousness.',
    },
    {
      icon: Heart,
      title: 'Our Values',
      body: 'Faith, fellowship, integrity, and service — anchored in Scripture, lived out in community, and shared with the world we are called to reach.',
    },
  ];

  return (
    <section id="about" className="section bg-slate-50 py-20 md:py-28">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-church-50 text-church-700 text-xs font-semibold uppercase tracking-widest">
            About Our Church
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A192F] font-serif animate-on-scroll">
            Faith, Fellowship & Purpose
          </h2>
          <p className="mt-4 text-slate-600 text-lg animate-on-scroll animate-delay-1 max-w-xl mx-auto">
            Building a community of faith, hope, and love in Kahawa Wendani and beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-on-scroll"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-church-500 to-church-700 flex items-center justify-center mb-6 shadow-lg shadow-church-700/20 group-hover:scale-110 transition-transform">
                  <Icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#0A192F] mb-3">{p.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{p.body}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0A192F] hover:bg-[#0A192F]/90 text-white font-semibold transition-colors"
          >
            Read More About Us <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
