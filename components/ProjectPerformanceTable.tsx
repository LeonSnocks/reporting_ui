'use client';

import { ProjectPerformance } from '@/types/data';
import { formatNumber } from '@/lib/utils';

interface ProjectPerformanceTableProps {
  data: ProjectPerformance[];
  selectedProject?: string;
  onProjectSelect?: (project: string) => void;
}

export default function ProjectPerformanceTable({
  data,
  selectedProject,
  onProjectSelect,
}: ProjectPerformanceTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Projekt Performance</h2>
        <p className="text-gray-500 text-center py-8">Keine Daten verfügbar</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Projekt Performance</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Projekt
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Net Revenue
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kosten
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                ROI
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((project, index) => (
              <tr
                key={project.project}
                className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedProject === project.project ? 'bg-blue-50' : ''
                }`}
                onClick={() => onProjectSelect?.(project.project)}
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {project.project}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                  {formatNumber(project.total_net_revenue)} €
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                  {formatNumber(project.total_cost)} €
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                  <span
                    className={`font-medium ${
                      project.roi >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {project.roi.toFixed(2)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

