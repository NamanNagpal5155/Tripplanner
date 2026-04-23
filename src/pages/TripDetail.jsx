import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Calendar, Users, ArrowLeft, Edit3, Trash2,
  Map as MapIcon, List, Package, Cloud, Clock, Star
} from 'lucide-react';
import { useTrips } from '../context/TripContext';
import ItineraryBuilder from '../components/ItineraryBuilder';
import PackingChecklist from '../components/PackingChecklist';
import WeatherWidget from '../components/WeatherWidget';
import MapView from '../components/MapView';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'itinerary', label: 'Itinerary', icon: List },
  { id: 'map',       label: 'Map',       icon: MapIcon },
  { id: 'packing',   label: 'Packing',   icon: Package },
  { id: 'weather',   label: 'Weather',   icon: Cloud },
];

export default function TripDetail() {
  const { id } = useParams();
  const { trips, deleteTrip, addActivity, removeActivity } = useTrips();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('itinerary');

  const trip = trips.find(t => t.id === id);

  if (!trip) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="font-display font-bold text-white text-2xl mb-3">Trip not found</h2>
          <p className="text-slate-400 text-sm mb-6">This trip may have been deleted.</p>
          <Link to="/trips" className="btn-primary text-sm">← Back to My Trips</Link>
        </div>
      </div>
    );
  }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—';
  const duration = trip.startDate && trip.endDate
    ? Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))
    : null;

  const handleDelete = () => {
    if (window.confirm(`Delete trip to ${trip.destination}?`)) {
      deleteTrip(trip.id);
      toast.success('Trip deleted');
      navigate('/trips');
    }
  };

  const handleAddActivity = (day, activity) => {
    addActivity(trip.id, day, activity);
    toast.success('Activity added!');
  };

  const handleRemoveActivity = (day, activityIndex) => {
    removeActivity(trip.id, day, activityIndex);
    toast.success('Activity removed');
  };

  const mapMarkers = trip.lat && trip.lng
    ? [{ lat: trip.lat, lng: trip.lng, name: trip.destination, description: trip.country }]
    : [];

  const STATUS_STYLE = {
    upcoming:  'badge-ocean',
    completed: 'badge-green',
    draft:     'badge-sand',
  };

  return (
    <div className="min-h-screen pt-20 pb-20">
      {/* Hero Image */}
      {trip.image && (
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <img src={trip.image} alt={trip.destination} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

          {/* Back button */}
          <div className="absolute top-24 left-4 sm:left-8">
            <Link
              to="/trips"
              className="flex items-center gap-2 glass rounded-xl px-3 py-2 text-white text-sm hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              My Trips
            </Link>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`glass-card rounded-2xl p-6 mb-6 ${trip.image ? '-mt-16 relative z-10' : 'mt-8'}`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-display font-black text-white text-2xl sm:text-3xl">
                  {trip.name || `Trip to ${trip.destination}`}
                </h1>
                <span className={`badge ${STATUS_STYLE[trip.status] || 'badge-ocean'} capitalize`}>
                  {trip.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-ocean-400" />
                  {trip.destination}{trip.country ? `, ${trip.country}` : ''}
                </span>
                {trip.startDate && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-coral-400" />
                    {formatDate(trip.startDate)}
                    {trip.endDate && ` → ${formatDate(trip.endDate)}`}
                  </span>
                )}
                {trip.travelers && (
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-sand-400" />
                    {trip.travelers} traveler{trip.travelers !== 1 ? 's' : ''}
                  </span>
                )}
                {duration && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    {duration} days
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to={`/plan?edit=${trip.id}`}
                className="flex items-center gap-1.5 glass hover:bg-ocean-500/10 hover:border-ocean-500/30 text-slate-300 hover:text-white text-sm font-medium px-4 py-2 rounded-xl transition-all"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 glass hover:bg-coral-600/20 hover:border-coral-500/30 text-slate-400 hover:text-coral-400 text-sm font-medium px-4 py-2 rounded-xl transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>

          {/* Style tags */}
          {trip.style && trip.style.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/8">
              {trip.style.map(s => (
                <span key={s} className="tag capitalize">{s}</span>
              ))}
              {trip.budget && (
                <span className="tag capitalize">💰 {trip.budget}</span>
              )}
            </div>
          )}
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 glass-card rounded-2xl p-1.5 mb-6">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-ocean-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'itinerary' && (
            <div>
              <p className="text-slate-400 text-sm mb-4">
                {duration
                  ? `Building itinerary for ${duration} days`
                  : 'Add activities to your trip itinerary'}
              </p>
              <ItineraryBuilder
                tripId={trip.id}
                itinerary={trip.itinerary || []}
                days={duration || 3}
                onAddActivity={handleAddActivity}
                onRemoveActivity={handleRemoveActivity}
              />
            </div>
          )}

          {activeTab === 'map' && (
            <div>
              <p className="text-slate-400 text-sm mb-4">Your destination on the map</p>
              {mapMarkers.length > 0 ? (
                <MapView
                  markers={mapMarkers}
                  center={[mapMarkers[0].lat, mapMarkers[0].lng]}
                  zoom={10}
                  height="500px"
                />
              ) : (
                <div className="glass-card rounded-2xl p-12 text-center text-slate-400">
                  <MapIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No map coordinates available for this destination.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'packing' && (
            <PackingChecklist tripId={trip.id} savedChecklist={trip.checklist} />
          )}

          {activeTab === 'weather' && (
            trip.lat ? (
              <WeatherWidget lat={trip.lat} lng={trip.lng} locationName={trip.destination} />
            ) : (
              <div className="glass-card rounded-2xl p-12 text-center text-slate-400">
                <Cloud className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No weather data available for this destination.</p>
              </div>
            )
          )}
        </motion.div>
      </div>
    </div>
  );
}
