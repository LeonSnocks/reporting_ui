export interface ProjectPerformance {
  project: string;
  total_net_revenue: number;
  total_cost: number;
  roi: number;
  created_at?: string;
}

export interface WeeklyData {
  project: string;
  iso_year: number;
  iso_week: number;
  week_start: string;
  week_last_ts: string;
  cum_revenue: number;
  cum_cost: number;
  roi: number;
  weekly_revenue: number;
}

export interface ImpactData {
  project: string;
  weekly_revenue: number;
  week_start: string;
}

