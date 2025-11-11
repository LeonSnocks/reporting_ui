'use client';

import { WeeklyData } from '@/types/data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getProjectColor, AGGREGATED_COLOR } from '@/lib/colors';

interface WeeklyBarChartProps {
  data: WeeklyData[];
  project?: string | null;
  allProjects?: string[];
}

export default function WeeklyBarChart({ data, project, allProjects = [] }: WeeklyBarChartProps) {
  // Use provided allProjects list for consistent color assignment, or extract from data as fallback
  const projectList = allProjects.length > 0 ? allProjects : Array.from(new Set(data.map(item => item.project))).sort();
  // If no project selected, aggregate data by week (sum all projects)
  let chartData;
  if (!project && data.length > 0) {
    // Aggregate by week - sum weekly_revenue for all projects
    const aggregated = data.reduce((acc, item) => {
      const weekKey = `${item.iso_year}-${item.iso_week}`;
      if (!acc[weekKey]) {
        acc[weekKey] = {
          iso_year: item.iso_year,
          iso_week: item.iso_week,
          revenue: 0,
        };
      }
      acc[weekKey].revenue += item.weekly_revenue;
      return acc;
    }, {} as Record<string, any>);
    
    chartData = Object.values(aggregated)
      .sort((a: any, b: any) => {
        // Sort ascending (oldest first) for correct timeline
        if (a.iso_year !== b.iso_year) return a.iso_year - b.iso_year;
        return a.iso_week - b.iso_week;
      })
      .map((item: any) => ({
        week: `${item.iso_year}-KW${String(item.iso_week).padStart(2, '0')}`,
        revenue: item.revenue,
      }));
  } else {
    // Single project - reverse to show chronological order
    chartData = data
      .slice()
      .reverse()
      .map((item) => ({
        week: `${item.iso_year}-KW${String(item.iso_week).padStart(2, '0')}`,
        revenue: item.weekly_revenue,
      }));
  }

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

  // Determine bar color based on selection
  const barColor = project 
    ? getProjectColor(project, projectList) 
    : AGGREGATED_COLOR;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {project ? `${project} Performance` : 'Wöchentliche Performance'}
      </h2>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 30, right: 30, left: 20, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="week"
            angle={-45}
            textAnchor="end"
            height={80}
            interval={interval}
            tick={{ fontSize: 11 }}
            label={{ value: 'Kalenderwoche', position: 'insideBottom', offset: -10, style: { fontSize: 12, fill: '#6b7280' } }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            label={{ value: 'Impact', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6b7280' } }}
          />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(2)} €`, 'Revenue']}
            contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
          />
          <Legend 
            verticalAlign="top" 
            height={36}
            wrapperStyle={{ paddingBottom: '10px' }}
          />
          <Bar dataKey="revenue" fill={barColor} name={project || "Alle Projekte"} />
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}

