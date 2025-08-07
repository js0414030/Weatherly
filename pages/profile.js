import Navbar from '@/components/Navbar';
import { useState } from 'react';

export default function Profile() {
  // Placeholder for future MongoDB integration
  const [savedCities, setSavedCities] = useState(['Delhi', 'London']);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-white to-sky-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-indigo-700 dark:text-indigo-300">Your Saved Cities</h1>
        <div className="w-full max-w-2xl flex flex-col gap-4 items-center">
          {savedCities.map(city => (
            <div key={city} className="w-full bg-white/80 dark:bg-gray-800/80 rounded-xl shadow p-4 flex justify-between items-center">
              <span className="text-lg font-semibold text-indigo-700 dark:text-indigo-200">{city}</span>
              <button className="px-3 py-1 rounded bg-pink-500 hover:bg-pink-600 text-white font-semibold transition">Remove</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
