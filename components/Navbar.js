import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [dark, setDark] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 bg-white/70 dark:bg-gray-900/80 shadow-md backdrop-blur-md">
      <div className="flex items-center gap-4">
        <Link href="/" legacyBehavior>
          <a className="flex items-center gap-2 text-2xl font-bold text-indigo-600 dark:text-indigo-300 outline-none transition">
            <span role="img" aria-label="weather">🌤️</span> Weatherly
          </a>
        </Link>
        <Link href="/analytics" legacyBehavior>
          <a className={`ml-4 px-4 py-2 rounded-lg font-semibold transition shadow ${router.pathname==='/analytics' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 dark:bg-gray-800/80 text-indigo-700 dark:text-indigo-200 hover:bg-indigo-200 dark:hover:bg-indigo-700/40'}`}>Analytics</a>
        </Link>
      </div>
      <button
        onClick={() => setDark(d => !d)}
        className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition shadow"
        aria-label="Toggle dark mode"
      >
        {dark ? 'Light Mode' : 'Dark Mode'}
      </button>
    </nav>
  );
}
