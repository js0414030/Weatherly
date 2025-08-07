import { useEffect, useRef } from 'react';

export default function WeatherCard({ weather, animate }) {
  if (!weather || !weather.main) return null;
  const { name, sys, main, weather: w, wind } = weather;
  const icon = w[0]?.icon;
  const tempRef = useRef();

  useEffect(() => {
    if (animate && tempRef.current) {
      tempRef.current.animate([
        { transform: 'scale(1) rotate(-3deg)' },
        { transform: 'scale(1.08) rotate(2deg)' },
        { transform: 'scale(1) rotate(0deg)' }
      ], {
        duration: 1200,
        iterations: 1,
        easing: 'ease-in-out'
      });
    }
  }, [main.temp, animate]);

  return (
    <div className="w-full bg-white/50 dark:bg-gray-800/60 rounded-3xl shadow-2xl p-8 flex flex-col md:flex-row items-center gap-8 backdrop-blur-xl border border-white/30 dark:border-gray-700/40 transition-all duration-300 hover:scale-[1.01] hover:shadow-3xl group cursor-pointer">
      <div className="flex flex-col items-center md:items-start gap-2 flex-1">
        <div className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 drop-shadow">{name}, {sys?.country}</div>
        <div className="flex items-center gap-6">
          <div className={animate ? "w-28 h-28 flex items-center justify-center animate-bounce-slow" : "w-28 h-28 flex items-center justify-center"}>
            <img
              src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
              alt="weather icon"
              className="w-24 h-24 drop-shadow-md transition-transform duration-500"
              style={animate ? { filter: 'drop-shadow(0 0 16px #818cf8)' } : {}}
            />
          </div>
          <div>
            <div ref={tempRef} className="text-6xl font-extrabold text-gray-900 dark:text-white drop-shadow-lg transition-all duration-500">
              {Math.round(main.temp)}°C
            </div>
            <div className="text-lg text-gray-700 dark:text-gray-200 font-medium capitalize tracking-wide mt-1">
              {w[0]?.main}, {w[0]?.description}
            </div>
          </div>
        </div>
        <div className="flex gap-8 mt-4 text-gray-600 dark:text-gray-300 text-base font-semibold">
          <div className="flex flex-col items-center">
            <span className="mb-1">💧</span>
            <span>Humidity</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-300">{main.humidity}%</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="mb-1">💨</span>
            <span>Wind</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-300">{wind.speed} m/s</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="mb-1">🌡️</span>
            <span>Pressure</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-300">{main.pressure} hPa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
