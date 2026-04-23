import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, GripVertical, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { ACTIVITY_TYPES } from '../data/destinations';

function ActivityItem({ activity, onRemove, dayIndex, actIndex }) {
  const typeInfo = ACTIVITY_TYPES.find(t => t.id === activity.type) || ACTIVITY_TYPES[0];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="flex items-start gap-3 glass rounded-xl p-3 group"
    >
      <span className="text-xl shrink-0 mt-0.5">{typeInfo.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-white text-sm font-medium">{activity.name}</div>
        {activity.time && (
          <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
            <Clock className="w-3 h-3" />
            {activity.time}
          </div>
        )}
        {activity.notes && (
          <div className="text-slate-500 text-xs mt-1 line-clamp-1">{activity.notes}</div>
        )}
      </div>
      <button
        onClick={() => onRemove(dayIndex, actIndex)}
        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-coral-400 rounded transition-all"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

function DaySection({ day, dayData, onAddActivity, onRemoveActivity }) {
  const [open, setOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'sightseeing', time: '', notes: '' });

  const handleAdd = () => {
    if (!form.name.trim()) return;
    onAddActivity(day, { ...form, id: Date.now() });
    setForm({ name: '', type: 'sightseeing', time: '', notes: '' });
    setShowForm(false);
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Day header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-ocean-600 to-ocean-800 rounded-lg flex items-center justify-center text-white text-sm font-bold">
            {day}
          </div>
          <div className="text-left">
            <div className="text-white font-semibold text-sm">Day {day}</div>
            <div className="text-slate-400 text-xs">{dayData.activities.length} activit{dayData.activities.length !== 1 ? 'ies' : 'y'}</div>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-2">
              <AnimatePresence>
                {dayData.activities.map((act, i) => (
                  <ActivityItem
                    key={act.id || i}
                    activity={act}
                    dayIndex={day}
                    actIndex={i}
                    onRemove={onRemoveActivity}
                  />
                ))}
              </AnimatePresence>

              {dayData.activities.length === 0 && !showForm && (
                <div className="text-center py-4 text-slate-500 text-sm">
                  No activities yet. Add one below!
                </div>
              )}

              {/* Add form */}
              <AnimatePresence>
                {showForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="glass rounded-xl p-4 space-y-3 border border-ocean-500/20"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        className="input-field col-span-2"
                        placeholder="Activity name (e.g. Eiffel Tower visit)"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        autoFocus
                      />
                      <select
                        className="input-field"
                        value={form.type}
                        onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                      >
                        {ACTIVITY_TYPES.map(t => (
                          <option key={t.id} value={t.id} className="bg-slate-800">
                            {t.icon} {t.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="time"
                        className="input-field"
                        value={form.time}
                        onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                      />
                      <input
                        className="input-field col-span-2"
                        placeholder="Notes (optional)"
                        value={form.notes}
                        onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleAdd} className="btn-primary text-sm py-2 flex-1">
                        Add Activity
                      </button>
                      <button onClick={() => setShowForm(false)} className="btn-outline text-sm py-2">
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full flex items-center justify-center gap-2 border border-dashed border-white/20 hover:border-ocean-500/40 hover:bg-ocean-500/5 text-slate-400 hover:text-ocean-400 rounded-xl py-2.5 text-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Activity
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ItineraryBuilder({ tripId, itinerary = [], days = 3, onAddActivity, onRemoveActivity }) {
  const dayNumbers = Array.from({ length: days }, (_, i) => i + 1);

  const getDayData = (day) => {
    const found = itinerary.find(d => d.day === day);
    return found || { day, activities: [] };
  };

  return (
    <div className="space-y-3">
      {dayNumbers.map(day => (
        <DaySection
          key={day}
          day={day}
          dayData={getDayData(day)}
          onAddActivity={onAddActivity}
          onRemoveActivity={onRemoveActivity}
        />
      ))}
    </div>
  );
}
