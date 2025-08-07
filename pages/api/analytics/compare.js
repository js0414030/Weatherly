import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { cities } = req.body;
  if (!Array.isArray(cities) || cities.length < 2) return res.status(400).json({ error: 'At least two cities required' });
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key missing' });

  try {
    const results = await Promise.all(
      cities.map(async city => {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`Failed for ${city}`);
        const data = await resp.json();
        return { city, list: data.list };
      })
    );
    res.status(200).json({ results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
