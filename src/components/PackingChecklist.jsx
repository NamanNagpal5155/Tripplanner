import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, CheckSquare, Square, Plus, Trash2 } from 'lucide-react';
import { PACKING_CATEGORIES } from '../data/destinations';
import { useTrips } from '../context/TripContext';
import toast from 'react-hot-toast';

export default function PackingChecklist({ tripId, savedChecklist }) {
  const { updateChecklist } = useTrips();
  const [checklist, setChecklist] = useState(() => {
    if (savedChecklist) return savedChecklist;
    // Build default checklist from PACKING_CATEGORIES
    const items = [];
    Object.entries(PACKING_CATEGORIES).forEach(([catId, cat]) => {
      cat.items.forEach(item => {
        items.push({ id: `${catId}-${item}`, label: item, category: catId, checked: false, custom: false });
      });
    });
    return items;
  });

  const [newItem, setNewItem] = useState('');
  const [activeCategory, setActiveCategory] = useState('essentials');

  const toggleItem = (id) => {
    const updated = checklist.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setChecklist(updated);
    updateChecklist(tripId, updated);
  };

  const addCustomItem = () => {
    if (!newItem.trim()) return;
    const item = {
      id: `custom-${Date.now()}`,
      label: newItem.trim(),
      category: activeCategory,
      checked: false,
      custom: true,
    };
    const updated = [...checklist, item];
    setChecklist(updated);
    updateChecklist(tripId, updated);
    setNewItem('');
    toast.success('Item added to packing list');
  };

  const removeItem = (id) => {
    const updated = checklist.filter(item => item.id !== id);
    setChecklist(updated);
    updateChecklist(tripId, updated);
  };

  const packed = checklist.filter(i => i.checked).length;
  const total = checklist.length;
  const progress = total > 0 ? (packed / total) * 100 : 0;

  const categoryItems = checklist.filter(i => i.category === activeCategory);

  return (
    <div className="glass-card rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-white flex items-center gap-2">
          <Package className="w-5 h-5 text-ocean-400" />
          Packing List
        </h3>
        <span className="text-slate-400 text-sm">{packed}/{total} packed</span>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-ocean-500 to-emerald-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        {progress === 100 && (
          <p className="text-emerald-400 text-xs font-medium">🎉 All packed! Ready to go!</p>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {Object.entries(PACKING_CATEGORIES).map(([catId, cat]) => {
          const catItems = checklist.filter(i => i.category === catId);
          const catPacked = catItems.filter(i => i.checked).length;
          return (
            <button
              key={catId}
              onClick={() => setActiveCategory(catId)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === catId
                  ? 'bg-ocean-600/30 text-ocean-300 border border-ocean-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
              <span className={`text-xs ${catPacked === catItems.length ? 'text-emerald-400' : 'text-slate-500'}`}>
                {catPacked}/{catItems.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Items */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {categoryItems.map(item => (
          <motion.div
            key={item.id}
            layout
            className="flex items-center gap-3 group"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className={`shrink-0 w-5 h-5 rounded transition-colors ${
                item.checked ? 'text-ocean-400' : 'text-slate-600 hover:text-slate-400'
              }`}
            >
              {item.checked
                ? <CheckSquare className="w-5 h-5 fill-ocean-600 text-ocean-400" />
                : <Square className="w-5 h-5" />
              }
            </button>
            <span className={`flex-1 text-sm transition-colors ${
              item.checked ? 'line-through text-slate-600' : 'text-slate-300'
            }`}>
              {item.label}
            </span>
            {item.custom && (
              <button
                onClick={() => removeItem(item.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-600 hover:text-coral-400 rounded transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Add custom item */}
      <div className="flex gap-2 pt-3 border-t border-white/8">
        <input
          className="input-field flex-1 text-sm py-2"
          placeholder="Add custom item..."
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addCustomItem()}
        />
        <button onClick={addCustomItem} className="btn-primary text-sm py-2 px-3">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
