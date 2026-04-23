import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, MapPin, X } from 'lucide-react';
import DestinationCard from '../components/DestinationCard';
import { DESTINATIONS, CATEGORIES, CONTINENTS } from '../data/destinations';

export default function Explore() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [continent, setContinent] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let results = [...DESTINATIONS];

    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (category !== 'All') {
      results = results.filter(d => d.category === category || d.tags.includes(category));
    }

    if (continent !== 'All') {
      results = results.filter(d => d.continent === continent);
    }

    results.sort((a, b) => {
      if (sortBy === 'rating')  return b.rating - a.rating;
      if (sortBy === 'cost_asc')  return a.avgCost - b.avgCost;
      if (sortBy === 'cost_desc') return b.avgCost - a.avgCost;
      if (sortBy === 'reviews')   return b.reviews - a.reviews;
      return 0;
    });

    return results;
  }, [search, category, continent, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setContinent('All');
    setSortBy('rating');
  };

  const hasFilters = search || category !== 'All' || continent !== 'All' || sortBy !== 'rating';

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="badge badge-ocean mb-4 inline-flex">
            <MapPin className="w-3 h-3" />
            {DESTINATIONS.length} Destinations
          </span>
          <h1 className="section-title mb-3">Explore the World</h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            Discover breathtaking destinations curated for every type of traveler.
          </p>
        </motion.div>

        {/* Search + Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-2xl p-4 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="destination-search"
                type="text"
                placeholder="Search destinations, countries, activities..."
                className="input-field pl-10"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort */}
            <select
              className="input-field sm:w-44"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="rating" className="bg-slate-800">Top Rated</option>
              <option value="reviews" className="bg-slate-800">Most Reviewed</option>
              <option value="cost_asc" className="bg-slate-800">Cheapest First</option>
              <option value="cost_desc" className="bg-slate-800">Priciest First</option>
            </select>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                showFilters || hasFilters
                  ? 'border-ocean-500/50 bg-ocean-500/10 text-ocean-300'
                  : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasFilters && <span className="w-2 h-2 bg-coral-500 rounded-full" />}
            </button>
          </div>

          {/* Expandable filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-white/10 space-y-4"
            >
              <div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-2">Category</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        category === cat
                          ? 'bg-ocean-600 text-white'
                          : 'glass text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-2">Continent</p>
                <div className="flex flex-wrap gap-2">
                  {CONTINENTS.map(cont => (
                    <button
                      key={cont}
                      onClick={() => setContinent(cont)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        continent === cont
                          ? 'bg-coral-600 text-white'
                          : 'glass text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {cont}
                    </button>
                  ))}
                </div>
              </div>

              {hasFilters && (
                <button onClick={clearFilters} className="text-slate-400 hover:text-coral-400 text-sm flex items-center gap-1.5 transition-colors">
                  <X className="w-3.5 h-3.5" />
                  Clear all filters
                </button>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-400 text-sm">
            {filtered.length === 0
              ? 'No destinations found'
              : `Showing ${filtered.length} destination${filtered.length !== 1 ? 's' : ''}`}
          </p>
          {hasFilters && (
            <button onClick={clearFilters} className="text-ocean-400 hover:text-ocean-300 text-sm transition-colors">
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-display font-bold text-white text-xl mb-2">No results found</h3>
            <p className="text-slate-400 text-sm mb-6">Try different search terms or clear your filters</p>
            <button onClick={clearFilters} className="btn-primary text-sm">Clear Filters</button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filtered.map((dest, i) => (
              <DestinationCard key={dest.id} destination={dest} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
