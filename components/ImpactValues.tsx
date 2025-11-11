'use client';

import { formatNumber } from '@/lib/utils';

interface ImpactValuesProps {
  thisWeek: number;
  lastWeek: number;
}

export default function ImpactValues({ thisWeek, lastWeek }: ImpactValuesProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Impact Werte</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Impact diese Woche in €</p>
          <p className="text-2xl font-bold text-gray-900">{formatNumber(thisWeek)} €</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Impact letzte Woche in €</p>
          <p className="text-2xl font-bold text-gray-900">{formatNumber(lastWeek)} €</p>
        </div>
      </div>
    </div>
  );
}

