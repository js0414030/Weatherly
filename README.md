# Weather Analytics Web App

A modern, interactive weather analytics application with real-time data, beautiful charts, and a unique, responsive design.

## Features
- Search for any city and view real-time weather data
- Interactive charts for temperature, humidity, wind, and more
- Responsive, modern UI with dark/light mode
- Save favorite cities and analytics (future enhancement)
- No authentication required for v1

## Stack
- Next.js (React framework)
- Tailwind CSS (styling)
- Chart.js (analytics/charts)
- MongoDB (future, for favorites/history)
- OpenWeatherMap API (weather data)

## Getting Started
1. Install dependencies: `npm install`
2. Create a `.env.local` file with the following variables:
   - `OPENWEATHER_API_KEY=your_api_key_here`
   - `MONGODB_URI=your_mongodb_uri_here`
3. Run the app: `npm run dev`

## Folder Structure
```
/weather-application
├── /app or /pages             → Route folders (Next.js)
├── /components                → UI Components (Navbar, Search, Cards)
├── /lib                       → Utility functions (API fetch, formatter)
├── /api (or /pages/api)       → API Routes (Next.js)
├── /styles                    → Tailwind CSS config & global styles
├── .env.local                 → API keys, DB URIs
├── next.config.js             → Config
└── package.json               → Dependencies
```

## Environment Variables Needed
- `OPENWEATHER_API_KEY` — Get from https://openweathermap.org/api
- `MONGODB_URI` — Get from MongoDB Atlas (optional for v1)

---

For a truly unique and modern design, the UI will feature custom charts, smooth transitions, and a layout unlike typical weather apps. If you have any design inspirations, let me know!
