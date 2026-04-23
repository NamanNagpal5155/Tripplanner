import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Map, Compass, BookOpen, Menu, X, Globe } from 'lucide-react';
import { useTrips } from '../context/TripContext';

const navLinks = [
  { to: '/',        label: 'Home',      icon: Globe },
  { to: '/explore', label: 'Explore',   icon: Compass },
  { to: '/plan',    label: 'Plan Trip', icon: Map },
  { to: '/trips',   label: 'My Trips',  icon: BookOpen },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { trips } = useTrips();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-dark shadow-xl shadow-black/30' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-ocean-500 to-ocean-700 rounded-xl flex items-center justify-center shadow-lg shadow-ocean-900/50 group-hover:scale-110 transition-transform duration-200">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col -space-y-0.5">
                <span className="font-display font-bold text-lg text-white leading-none">TripPlanner</span>
                <span className="text-ocean-400 text-[10px] font-medium tracking-widest uppercase">Travel Smart</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-white bg-white/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-indicator"
                          className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-ocean-400 rounded-full"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              {trips.length > 0 && (
                <Link to="/trips">
                  <span className="badge badge-ocean">
                    <span>{trips.length}</span>
                    <span>Trip{trips.length !== 1 ? 's' : ''}</span>
                  </span>
                </Link>
              )}
              <Link to="/plan" className="btn-primary text-sm py-2">
                + Plan Trip
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 glass-dark border-b border-white/10 shadow-2xl md:hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-ocean-600/20 text-ocean-300 border border-ocean-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </NavLink>
              ))}
              <div className="pt-2 border-t border-white/10">
                <Link to="/plan" className="btn-primary text-sm w-full text-center block">
                  + Plan a New Trip
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
