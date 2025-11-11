'use client';

import { WeeklyData } from '@/types/data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatDate } from '@/lib/utils';

interface CumulativeLineChartProps {
  data: WeeklyData[];
  project?: string;
}

export default function CumulativeLineChart({ data, project }: CumulativeLineChartProps) {
  // Format data for chart
  const chartData = data.map((item) => ({
    date: formatDate(item.week_start),
    revenue: item.cum_revenue,
  }));

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {project ? `Kumulative ${project} Performance` : 'Kumulative Performance'}
        </h2>
        <p className="text-gray-500 text-center py-8">Keine Daten verfügbar</p>
      </div>
    );
  }

  // Calculate interval for x-axis labels based on data length
  const interval = chartData.length > 20 ? Math.floor(chartData.length / 15) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {project ? `Kumulative ${project} Performance` : 'Kumulative Performance'}
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={80}
            interval={interval}
            tick={{ fontSize: 11 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(2)} €`, 'Kumulative Revenue']}
            contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#ec4899"
            strokeWidth={2}
            name="Kumulative Revenue"
            dot={{ fill: '#ec4899', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

