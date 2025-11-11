'use client';

import { WeeklyData } from '@/types/data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface WeeklyBarChartProps {
  data: WeeklyData[];
  project?: string;
}

export default function WeeklyBarChart({ data, project }: WeeklyBarChartProps) {
  // Format data for chart - reverse to show chronological order
  const chartData = data
    .slice()
    .reverse()
    .map((item) => ({
      week: `${item.iso_year}-KW${String(item.iso_week).padStart(2, '0')}`,
      revenue: item.weekly_revenue,
    }));

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {project ? `${project} Performance` : 'Wöchentliche Performance'}
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
        {project ? `${project} Performance` : 'Wöchentliche Performance'}
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="week"
            angle={-45}
            textAnchor="end"
            height={80}
            interval={interval}
            tick={{ fontSize: 11 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(2)} €`, 'Revenue']}
            contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
          />
          <Legend />
          <Bar dataKey="revenue" fill="#ec4899" name="Revenue" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

