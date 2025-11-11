// Shared color palette for projects across all charts
export const PROJECT_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#84cc16', // lime
  '#10b981', // emerald
  '#14b8a6', // teal
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#a855f7', // purple
  '#ec4899', // pink
];

// Color for aggregated/total values
export const AGGREGATED_COLOR = '#000000'; // black

// Assign a consistent color to a project
export function getProjectColor(projectName: string, allProjects: string[]): string {
  const index = allProjects.indexOf(projectName);
  return index !== -1 ? PROJECT_COLORS[index % PROJECT_COLORS.length] : PROJECT_COLORS[0];
}

