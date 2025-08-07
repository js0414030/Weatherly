import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: 'City is required' });

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key missing' });

  // Fetch both current and forecast
  try {
    // 1. Current weather
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    const currentRes = await fetch(currentUrl);
    if (!currentRes.ok) throw new Error('Current weather fetch failed');
    const current = await currentRes.json();
    // 2. Forecast (next 40x3h = 5 days)
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    const forecastRes = await fetch(forecastUrl);
    if (!forecastRes.ok) throw new Error('Forecast fetch failed');
    const forecast = await forecastRes.json();
    // Merge current into forecast for easier frontend use
    const result = { ...current, list: forecast.list };
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
