import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, Eye } from 'lucide-react';

const WMO_CODES = {
  0: { label: 'Clear Sky', icon: Sun, color: 'text-sand-400' },
  1: { label: 'Mainly Clear', icon: Sun, color: 'text-sand-400' },
  2: { label: 'Partly Cloudy', icon: Cloud, color: 'text-slate-400' },
  3: { label: 'Overcast', icon: Cloud, color: 'text-slate-500' },
  45: { label: 'Foggy', icon: Eye, color: 'text-slate-400' },
  51: { label: 'Light Drizzle', icon: CloudRain, color: 'text-ocean-400' },
  61: { label: 'Light Rain', icon: CloudRain, color: 'text-ocean-400' },
  63: { label: 'Moderate Rain', icon: CloudRain, color: 'text-ocean-500' },
  80: { label: 'Rain Showers', icon: CloudRain, color: 'text-ocean-400' },
};

function getWeatherInfo(code) {
  if (WMO_CODES[code]) return WMO_CODES[code];
  if (code >= 50 && code < 70) return { label: 'Rainy', icon: CloudRain, color: 'text-ocean-400' };
  return { label: 'Cloudy', icon: Cloud, color: 'text-slate-400' };
}

export default function WeatherWidget({ lat, lng, locationName }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lat || !lng) return;
    setLoading(true);
    setError(null);

    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
      `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
      `&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max` +
      `&timezone=auto&forecast_days=5`
    )
      .then(r => r.json())
      .then(data => {
        setWeather(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load weather data');
        setLoading(false);
      });
  }, [lat, lng]);

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-pulse">
        <div className="h-4 bg-white/10 rounded w-32 mb-4" />
        <div className="h-16 bg-white/10 rounded mb-3" />
        <div className="grid grid-cols-5 gap-2">
          {[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-white/10 rounded" />)}
        </div>
      </div>
    );
  }

  if (error || !weather?.current) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center text-slate-400 text-sm">
        <Cloud className="w-8 h-8 mx-auto mb-2 opacity-40" />
        Weather unavailable
      </div>
    );
  }

  const { current, daily } = weather;
  const currentInfo = getWeatherInfo(current.weather_code);
  const CurrentIcon = currentInfo.icon;

  return (
    <div className="glass-card rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-white text-sm">
          🌤️ Weather in {locationName}
        </h3>
        <span className="text-slate-500 text-xs">Live</span>
      </div>

      {/* Current weather */}
      <div className="flex items-center gap-4">
        <div className={`${currentInfo.color}`}>
          <CurrentIcon className="w-12 h-12" />
        </div>
        <div>
          <div className="font-display font-bold text-white text-4xl">
            {Math.round(current.temperature_2m)}°C
          </div>
          <div className="text-slate-400 text-sm">{currentInfo.label}</div>
        </div>
        <div className="ml-auto space-y-1.5 text-right">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs justify-end">
            <Wind className="w-3 h-3 text-ocean-400" />
            {Math.round(current.wind_speed_10m)} km/h
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-xs justify-end">
            <Droplets className="w-3 h-3 text-ocean-300" />
            {current.relative_humidity_2m}%
          </div>
        </div>
      </div>

      {/* 5-day forecast */}
      <div className="grid grid-cols-5 gap-2 pt-3 border-t border-white/8">
        {daily?.time?.slice(0, 5).map((date, i) => {
          const info = getWeatherInfo(daily.weather_code[i]);
          const Icon = info.icon;
          const day = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
          return (
            <div key={date} className="flex flex-col items-center gap-1.5 glass rounded-xl p-2">
              <span className="text-slate-400 text-xs font-medium">{i === 0 ? 'Today' : day}</span>
              <Icon className={`w-5 h-5 ${info.color}`} />
              <div className="text-center">
                <div className="text-white text-xs font-semibold">{Math.round(daily.temperature_2m_max[i])}°</div>
                <div className="text-slate-500 text-xs">{Math.round(daily.temperature_2m_min[i])}°</div>
              </div>
              {daily.precipitation_probability_max?.[i] > 20 && (
                <div className="flex items-center gap-0.5 text-ocean-400 text-xs">
                  <Droplets className="w-2.5 h-2.5" />
                  {daily.precipitation_probability_max[i]}%
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
