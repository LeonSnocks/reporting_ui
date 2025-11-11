'use client';

import { ImpactData } from '@/types/data';
import { formatNumber } from '@/lib/utils';

interface LastWeekImpactTableProps {
  data: ImpactData[];
  selectedProject?: string | null;
  onProjectSelect?: (project: string) => void;
}

export default function LastWeekImpactTable({ data, selectedProject, onProjectSelect }: LastWeekImpactTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Projektimpact letzte Woche</h2>
        <p className="text-gray-500 text-center py-8">Keine Daten verfügbar</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Projektimpact letzte Woche</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Projekt
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Projektimpact letzte Woche
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr 
                key={item.project} 
                className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                  selectedProject === item.project ? 'bg-blue-50' : ''
                }`}
                onClick={() => onProjectSelect?.(item.project)}
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.project}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                  {formatNumber(item.weekly_revenue)} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

