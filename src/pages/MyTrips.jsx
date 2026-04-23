import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Plane, Briefcase, Search, Filter } from 'lucide-react';
import TripCard from '../components/TripCard';
import { useTrips } from '../context/TripContext';

const STATUS_FILTERS = ['All', 'upcoming', 'completed', 'draft'];

export default function MyTrips() {
  const { trips } = useTrips();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = trips.filter(t => {
    const matchSearch = !search || t.destination?.toLowerCase().includes(search.toLowerCase())
      || t.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const upcomingCount = trips.filter(t => t.status === 'upcoming').length;
  const completedCount = trips.filter(t => t.status === 'completed').length;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
        >
          <div>
            <h1 className="section-title mb-1">My Trips</h1>
            <p className="text-slate-400">
              {trips.length === 0
                ? 'No trips yet. Plan your first adventure!'
                : `${upcomingCount} upcoming · ${completedCount} completed`}
            </p>
          </div>
          <Link to="/plan" className="btn-coral flex items-center gap-2 shrink-0">
            <Plus className="w-4 h-4" />
            New Trip
          </Link>
        </motion.div>

        {trips.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32"
          >
            <div className="w-24 h-24 glass rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Plane className="w-12 h-12 text-ocean-400" />
            </div>
            <h2 className="font-display font-bold text-white text-2xl mb-3">No trips planned yet</h2>
            <p className="text-slate-400 text-sm mb-8 max-w-sm mx-auto">
              Start planning your dream adventure. It only takes a few minutes!
            </p>
            <Link to="/plan" className="btn-coral inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Plan My First Trip
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col sm:flex-row gap-3 mb-8"
            >
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  className="input-field pl-10"
                  placeholder="Search trips..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                {STATUS_FILTERS.map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                      statusFilter === s
                        ? 'bg-ocean-600 text-white'
                        : 'glass text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {s}
                    {s !== 'All' && (
                      <span className="ml-1.5 text-xs opacity-70">
                        ({trips.filter(t => t.status === s).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Trip grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-400 text-sm">No trips match your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((trip, i) => (
                  <TripCard key={trip.id} trip={trip} index={i} />
                ))}

                {/* Add more card */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: filtered.length * 0.07 }}
                >
                  <Link
                    to="/plan"
                    className="h-full min-h-[280px] flex flex-col items-center justify-center gap-3 glass rounded-2xl border-2 border-dashed border-white/15 hover:border-ocean-500/40 hover:bg-ocean-500/5 text-slate-500 hover:text-ocean-400 transition-all group"
                  >
                    <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus className="w-7 h-7" />
                    </div>
                    <span className="text-sm font-medium">Plan Another Trip</span>
                  </Link>
                </motion.div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
