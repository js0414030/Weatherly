// Utility to fetch weather data from backend API
export async function fetchWeather(city) {
  const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
  if (!res.ok) throw new Error('Failed to fetch weather');
  return res.json();
}
