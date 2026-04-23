import { Link } from 'react-router-dom';
import { Plane, Heart, Globe, Share2, Camera } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Explore Destinations', to: '/explore' },
    { label: 'Plan a Trip', to: '/plan' },
    { label: 'My Trips', to: '/trips' },
  ],
  Company: [
    { label: 'About Us', to: '/' },
    { label: 'Blog', to: '/' },
    { label: 'Careers', to: '/' },
  ],
  Support: [
    { label: 'Help Center', to: '/' },
    { label: 'Privacy Policy', to: '/' },
    { label: 'Terms of Service', to: '/' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-slate-950/80 backdrop-blur-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-ocean-500 to-ocean-700 rounded-xl flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">TripPlanner</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Your ultimate travel companion for planning unforgettable journeys. 
              Discover destinations, build itineraries, and travel smart.
            </p>
            <div className="flex items-center gap-3">
              {[Globe, Share2, Camera].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 glass rounded-lg flex items-center justify-center text-slate-400 hover:text-ocean-400 hover:border-ocean-500/30 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-display font-semibold text-white mb-4 text-sm tracking-wide uppercase">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-slate-400 hover:text-ocean-400 text-sm transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} TripPlanner. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-coral-500 fill-coral-500" /> for travelers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
