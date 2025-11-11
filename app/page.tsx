'use client';

import { useState, useEffect, useCallback } from 'react';
import ProjectPerformanceTable from '@/components/ProjectPerformanceTable';
import WeeklyBarChart from '@/components/WeeklyBarChart';
import CumulativeLineChart from '@/components/CumulativeLineChart';
import ImpactValues from '@/components/ImpactValues';
import LastWeekImpactTable from '@/components/LastWeekImpactTable';
import NomenclatureInfo from '@/components/NomenclatureInfo';
import { ProjectPerformance, WeeklyData, ImpactData } from '@/types/data';

export default function Dashboard() {
  const [projectPerformance, setProjectPerformance] = useState<ProjectPerformance[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [cumulativeData, setCumulativeData] = useState<WeeklyData[]>([]);
  const [impactValues, setImpactValues] = useState<{ thisWeek: number; lastWeek: number }>({
    thisWeek: 0,
    lastWeek: 0,
  });
  const [lastWeekImpact, setLastWeekImpact] = useState<ImpactData[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleProjectSelect = (project: string) => {
    // Toggle: if clicking the same project, deselect it
    if (selectedProject === project) {
      setSelectedProject(null);
    } else {
      setSelectedProject(project);
    }
  };

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel - if no project selected, fetch all data
      const projectParam = selectedProject ? `?project=${selectedProject}` : '';
      const [projectsRes, weeklyRes, cumulativeRes, impactValuesRes, lastWeekImpactRes] =
        await Promise.all([
          fetch('/api/projects'),
          fetch(`/api/weekly${projectParam}`),
          fetch(`/api/cumulative${projectParam}`),
          fetch('/api/impact?type=values'),
          fetch('/api/impact'),
        ]);

      if (!projectsRes.ok || !weeklyRes.ok || !cumulativeRes.ok || !impactValuesRes.ok || !lastWeekImpactRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [projects, weekly, cumulative, impact, lastWeek] = await Promise.all([
        projectsRes.json(),
        weeklyRes.json(),
        cumulativeRes.json(),
        impactValuesRes.json(),
        lastWeekImpactRes.json(),
      ]);

      setProjectPerformance(projects);
      setWeeklyData(weekly);
      setCumulativeData(cumulative);
      setImpactValues(impact);
      setLastWeekImpact(lastWeek);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Lade Daten...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Fehler beim Laden der Daten</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAllData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Automation Reporting Dashboard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 items-stretch">
          {/* Project Performance Table */}
          <div className="lg:col-span-1">
            <ProjectPerformanceTable
              data={projectPerformance}
              selectedProject={selectedProject}
              onProjectSelect={handleProjectSelect}
            />
          </div>

          {/* Weekly Bar Chart */}
          <div className="lg:col-span-1">
            <WeeklyBarChart 
              data={weeklyData} 
              project={selectedProject}
              allProjects={projectPerformance.map(p => p.project)}
            />
          </div>
        </div>

        {/* Cumulative Line Chart - Full Width */}
        <div className="mb-6">
          <CumulativeLineChart 
            data={cumulativeData} 
            project={selectedProject}
            allProjects={projectPerformance.map(p => p.project)}
          />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Nomenclature Info */}
          <div className="lg:col-span-1">
            <NomenclatureInfo />
          </div>

          {/* Impact Values */}
          <div className="lg:col-span-1">
            <ImpactValues thisWeek={impactValues.thisWeek} lastWeek={impactValues.lastWeek} />
          </div>

          {/* Last Week Impact Table */}
          <div className="lg:col-span-1">
            <LastWeekImpactTable 
              data={lastWeekImpact} 
              selectedProject={selectedProject}
              onProjectSelect={handleProjectSelect}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

