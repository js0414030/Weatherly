import { useState, useMemo } from 'react';
import { fetchWeather } from '@/lib/api';
import Navbar from '@/components/Navbar';
import ChartCard from '@/components/ChartCard';
import MultiCityChart from '@/components/MultiCityChart';

function WeatherSummaryCard({ city, current, forecast, selectedSlot }) {
  // Find the selected slot data
  const slot = selectedSlot !== undefined && forecast?.list ? forecast.list[selectedSlot] : null;
  const dt = slot ? new Date(slot.dt * 1000) : null;
  const rain = slot?.rain?.['3h'] ?? 0;
  const snow = slot?.snow?.['3h'] ?? 0;
  return (
    <div className="w-full max-w-3xl glass p-6 mb-6 flex flex-col md:flex-row gap-6 items-center shadow-xl">
      <div className="flex-1 flex flex-col gap-2">
        <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{city}</div>
        {dt && <div className="text-gray-500 dark:text-gray-300 mb-1">{dt.toLocaleDateString()} {dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>}
        <div className="flex items-center gap-4">
          <img src={`https://openweathermap.org/img/wn/${slot?.weather?.[0]?.icon || current?.weather?.[0]?.icon}@2x.png`} alt="icon" className="w-16 h-16" />
          <div>
            <div className="text-4xl font-extrabold text-gray-900 dark:text-white">{Math.round(slot?.main?.temp ?? current?.main?.temp)}°C</div>
            <div className="text-lg text-gray-700 dark:text-gray-200 capitalize">{slot?.weather?.[0]?.description || current?.weather?.[0]?.description}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-8 mt-2 text-gray-700 dark:text-gray-200 text-base">
          <div>Feels like: <span className="font-semibold">{Math.round(slot?.main?.feels_like ?? current?.main?.feels_like)}°C</span></div>
          <div>Min/Max: <span className="font-semibold">{Math.round(slot?.main?.temp_min ?? current?.main?.temp_min)}°C/{Math.round(slot?.main?.temp_max ?? current?.main?.temp_max)}°C</span></div>
          <div>Humidity: <span className="font-semibold">{slot?.main?.humidity ?? current?.main?.humidity}%</span></div>
          <div>Pressure: <span className="font-semibold">{slot?.main?.pressure ?? current?.main?.pressure} hPa</span></div>
          <div>Wind: <span className="font-semibold">{slot?.wind?.speed ?? current?.wind?.speed} m/s</span></div>
          <div>Clouds: <span className="font-semibold">{slot?.clouds?.all ?? current?.clouds?.all}%</span></div>
          <div>Visibility: <span className="font-semibold">{(slot?.visibility ?? current?.visibility)/1000} km</span></div>
          <div>Rain: <span className="font-semibold">{rain} mm</span></div>
          <div>Snow: <span className="font-semibold">{snow} mm</span></div>
        </div>
        {current?.sys && (
          <div className="flex gap-8 mt-2 text-gray-500 text-sm">
            <div>Sunrise: {new Date(current.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div>Sunset: {new Date(current.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Analytics() {
  const [cities, setCities] = useState(['Delhi', 'London']);
  const [weatherData, setWeatherData] = useState([]);
  const [cityInput, setCityInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Date/time selection
  const [selectedCityIdx, setSelectedCityIdx] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0); // 0 = today
  const [selectedSlot, setSelectedSlot] = useState(0); // 0 = first slot of day

  // For export
  const exportCSV = () => {
    if (weatherData.length < 1) return;
    let csv = 'City,Time,Temperature,Humidity,Wind\n';
    weatherData.forEach(({ city, data }) => {
      if (data.list) {
        data.list.slice(0, 8).forEach(item => {
          const time = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          csv += `${city},${time},${item.main.temp},${item.main.humidity},${item.wind.speed}\n`;
        });
      }
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'weather-analytics.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAddCity = async (e) => {
    e.preventDefault();
    if (!cityInput) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(cityInput);
      setWeatherData(prev => [...prev, { city: cityInput, data }]);
      setCities(prev => [...prev, cityInput]);
      setCityInput('');
    } catch (err) {
      setError('City not found or API error');
    }
    setLoading(false);
  };

  // Helper to get days from forecast
  const days = useMemo(() => {
    if (!weatherData[selectedCityIdx]?.data?.list) return [];
    const list = weatherData[selectedCityIdx].data.list;
    const byDay = {};
    list.forEach(item => {
      const day = new Date(item.dt * 1000).toLocaleDateString();
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push(item);
    });
    return Object.entries(byDay);
  }, [weatherData, selectedCityIdx]);

  // Slots for selected day
  const slots = days[selectedDay]?.[1] || [];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-white to-sky-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-indigo-700 dark:text-indigo-300">Weather Analytics Dashboard</h1>
        <form onSubmit={handleAddCity} className="w-full max-w-xl flex gap-2 mb-6 animate-fade-in-up">
          <input
            type="text"
            placeholder="Add city for comparison..."
            value={cityInput}
            onChange={e => setCityInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-l-xl border-none shadow-lg text-lg focus:outline-none bg-white/80 dark:bg-gray-800/80 dark:text-white animate-scale-in"
          />
          <button type="submit" className="px-6 py-3 rounded-r-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold shadow-lg transition hover:scale-pop hover:shadow-pop">Add</button>
        </form>
        {loading && <div className="text-xl animate-pulse">Loading...</div>}
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {/* Dynamic cover/empty state */}
        {weatherData.length === 0 && !loading && !error && (
          <div className="flex flex-col items-center justify-center gap-6 animate-fade-in-up pt-10">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <div className="absolute w-44 h-44 bg-gradient-to-tr from-indigo-300 via-sky-200 to-pink-200 dark:from-indigo-900 dark:via-indigo-700 dark:to-pink-900 rounded-full blur-2xl opacity-60 animate-pulse-slow" />
              <svg className="relative z-10" width="120" height="120" viewBox="0 0 120 120" fill="none">
                <ellipse cx="60" cy="80" rx="38" ry="16" fill="#a5b4fc" opacity="0.5"/>
                <circle cx="60" cy="54" r="28" fill="#fbbf24" className="animate-bounce-slow"/>
                <ellipse cx="88" cy="68" rx="14" ry="6" fill="#f9fafb"/>
                <ellipse cx="40" cy="70" rx="16" ry="7" fill="#f9fafb"/>
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-700 dark:text-indigo-200 text-center">Weather Analytics</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-xl">Add cities above to unlock interactive weather analytics, comparisons, and charts. Experience the full power of Weatherly!</p>
            <span className="text-indigo-400 dark:text-indigo-300 animate-bounce-slow mt-2">↑ Start by adding a city ↑</span>
          </div>
        )}
        {/* City selector */}
        {weatherData.length > 0 && (
          <div className="w-full max-w-4xl flex flex-wrap gap-2 mb-6 animate-fade-in">
            {weatherData.map(({ city }, idx) => (
              <div key={city+idx} className="relative flex items-center group">
                <button
                  className={`px-4 py-2 rounded-lg font-semibold shadow transition-all ${selectedCityIdx===idx ? 'bg-indigo-600 text-white' : 'bg-white/80 dark:bg-gray-800/80 text-indigo-700 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-indigo-700/40'} hover:scale-pop hover:shadow-pop`}
                  onClick={() => { setSelectedCityIdx(idx); setSelectedDay(0); setSelectedSlot(0); }}
                >{city}</button>
                <button
                  aria-label={`Remove ${city}`}
                  className="ml-1 text-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/60 rounded-full w-6 h-6 flex items-center justify-center transition-all opacity-80 hover:opacity-100 focus:outline-none absolute -right-2 -top-2 group-hover:visible"
                  style={{ zIndex: 2 }}
                  onClick={() => {
                    setWeatherData(prev => prev.filter((_, i) => i !== idx));
                    setCities(prev => prev.filter((_, i) => i !== idx));
                    if (selectedCityIdx === idx) {
                      setSelectedCityIdx(0);
                      setSelectedDay(0);
                      setSelectedSlot(0);
                    } else if (selectedCityIdx > idx) {
                      setSelectedCityIdx(selectedCityIdx - 1);
                    }
                  }}
                  tabIndex={0}
                >×</button>
              </div>
            ))}
          </div>
        )}
        {/* Day selector */}
        {days.length > 0 && (
          <div className="w-full max-w-4xl flex flex-wrap gap-2 mb-6">
            {days.map(([day], idx) => (
              <button
                key={day+idx}
                className={`px-3 py-1 rounded font-semibold shadow ${selectedDay===idx ? 'bg-indigo-500 text-white' : 'bg-white/80 dark:bg-gray-800/80 text-indigo-700 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-indigo-700/40'}`}
                onClick={() => { setSelectedDay(idx); setSelectedSlot(0); }}
              >{day}</button>
            ))}
          </div>
        )}
        {/* Time/slot selector */}
        {slots.length > 0 && (
          <div className="w-full max-w-4xl flex flex-wrap gap-2 mb-6">
            {slots.map((slot, idx) => (
              <button
                key={slot.dt+idx}
                className={`px-2 py-1 rounded shadow text-sm ${selectedSlot===idx ? 'bg-indigo-400 text-white' : 'bg-white/80 dark:bg-gray-800/80 text-indigo-700 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-indigo-700/40'}`}
                onClick={() => setSelectedSlot(idx)}
              >{new Date(slot.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</button>
            ))}
          </div>
        )}
        {/* Weather summary card for selection */}
        {weatherData[selectedCityIdx] && (
          <WeatherSummaryCard
            city={weatherData[selectedCityIdx].city}
            current={weatherData[selectedCityIdx].data}
            forecast={weatherData[selectedCityIdx].data}
            selectedSlot={slots.length > 0 ? selectedSlot : undefined}
          />
        )}
        {/* Chart for selected city/day */}
        {slots.length > 0 && (
          <ChartCard weather={{ list: slots }} />
        )}
        {/* Multi-city comparison (first slot of each city/day) */}
        {weatherData.length > 1 && days[selectedDay] && (
          <MultiCityChart dataSets={weatherData.map(({ city, data }) => ({
            city,
            list: (data.list || []).filter(item => {
              const day = new Date(item.dt * 1000).toLocaleDateString();
              return day === days[selectedDay][0];
            })
          }))} />
        )}
        {/* Export button */}
        <button onClick={exportCSV} className="mt-8 px-6 py-3 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 hover:from-indigo-600 hover:to-sky-500 text-white font-semibold shadow-lg transition-all">Export as CSV</button>
      </main>
    </div>
  );
}
