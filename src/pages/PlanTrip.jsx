import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import {
  MapPin, Calendar, Users, Tag, ChevronRight, ChevronLeft,
  Check, Plane, Wallet, Globe
} from 'lucide-react';
import { DESTINATIONS } from '../data/destinations';
import { useTrips } from '../context/TripContext';
import toast from 'react-hot-toast';
import WeatherWidget from '../components/WeatherWidget';

const STEPS = ['Destination', 'Dates & Travelers', 'Budget & Style', 'Review'];

const TRIP_STYLES = [
  { id: 'adventure', label: 'Adventure', emoji: '🏄' },
  { id: 'relaxation', label: 'Relaxation', emoji: '🧘' },
  { id: 'culture', label: 'Cultural', emoji: '🏛️' },
  { id: 'romantic', label: 'Romantic', emoji: '💑' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧' },
  { id: 'backpacking', label: 'Backpacking', emoji: '🎒' },
  { id: 'luxury', label: 'Luxury', emoji: '💎' },
  { id: 'foodie', label: 'Foodie', emoji: '🍜' },
];

const BUDGETS = [
  { id: 'budget', label: 'Budget', desc: 'Under $1,000', emoji: '💰' },
  { id: 'moderate', label: 'Moderate', desc: '$1,000 – $3,000', emoji: '💳' },
  { id: 'luxury', label: 'Luxury', desc: '$3,000+', emoji: '💎' },
];

export default function PlanTrip() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addTrip, trips, updateTrip } = useTrips();

  const editId = searchParams.get('edit');
  const editTrip = editId ? trips.find(t => t.id === editId) : null;

  const preselected = location.state?.destination || null;

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    destination: editTrip?.destination || preselected?.name || '',
    destinationObj: editTrip ? DESTINATIONS.find(d => d.name === editTrip.destination) : preselected,
    startDate: editTrip?.startDate ? new Date(editTrip.startDate) : null,
    endDate: editTrip?.endDate ? new Date(editTrip.endDate) : null,
    travelers: editTrip?.travelers || 2,
    budget: editTrip?.budget || 'moderate',
    style: editTrip?.style || [],
    tripName: editTrip?.name || '',
  });

  const [destSearch, setDestSearch] = useState(form.destination);
  const [destResults, setDestResults] = useState([]);
  const [showDestResults, setShowDestResults] = useState(false);

  useEffect(() => {
    if (destSearch.trim().length < 1) {
      setDestResults([]);
      return;
    }
    const q = destSearch.toLowerCase();
    setDestResults(
      DESTINATIONS.filter(d =>
        d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q)
      ).slice(0, 5)
    );
    setShowDestResults(true);
  }, [destSearch]);

  const selectDestination = (dest) => {
    setForm(f => ({ ...f, destination: dest.name, destinationObj: dest }));
    setDestSearch(dest.name);
    setShowDestResults(false);
  };

  const toggleStyle = (id) => {
    setForm(f => ({
      ...f,
      style: f.style.includes(id) ? f.style.filter(s => s !== id) : [...f.style, id],
    }));
  };

  const duration = form.startDate && form.endDate
    ? Math.ceil((form.endDate - form.startDate) / (1000 * 60 * 60 * 24))
    : null;

  const canProceed = () => {
    if (step === 0) return form.destination.trim().length > 0;
    if (step === 1) return form.startDate && form.endDate && form.travelers >= 1;
    if (step === 2) return form.budget;
    return true;
  };

  const handleSubmit = () => {
    const tripData = {
      name: form.tripName || `Trip to ${form.destination}`,
      destination: form.destination,
      startDate: form.startDate?.toISOString(),
      endDate: form.endDate?.toISOString(),
      travelers: form.travelers,
      budget: form.budget,
      style: form.style,
      image: form.destinationObj?.image || '',
      lat: form.destinationObj?.lat,
      lng: form.destinationObj?.lng,
      country: form.destinationObj?.country,
      status: 'upcoming',
      itinerary: editTrip?.itinerary || [],
      checklist: editTrip?.checklist || null,
    };

    if (editTrip) {
      updateTrip({ ...editTrip, ...tripData });
      toast.success('Trip updated!');
      navigate(`/trips/${editTrip.id}`);
    } else {
      addTrip(tripData);
      toast.success('🎉 Trip created! Start building your itinerary.');
      navigate('/trips');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="section-title mb-2">
            {editTrip ? 'Edit Trip' : 'Plan Your Trip'}
          </h1>
          <p className="section-subtitle">
            {editTrip ? 'Update your trip details below.' : 'Fill in the details and start your adventure.'}
          </p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  i < step ? 'bg-emerald-600 text-white' :
                  i === step ? 'bg-ocean-600 text-white ring-4 ring-ocean-500/30' :
                  'glass text-slate-500'
                }`}>
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs mt-1.5 font-medium hidden sm:block ${
                  i === step ? 'text-ocean-400' : i < step ? 'text-emerald-400' : 'text-slate-600'
                }`}>
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 transition-all duration-500 ${i < step ? 'bg-emerald-600' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="glass-card rounded-2xl p-6 md:p-8"
          >
            {/* STEP 0: Destination */}
            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-bold text-white text-2xl mb-1">Where are you headed?</h2>
                  <p className="text-slate-400 text-sm">Search from our 12+ curated destinations</p>
                </div>

                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="destination-input"
                    className="input-field pl-10"
                    placeholder="Search destination (e.g. Bali, Tokyo, Paris...)"
                    value={destSearch}
                    onChange={e => { setDestSearch(e.target.value); setForm(f => ({ ...f, destination: e.target.value, destinationObj: null })); }}
                    onFocus={() => destSearch && setShowDestResults(true)}
                  />
                  <AnimatePresence>
                    {showDestResults && destResults.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute top-full left-0 right-0 z-50 mt-2 glass-dark rounded-xl overflow-hidden border border-white/10 shadow-2xl"
                      >
                        {destResults.map(dest => (
                          <button
                            key={dest.id}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                            onClick={() => selectDestination(dest)}
                          >
                            <img src={dest.image} className="w-10 h-10 rounded-lg object-cover shrink-0" alt="" />
                            <div>
                              <div className="text-white text-sm font-semibold">{dest.name}</div>
                              <div className="text-slate-400 text-xs flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {dest.country}
                              </div>
                            </div>
                            <span className="ml-auto badge badge-ocean text-xs">{dest.category}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Selected destination preview */}
                {form.destinationObj && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative overflow-hidden rounded-2xl h-40"
                  >
                    <img src={form.destinationObj.image} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className="font-display font-bold text-white text-xl">{form.destinationObj.name}</div>
                      <div className="text-slate-300 text-sm flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-ocean-400" />
                        {form.destinationObj.country}
                        <span className="ml-2 text-slate-400">·</span>
                        <span className="text-slate-300 ml-1">{form.destinationObj.temperature}</span>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="badge badge-ocean">{form.destinationObj.rating} ★</span>
                    </div>
                  </motion.div>
                )}

                {/* Trip name */}
                <div>
                  <label className="text-slate-300 text-sm font-medium mb-1.5 block">Trip Name (optional)</label>
                  <input
                    className="input-field"
                    placeholder={form.destination ? `My trip to ${form.destination}` : 'Give your trip a name...'}
                    value={form.tripName}
                    onChange={e => setForm(f => ({ ...f, tripName: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {/* STEP 1: Dates & Travelers */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-bold text-white text-2xl mb-1">When are you going?</h2>
                  <p className="text-slate-400 text-sm">Pick your travel dates and group size</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 text-sm font-medium mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-ocean-400" /> Start Date
                    </label>
                    <DatePicker
                      selected={form.startDate}
                      onChange={d => setForm(f => ({ ...f, startDate: d, endDate: f.endDate && d > f.endDate ? null : f.endDate }))}
                      minDate={new Date()}
                      placeholderText="Select start date"
                      className="input-field w-full"
                      wrapperClassName="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm font-medium mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-coral-400" /> End Date
                    </label>
                    <DatePicker
                      selected={form.endDate}
                      onChange={d => setForm(f => ({ ...f, endDate: d }))}
                      minDate={form.startDate || new Date()}
                      placeholderText="Select end date"
                      className="input-field w-full"
                      wrapperClassName="w-full"
                    />
                  </div>
                </div>

                {duration && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center gap-3 glass rounded-xl p-3"
                  >
                    <Calendar className="w-5 h-5 text-ocean-400" />
                    <span className="text-white font-semibold">{duration} day{duration !== 1 ? 's' : ''}</span>
                    <span className="text-slate-400 text-sm">trip</span>
                  </motion.div>
                )}

                <div>
                  <label className="text-slate-300 text-sm font-medium mb-3 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-sand-400" /> Number of Travelers
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setForm(f => ({ ...f, travelers: Math.max(1, f.travelers - 1) }))}
                      className="w-10 h-10 glass rounded-xl text-white hover:bg-white/10 text-xl font-bold transition-all"
                    >
                      −
                    </button>
                    <span className="font-display font-bold text-white text-3xl w-12 text-center">
                      {form.travelers}
                    </span>
                    <button
                      onClick={() => setForm(f => ({ ...f, travelers: f.travelers + 1 }))}
                      className="w-10 h-10 glass rounded-xl text-white hover:bg-white/10 text-xl font-bold transition-all"
                    >
                      +
                    </button>
                    <span className="text-slate-400 text-sm ml-2">
                      {form.travelers === 1 ? 'Solo traveler' : `${form.travelers} people`}
                    </span>
                  </div>
                </div>

                {/* Weather preview */}
                {form.destinationObj?.lat && (
                  <WeatherWidget
                    lat={form.destinationObj.lat}
                    lng={form.destinationObj.lng}
                    locationName={form.destinationObj.name}
                  />
                )}
              </div>
            )}

            {/* STEP 2: Budget & Style */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-bold text-white text-2xl mb-1">Budget & Travel Style</h2>
                  <p className="text-slate-400 text-sm">Help us tailor your experience</p>
                </div>

                <div>
                  <label className="text-slate-300 text-sm font-medium mb-3 flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-emerald-400" /> Budget Range
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {BUDGETS.map(b => (
                      <button
                        key={b.id}
                        onClick={() => setForm(f => ({ ...f, budget: b.id }))}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          form.budget === b.id
                            ? 'border-ocean-500 bg-ocean-500/10 text-white'
                            : 'border-white/10 glass text-slate-400 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <div className="text-2xl mb-1">{b.emoji}</div>
                        <div className="font-semibold text-sm">{b.label}</div>
                        <div className="text-xs opacity-70 mt-0.5">{b.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 text-sm font-medium mb-3 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-coral-400" /> Travel Style (pick all that apply)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {TRIP_STYLES.map(s => (
                      <button
                        key={s.id}
                        onClick={() => toggleStyle(s.id)}
                        className={`p-3 rounded-xl border text-center text-sm transition-all ${
                          form.style.includes(s.id)
                            ? 'border-coral-500 bg-coral-500/10 text-coral-300'
                            : 'border-white/10 glass text-slate-400 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <div className="text-xl mb-0.5">{s.emoji}</div>
                        <div className="text-xs font-medium">{s.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Review */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-bold text-white text-2xl mb-1">Review Your Trip</h2>
                  <p className="text-slate-400 text-sm">Looks great! Confirm the details below.</p>
                </div>

                {form.destinationObj && (
                  <div className="relative overflow-hidden rounded-2xl h-36">
                    <img src={form.destinationObj.image} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <div className="font-display font-bold text-white text-lg">{form.tripName || `Trip to ${form.destination}`}</div>
                      <div className="text-slate-300 text-sm">{form.destinationObj.country}</div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: MapPin, label: 'Destination', value: form.destination, color: 'ocean' },
                    { icon: Users,  label: 'Travelers',   value: `${form.travelers} person${form.travelers !== 1 ? 's' : ''}`, color: 'sand' },
                    { icon: Calendar, label: 'Departure', value: form.startDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || '—', color: 'coral' },
                    { icon: Calendar, label: 'Return',    value: form.endDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || '—', color: 'coral' },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="glass rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-3.5 h-3.5 text-${color}-400`} />
                        <span className="text-slate-400 text-xs font-medium">{label}</span>
                      </div>
                      <div className="text-white text-sm font-semibold">{value}</div>
                    </div>
                  ))}
                </div>

                <div className="glass rounded-xl p-4 space-y-2">
                  <div className="text-slate-400 text-xs font-medium">Budget & Style</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="badge badge-ocean capitalize">
                      {BUDGETS.find(b => b.id === form.budget)?.emoji} {form.budget}
                    </span>
                    {form.style.map(s => {
                      const st = TRIP_STYLES.find(t => t.id === s);
                      return st && <span key={s} className="badge badge-coral">{st.emoji} {st.label}</span>;
                    })}
                  </div>
                </div>

                {duration && (
                  <div className="text-center glass rounded-xl p-3 text-slate-300 text-sm">
                    🗓️ <strong className="text-white">{duration}-day</strong> trip — build your itinerary after saving!
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="flex items-center gap-2 btn-outline disabled:opacity-30 disabled:cursor-not-allowed text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 btn-primary disabled:opacity-40 disabled:cursor-not-allowed text-sm"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 btn-coral text-sm"
            >
              <Plane className="w-4 h-4" />
              {editTrip ? 'Update Trip' : 'Create Trip!'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
