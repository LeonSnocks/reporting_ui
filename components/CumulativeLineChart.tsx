'use client';

import { useState } from 'react';
import { WeeklyData } from '@/types/data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatDate } from '@/lib/utils';
import { getProjectColor, AGGREGATED_COLOR } from '@/lib/colors';

interface CumulativeLineChartProps {
  data: WeeklyData[];
  project?: string | null;
  allProjects?: string[];
}

export default function CumulativeLineChart({ data, project, allProjects = [] }: CumulativeLineChartProps) {
  const [viewMode, setViewMode] = useState<'aggregated' | 'individual'>('aggregated');

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

  let chartData: any[] = [];
  let projectNames: string[] = [];
  let interval = 0;

  // Use provided allProjects list for consistent color assignment, or extract from data as fallback
  const projectList = allProjects.length > 0 ? allProjects : Array.from(new Set(data.map(item => item.project))).sort();

  if (!project && data.length > 0) {
    // No project selected - either show aggregated or individual projects
    const uniqueProjects = projectList;
    projectNames = uniqueProjects;

    if (viewMode === 'aggregated') {
      // Aggregated view: sum all projects
      const weekMap = new Map<string, { week_start: string; revenue: number }>();
      
      data.forEach((item) => {
        const weekKey = item.week_start;
        if (!weekMap.has(weekKey)) {
          weekMap.set(weekKey, { week_start: item.week_start, revenue: 0 });
        }
        const entry = weekMap.get(weekKey)!;
        entry.revenue += item.weekly_revenue;
      });
      
      const sortedWeeks = Array.from(weekMap.values())
        .sort((a, b) => new Date(a.week_start).getTime() - new Date(b.week_start).getTime());
      
      let cumulativeSum = 0;
      chartData = sortedWeeks.map((item) => {
        cumulativeSum += item.revenue;
        return {
          date: formatDate(item.week_start),
          total: cumulativeSum,
        };
      });
    } else {
      // Individual view: show each project separately
      const weekMap = new Map<string, any>();
      
      data.forEach((item) => {
        const weekKey = item.week_start;
        if (!weekMap.has(weekKey)) {
          weekMap.set(weekKey, { 
            date: formatDate(item.week_start),
            week_start: item.week_start,
          });
        }
      });

      // Calculate cumulative revenue per project
      uniqueProjects.forEach((proj) => {
        const projectData = data
          .filter(item => item.project === proj)
          .sort((a, b) => new Date(a.week_start).getTime() - new Date(b.week_start).getTime());
        
        let cumSum = 0;
        projectData.forEach((item) => {
          cumSum += item.weekly_revenue;
          const entry = weekMap.get(item.week_start);
          if (entry) {
            entry[proj] = cumSum;
          }
        });
      });

      chartData = Array.from(weekMap.values())
        .sort((a, b) => new Date(a.week_start).getTime() - new Date(b.week_start).getTime());
    }
    
    interval = chartData.length > 20 ? Math.floor(chartData.length / 12) : 0;
  } else {
    // Single project selected
    projectNames = [project || ''];
    chartData = data
      .sort((a, b) => new Date(a.week_start).getTime() - new Date(b.week_start).getTime())
      .map((item) => ({
        date: formatDate(item.week_start),
        [project || 'revenue']: item.cum_revenue,
      }));
    
    interval = chartData.length > 20 ? Math.floor(chartData.length / 12) : 0;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {project ? `Kumulative ${project} Performance` : 'Kumulative Performance'}
        </h2>
        {!project && (
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as 'aggregated' | 'individual')}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="aggregated">Alle Projekte (kumuliert)</option>
            <option value="individual">Alle Projekte (einzeln)</option>
          </select>
        )}
      </div>
      <ResponsiveContainer width="100%" height={450}>
        <LineChart 
          data={chartData} 
          margin={{ top: 30, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={80}
            interval={interval}
            tick={{ fontSize: 11, fill: '#374151' }}
            tickLine={{ stroke: '#374151', strokeWidth: 1 }}
            axisLine={{ stroke: '#374151', strokeWidth: 1 }}
            label={{ value: 'Datum', position: 'insideBottom', offset: -10, style: { fontSize: 12, fill: '#6b7280' } }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#374151' }}
            tickLine={{ stroke: '#374151', strokeWidth: 1 }}
            axisLine={{ stroke: '#374151', strokeWidth: 1 }}
            label={{ value: 'Kumulativer Impact', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6b7280' } }}
          />
          <Tooltip
            formatter={(value: number, name: string) => [`${value.toFixed(2)} €`, name === 'total' ? 'Alle Projekte' : name]}
            contentStyle={{ 
              backgroundColor: '#f9fafb', 
              border: '1px solid #e5e7eb',
              borderRadius: '4px'
            }}
          />
          <Legend 
            verticalAlign="top" 
            height={36}
            wrapperStyle={{ paddingBottom: '10px' }}
          />
          
          {/* Render lines based on view mode */}
          {!project && viewMode === 'aggregated' ? (
            // Aggregated view: black line
            <Line
              type="monotone"
              dataKey="total"
              stroke={AGGREGATED_COLOR}
              strokeWidth={2}
              name="Alle Projekte"
              dot={false}
            />
          ) : !project && viewMode === 'individual' ? (
            // Individual view: colored lines for each project
            projectNames.map((proj) => (
              <Line
                key={proj}
                type="monotone"
                dataKey={proj}
                stroke={getProjectColor(proj, projectList)}
                strokeWidth={2}
                name={proj}
                dot={false}
                connectNulls
              />
            ))
          ) : (
            // Single project selected: colored line
            <Line
              type="monotone"
              dataKey={project || 'revenue'}
              stroke={getProjectColor(project || '', projectList)}
              strokeWidth={2}
              name={project || 'Revenue'}
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
