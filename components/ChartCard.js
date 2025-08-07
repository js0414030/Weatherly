import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ChartCard({ weather }) {
  if (!weather || !weather.list) return null;
  // Use 8 data points (24 hours, 3-hour interval)
  const dataPoints = weather.list.slice(0, 8);
  const labels = dataPoints.map(item =>
    new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  const temps = dataPoints.map(item => item.main.temp);
  const humidity = dataPoints.map(item => item.main.humidity);
  const wind = dataPoints.map(item => item.wind.speed);

  const lineData = {
    labels,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: temps,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };
  const barData = {
    labels,
    datasets: [
      {
        label: 'Humidity (%)',
        data: humidity,
        backgroundColor: '#818cf8',
      },
      {
        label: 'Wind Speed (m/s)',
        data: wind,
        backgroundColor: '#f472b6',
      },
    ],
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-lg p-8">
      <div>
        <h3 className="text-xl font-bold mb-3 text-indigo-700 dark:text-indigo-300">Temperature Trend (Next 24h)</h3>
        <Line data={lineData} options={{ responsive: true, plugins: { legend: { labels: { color: '#6366f1' } } } }} />
      </div>
      <div>
        <h3 className="text-xl font-bold mb-3 text-indigo-700 dark:text-indigo-300">Humidity & Wind (Next 24h)</h3>
        <Bar data={barData} options={{ responsive: true, plugins: { legend: { labels: { color: '#818cf8' } } } }} />
      </div>
    </div>
  );
}
