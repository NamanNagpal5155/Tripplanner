import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Plane, Map, Star, ArrowRight, Compass, Shield, Zap,
  TrendingUp, ChevronLeft, ChevronRight
} from 'lucide-react';
import DestinationCard from '../components/DestinationCard';
import { DESTINATIONS } from '../data/destinations';

const TYPEWRITER_WORDS = ['Dream Trips', 'Adventures', 'Memories', 'Journeys', 'Experiences'];

function TypewriterText() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = TYPEWRITER_WORDS[index];
    let timeout;

    if (!deleting && text.length < word.length) {
      timeout = setTimeout(() => setText(word.slice(0, text.length + 1)), 100);
    } else if (!deleting && text.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(text.slice(0, -1)), 60);
    } else if (deleting && text.length === 0) {
      setDeleting(false);
      setIndex(i => (i + 1) % TYPEWRITER_WORDS.length);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, index]);

  return (
    <span className="gradient-text">
      {text}
      <span className="animate-pulse text-ocean-400">|</span>
    </span>
  );
}

const STATS = [
  { icon: Map,      value: '500+',   label: 'Destinations' },
  { icon: Star,     value: '50K+',   label: 'Happy Travelers' },
  { icon: Plane,    value: '1M+',    label: 'Trips Planned' },
  { icon: TrendingUp, value: '4.9★', label: 'Average Rating' },
];

const FEATURES = [
  {
    icon: Map,
    title: 'Smart Itinerary Builder',
    desc: 'Build day-by-day plans with activities, timing, and notes. Rearrange on the fly.',
    color: 'ocean',
  },
  {
    icon: Compass,
    title: 'Destination Discovery',
    desc: 'Explore 500+ curated destinations with photos, costs, and travel tips.',
    color: 'coral',
  },
  {
    icon: Shield,
    title: 'Packing Assistant',
    desc: 'Never forget essentials again. Smart checklists tailored to your destination.',
    color: 'sand',
  },
  {
    icon: Zap,
    title: 'Live Weather',
    desc: 'Real-time forecasts and 5-day outlooks for your destinations.',
    color: 'emerald',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Pick a Destination', desc: 'Browse our curated destinations or search for your dream spot.', emoji: '🌍' },
  { step: '02', title: 'Set Your Dates', desc: 'Choose travel dates and the number of travelers in your group.', emoji: '📅' },
  { step: '03', title: 'Build Your Itinerary', desc: 'Add activities, restaurants, and attractions day by day.', emoji: '🗓️' },
  { step: '04', title: 'Pack & Go!', desc: 'Use our smart packing list and head out on your adventure.', emoji: '✈️' },
];

const FEATURED = DESTINATIONS.slice(0, 6);

export default function Home() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 340, behavior: 'smooth' });
    }
  };

  return (
    <div className="overflow-hidden">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="aurora absolute top-1/4 left-1/4 w-96 h-96 bg-ocean-700/20 rounded-full blur-3xl" />
          <div className="aurora absolute bottom-1/3 right-1/4 w-80 h-80 bg-coral-600/10 rounded-full blur-3xl"
               style={{ animationDelay: '3s' }} />
          <div className="aurora absolute top-1/2 right-1/3 w-64 h-64 bg-ocean-500/15 rounded-full blur-2xl"
               style={{ animationDelay: '5s' }} />
        </div>

        {/* Floating cards (decorative) */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-32 left-8 hidden xl:block glass rounded-2xl p-3 shadow-2xl"
        >
          <div className="flex items-center gap-2">
            <img src={DESTINATIONS[0].image} className="w-10 h-10 rounded-lg object-cover" alt="" />
            <div>
              <div className="text-white text-xs font-semibold">{DESTINATIONS[0].name}</div>
              <div className="text-ocean-400 text-xs flex items-center gap-0.5">
                <Star className="w-2.5 h-2.5 fill-current" />
                {DESTINATIONS[0].rating}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-40 right-10 hidden xl:block glass rounded-2xl p-4 shadow-2xl"
        >
          <div className="text-white text-xs font-semibold mb-1">✈️ Tokyo → Paris</div>
          <div className="text-ocean-400 text-xs">Trip planned in 3 mins</div>
        </motion.div>

        {/* Hero content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="badge badge-ocean mb-6 inline-flex">
              🌟 &nbsp; Your Ultimate Travel Companion
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-white leading-tight mb-6"
          >
            Plan Your <br />
            <TypewriterText />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="section-subtitle mb-10 max-w-2xl mx-auto"
          >
            From destination discovery to day-by-day itineraries — TripPlanner makes your perfect
            vacation effortless, beautiful, and unforgettable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/plan" className="btn-coral text-base px-8 py-4 flex items-center gap-2">
              <Plane className="w-5 h-5" />
              Start Planning Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/explore" className="btn-outline text-base px-8 py-4 flex items-center gap-2">
              <Compass className="w-5 h-5" />
              Explore Destinations
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500"
        >
          <div className="w-5 h-8 border-2 border-slate-600 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-ocean-500 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ icon: Icon, value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 text-center"
            >
              <Icon className="w-7 h-7 text-ocean-400 mx-auto mb-3" />
              <div className="font-display font-black text-3xl text-white">{value}</div>
              <div className="text-slate-400 text-sm mt-1">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-title mb-4"
            >
              Everything You Need to Travel Smart
            </motion.h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Powerful tools that make trip planning as exciting as the trip itself.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 group"
              >
                <div className={`w-12 h-12 rounded-2xl bg-${color}-600/20 border border-${color}-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 text-${color}-400`} />
                </div>
                <h3 className="font-display font-bold text-white text-lg mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR DESTINATIONS ─────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="section-title mb-2"
              >
                Popular Destinations
              </motion.h2>
              <p className="section-subtitle">Handpicked places loved by travelers worldwide</p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => scroll(-1)} className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:border-ocean-500/40 transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => scroll(1)} className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:border-ocean-500/40 transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex gap-5 overflow-x-auto no-scrollbar pb-4">
            {FEATURED.map((dest, i) => (
              <div key={dest.id} className="shrink-0 w-72 sm:w-80">
                <DestinationCard destination={dest} index={i} />
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/explore" className="btn-outline text-sm">
              View All Destinations <ArrowRight className="w-4 h-4 inline ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-title mb-4"
            >
              Plan a Trip in Minutes
            </motion.h2>
            <p className="section-subtitle">Four simple steps to your next adventure</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting line */}
            <div className="absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-ocean-700 to-transparent hidden lg:block" />

            {HOW_IT_WORKS.map(({ step, title, desc, emoji }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative"
              >
                <div className="w-20 h-20 glass-card rounded-2xl flex flex-col items-center justify-center mx-auto mb-5 relative z-10">
                  <span className="text-3xl">{emoji}</span>
                </div>
                <div className="text-ocean-500 text-xs font-bold tracking-widest uppercase mb-1">{step}</div>
                <h3 className="font-display font-bold text-white text-lg mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/plan" className="btn-coral text-base px-10 py-4 inline-flex items-center gap-2">
              <Plane className="w-5 h-5" />
              Start Your Journey
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ocean-800 to-ocean-950 border border-ocean-700/50 p-12 text-center glow-ocean"
          >
            {/* Orbs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-ocean-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-coral-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="text-5xl mb-4">🌍</div>
              <h2 className="font-display font-black text-4xl text-white mb-4">
                Your next adventure awaits
              </h2>
              <p className="text-ocean-200 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of travelers who plan smarter and travel better with TripPlanner.
              </p>
              <Link to="/plan" className="btn-coral text-base px-10 py-4 inline-flex items-center gap-2">
                Plan My Trip Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
