import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function MultiCityChart({ dataSets }) {
  if (!Array.isArray(dataSets) || dataSets.length < 2) return null;
  // Assume each dataSet: { city, list: [{ dt, main: { temp } }] }
  const labels = dataSets[0].list.slice(0, 8).map(item =>
    new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  const datasets = dataSets.map((ds, idx) => ({
    label: ds.city,
    data: ds.list.slice(0, 8).map(item => item.main.temp),
    borderColor: `hsl(${(idx * 80) % 360}, 70%, 60%)`,
    backgroundColor: `hsla(${(idx * 80) % 360}, 70%, 60%, 0.2)`,
    tension: 0.4,
    fill: false,
  }));
  const chartData = {
    labels,
    datasets,
  };
  return (
    <div className="w-full max-w-2xl mx-auto bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-xl p-8">
      <h3 className="text-xl font-bold mb-3 text-indigo-700 dark:text-indigo-300">Temperature Comparison (Next 24h)</h3>
      <Line data={chartData} options={{ responsive: true, plugins: { legend: { labels: { color: '#6366f1' } } } }} />
    </div>
  );
}
