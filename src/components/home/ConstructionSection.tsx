import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Check, Clock, ArrowRight } from 'lucide-react';

const ConstructionSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const ContructionVideos = [
    "https://res.cloudinary.com/dxvzdn2ao/video/upload/v1765798967/KahawaWendaniSDAChurchDev1_pmbzci.mp4",
    "https://res.cloudinary.com/dxvzdn2ao/video/upload/v1765798969/KahawaWendaniSDAChurchDev2_orgyot.mp4",
    "https://res.cloudinary.com/dxvzdn2ao/video/upload/v1765798976/KahawaWendaniSDAChurchDev_mycavh.mp4",
    "https://res.cloudinary.com/dxvzdn2ao/video/upload/v1765798980/KahawaWendaniSDAChurchDev4_s8bawb.mp4",
  ];

  const milestones = [
    {
      step: '01',
      status: 'Completed',
      title: 'Site Acquisition',
      description: 'Procured and cleared the project development plot, matching all institutional zoning requirements.',
      done: true,
    },
    {
      step: '02',
      status: 'Completed',
      title: 'Engineering Designs',
      description: 'Structural blueprint parameters finalized and signed off by regional authorities.',
      done: true,
    },
    {
      step: '03',
      status: 'In Progress',
      title: 'Substructure Foundation',
      description: 'Excavation works, concrete foundation pouring, and ground reinforcements currently active on-site.',
      done: false,
    },
    {
      step: '04',
      status: 'Upcoming',
      title: 'Superstructure',
      description: 'Walls, columns, and roofing — the rise of our future sanctuary.',
      done: false,
    },
  ];

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 bg-[#0A192F] text-white overflow-hidden">
      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-church-600/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-church-500/10 blur-3xl" />

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-church-600/20 border border-church-400/30 text-church-100 text-xs font-semibold uppercase tracking-widest">
            Building Project
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold font-serif animate-on-scroll">
            Our Sanctuary Building Journey
          </h2>
          <p className="mt-4 text-white/70 text-lg animate-on-scroll animate-delay-1 max-w-xl mx-auto">
            Transparent roadmap documenting our ongoing construction journey.
          </p>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {milestones.map((m, i) => (
            <div
              key={i}
              className="group relative bg-white/[0.04] backdrop-blur border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] hover:border-church-400/40 transition-all duration-300 animate-on-scroll"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-white/20 group-hover:text-church-400/60 transition-colors">
                  {m.step}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                    m.done
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                      : m.status === 'In Progress'
                      ? 'bg-amber-500/20 text-amber-200 border border-amber-400/30'
                      : 'bg-white/10 text-white/70 border border-white/20'
                  }`}
                >
                  {m.done ? <Check size={12} /> : <Clock size={12} />} {m.status}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2">{m.title}</h3>
              <p className="text-sm text-white/70 leading-relaxed">{m.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Videos */}
          <div className="animate-on-scroll">
            <div className="grid grid-cols-2 gap-3">
              {ContructionVideos.map((video, index) => (
                <div key={index} className="aspect-video rounded-2xl overflow-hidden border border-white/10">
                  <video muted loop autoPlay playsInline src={video} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* CTA Card */}
          <div className="animate-on-scroll animate-delay-2">
            <div className="rounded-3xl bg-gradient-to-br from-church-600 to-church-800 p-8 md:p-10 border border-church-400/30 shadow-2xl">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 font-serif">Support Our Construction</h3>
              <p className="text-white/85 mb-6 leading-relaxed">
                Your contribution, big or small, brings us closer to completing a place of worship that will serve generations to come.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  'Pray for the success of our construction project',
                  'Contribute financially through our church account',
                  'Volunteer your skills and time to the project',
                  'Spread the word and invite others to support',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="h-8 w-8 shrink-0 rounded-full bg-white/15 backdrop-blur flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </span>
                    <span className="text-sm text-white/90">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/giving"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-church-700 hover:bg-white/90 font-semibold transition-colors"
                >
                  Donate Now <ArrowRight size={16} />
                </Link>
                <a
                  href="https://forms.gle/schMhtN6arvjUHmd8"
                  className="flex-1 inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur border border-white/30 text-white font-semibold transition-colors"
                >
                  Join a Group
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConstructionSection;
