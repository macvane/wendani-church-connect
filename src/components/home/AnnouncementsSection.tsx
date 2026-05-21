import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Download, Calendar, ArrowRight, Sparkles } from 'lucide-react';

const announcements = [
  {
    title: 'Sabbath Worship',
    body: 'Divine service begins at 11:00 AM. Sermon delivered by District Pastor Macjoe Masesi.',
  },
  {
    title: 'Midweek Prayer Gathering',
    body: 'Join us this Wednesday at 5:30 PM in the main sanctuary for an interactive prayer hour.',
  },
  {
    title: 'Library Registration Open',
    body: 'Members can now register online to get borrower IDs for our new church library system.',
  },
];

const programs = [
  {
    tag: 'Mission',
    when: 'Next Week',
    title: 'Kamiti Prison Outreach',
    body: 'Our missionary department is organizing a visitation drive. Drop your donations at the church office by Friday.',
    accent: 'from-church-500 to-church-700',
  },
  {
    tag: 'Spiritual Growth',
    when: 'Next Month',
    title: 'Annual District Camp Meeting',
    body: 'Prepare for a transformative week of spiritual revival, uplifting music, and specialized family seminar tracks.',
    accent: 'from-[#0A192F] to-church-700',
  },
];

const AnnouncementsSection = () => {
  return (
    <section className="relative bg-slate-50 py-20 md:py-28 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-church-100/60 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-church-50 blur-3xl pointer-events-none" />

      <div className="container relative">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Bulletin */}
          <div className="lg:col-span-2 animate-on-scroll">
            <div className="bg-white rounded-3xl shadow-xl shadow-church-900/5 border border-slate-100 p-7 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-church-50 text-church-700 text-xs font-semibold">
                  <Sparkles size={14} /> Weekly Announcements
                </div>
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Calendar size={14} /> Every Sat
                </span>
              </div>

              <ul className="space-y-4 flex-1">
                {announcements.map((a, i) => (
                  <li key={i} className="flex gap-3 group">
                    <span className="shrink-0 h-7 w-7 rounded-full bg-church-100 text-church-700 flex items-center justify-center mt-0.5 group-hover:bg-church-600 group-hover:text-white transition-colors">
                      <Check size={14} strokeWidth={3} />
                    </span>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      <span className="font-semibold text-slate-900">{a.title}:</span> {a.body}
                    </p>
                  </li>
                ))}
              </ul>

              <Link
                to="/downloads"
                className="mt-7 inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-[#0A192F] hover:bg-[#0A192F]/90 text-white text-sm font-semibold transition-colors"
              >
                <Download size={16} /> Download Full Bulletin (PDF)
              </Link>
            </div>
          </div>

          {/* Programs */}
          <div className="lg:col-span-3 animate-on-scroll animate-delay-1">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0A192F] font-serif">Upcoming Church Programs</h2>
                <p className="text-slate-600 mt-2">Mark your calendar — God's family on the move.</p>
              </div>
              <Link to="/events" className="hidden md:inline-flex items-center gap-1 text-church-700 font-semibold text-sm hover:text-church-800">
                All events <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {programs.map((p, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-3xl bg-white border border-slate-100 p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${p.accent}`} />
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-church-50 text-church-700 text-xs font-semibold">
                      {p.tag}
                    </span>
                    <span className="text-xs font-medium text-slate-500">{p.when}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0A192F] mb-2 group-hover:text-church-700 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnnouncementsSection;
