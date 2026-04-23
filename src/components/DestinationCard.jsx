import { motion } from 'framer-motion';
import { Star, MapPin, Clock, DollarSign, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DestinationCard({ destination, index = 0 }) {
  const { name, country, category, description, image, rating, reviews, avgCost, bestTime, tags } = destination;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-2xl glass-card cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="badge badge-ocean text-xs">
            {category}
          </span>
        </div>

        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 glass rounded-full px-2.5 py-1">
          <Star className="w-3 h-3 text-sand-400 fill-sand-400" />
          <span className="text-white text-xs font-semibold">{rating}</span>
        </div>

        {/* Location name on image */}
        <div className="absolute bottom-3 left-3">
          <h3 className="font-display font-bold text-white text-xl leading-tight">{name}</h3>
          <div className="flex items-center gap-1 text-slate-300 text-xs mt-0.5">
            <MapPin className="w-3 h-3" />
            <span>{country}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-3">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.slice(0, 3).map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-white/8">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-400" />
              ~${avgCost.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-ocean-400" />
              {bestTime}
            </span>
          </div>

          <Link
            to="/plan"
            state={{ destination }}
            className="flex items-center gap-1 text-ocean-400 hover:text-ocean-300 text-xs font-semibold transition-colors group/btn"
          >
            Plan Trip
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
