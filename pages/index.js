import { useState } from 'react';
import { fetchWeather } from '@/lib/api';
import WeatherCard from '@/components/WeatherCard';
import Navbar from '@/components/Navbar';
import ChartCard from '@/components/ChartCard';

export default function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(city);
      setWeather(data);
    } catch (err) {
      setError('City not found or API error');
      setWeather(null);
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-sky-200 via-white to-indigo-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-indigo-300 dark:bg-indigo-900 rounded-full filter blur-3xl opacity-30 animate-pulse-slow z-0" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-pink-200 dark:bg-pink-900 rounded-full filter blur-2xl opacity-20 animate-pulse-slow z-0" />
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 z-10 relative">
        <form onSubmit={handleSearch} className="w-full max-w-xl flex gap-2 mb-8">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={e => setCity(e.target.value)}
            className="flex-1 px-4 py-3 rounded-l-xl border-none shadow-lg text-lg focus:outline-none bg-white/80 dark:bg-gray-800/80 dark:text-white backdrop-blur-md transition-all duration-200"
            required
          />
          <button type="submit" className="px-6 py-3 rounded-r-xl bg-gradient-to-tr from-indigo-500 to-sky-400 hover:from-indigo-600 hover:to-sky-500 text-white font-semibold shadow-lg transition-all duration-200 scale-100 hover:scale-105">Search</button>
        </form>
        {loading && (
          <div className="flex flex-col items-center gap-2 animate-pulse">
            <span className="inline-block w-16 h-16 rounded-full bg-indigo-400/40 dark:bg-indigo-800/40 animate-spin border-4 border-indigo-400 border-t-transparent" />
            <span className="text-xl text-indigo-700 dark:text-indigo-300">Loading...</span>
          </div>
        )}
        {error && <div className="text-red-500 mb-4 font-semibold bg-white/80 dark:bg-gray-800/80 rounded-xl px-4 py-2 shadow">{error}</div>}
        {!weather && !loading && !error && (
          <div className="flex flex-col items-center justify-center gap-6 animate-fade-in-up pt-10">
            {/* Animated weather illustration */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <div className="absolute w-44 h-44 bg-gradient-to-tr from-indigo-300 via-sky-200 to-pink-200 dark:from-indigo-900 dark:via-indigo-700 dark:to-pink-900 rounded-full blur-2xl opacity-60 animate-pulse-slow" />
              <svg className="relative z-10" width="120" height="120" viewBox="0 0 120 120" fill="none">
                <ellipse cx="60" cy="80" rx="38" ry="16" fill="#a5b4fc" opacity="0.5"/>
                <circle cx="60" cy="54" r="28" fill="#fbbf24" className="animate-bounce-slow"/>
                <ellipse cx="88" cy="68" rx="14" ry="6" fill="#f9fafb"/>
                <ellipse cx="40" cy="70" rx="16" ry="7" fill="#f9fafb"/>
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-700 dark:text-indigo-200 text-center">Welcome to Weatherly</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-xl">Get real-time weather, interactive analytics, and beautiful charts. Search for any city to get started!</p>
            <span className="text-indigo-400 dark:text-indigo-300 animate-bounce-slow mt-2">↑ Try searching for your city above ↑</span>
          </div>
        )}
        {weather && (
          <div className="w-full max-w-2xl flex flex-col gap-8 items-center">
            <WeatherCard weather={weather} animate={true} />
            <ChartCard weather={weather} />
          </div>
        )}
      </main>
    </div>
  );
}
