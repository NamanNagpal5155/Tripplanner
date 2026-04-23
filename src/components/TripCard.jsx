import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Trash2, Eye, Edit3, Clock } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  upcoming:  'badge-ocean',
  completed: 'badge-green',
  draft:     'badge-sand',
};

export default function TripCard({ trip, index = 0 }) {
  const { deleteTrip } = useTrips();

  const handleDelete = (e) => {
    e.preventDefault();
    if (window.confirm(`Delete trip to ${trip.destination}?`)) {
      deleteTrip(trip.id);
      toast.success('Trip deleted');
    }
  };

  const duration = trip.startDate && trip.endDate
    ? Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))
    : null;

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="glass-card rounded-2xl overflow-hidden group"
    >
      {/* Top color bar */}
      <div className="h-1.5 bg-gradient-to-r from-ocean-500 to-coral-500" />

      {/* Image / Destination */}
      {trip.image && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={trip.image}
            alt={trip.destination}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-3 left-4">
            <span className={`badge ${STATUS_STYLES[trip.status] || 'badge-ocean'} capitalize`}>
              {trip.status}
            </span>
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="font-display font-bold text-white text-lg leading-tight">{trip.name || trip.destination}</h3>
            <div className="flex items-center gap-1.5 text-slate-400 text-sm mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-ocean-400" />
              {trip.destination}
            </div>
          </div>
          {!trip.image && (
            <span className={`badge ${STATUS_STYLES[trip.status] || 'badge-ocean'} capitalize shrink-0`}>
              {trip.status}
            </span>
          )}
        </div>

        {/* Info pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {trip.startDate && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 glass rounded-lg px-2.5 py-1.5">
              <Calendar className="w-3 h-3 text-ocean-400" />
              {formatDate(trip.startDate)}
            </div>
          )}
          {duration && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 glass rounded-lg px-2.5 py-1.5">
              <Clock className="w-3 h-3 text-coral-400" />
              {duration} day{duration !== 1 ? 's' : ''}
            </div>
          )}
          {trip.travelers && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 glass rounded-lg px-2.5 py-1.5">
              <Users className="w-3 h-3 text-sand-400" />
              {trip.travelers} traveler{trip.travelers !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-white/8">
          <Link
            to={`/trips/${trip.id}`}
            className="flex-1 flex items-center justify-center gap-2 glass hover:bg-ocean-600/20 hover:border-ocean-500/30 text-slate-300 hover:text-white text-sm font-medium py-2 rounded-xl transition-all"
          >
            <Eye className="w-4 h-4" />
            View
          </Link>
          <Link
            to={`/plan?edit=${trip.id}`}
            className="flex-1 flex items-center justify-center gap-2 glass hover:bg-sand-600/20 hover:border-sand-500/30 text-slate-300 hover:text-sand-300 text-sm font-medium py-2 rounded-xl transition-all"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="p-2 glass hover:bg-coral-600/20 hover:border-coral-500/30 text-slate-400 hover:text-coral-400 rounded-xl transition-all"
            aria-label="Delete trip"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
