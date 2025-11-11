import { BigQuery } from '@google-cloud/bigquery';

/**
 * BigQuery Client mit Application Default Credentials (ADC)
 * 
 * Dieser Client verwendet automatisch Application Default Credentials in folgender Reihenfolge:
 * 1. GOOGLE_APPLICATION_CREDENTIALS Umgebungsvariable (falls gesetzt)
 * 2. Application Default Credentials (ADC) - für lokale Entwicklung mit Impersonation
 * 3. Google Cloud Metadaten-Server - für Production (Cloud Run, GCE, etc.)
 * 
 * Setup für lokale Entwicklung:
 * 1. Service Account Impersonation einrichten (siehe README)
 * 2. gcloud auth application-default login --impersonate-service-account=SERVICE_ACCOUNT_EMAIL
 * 
 * Keine JSON-Key-Dateien benötigt! 🎉
 */
const bigquery = new BigQuery({
  projectId: 'snocks-analytics',
  // Keine credentials explizit angegeben - verwendet automatisch ADC
});

const DATASET = 'marts_automation_euw3';
const TABLE_PROJECTS = 'automation_eval';
const TABLE_WEEKLY = 'automation_eval_kw';

export async function getProjectPerformance(): Promise<any[]> {
  const query = `
    SELECT 
      project,
      total_net_revenue,
      total_cost,
      roi,
      created_at
    FROM \`${bigquery.projectId}.${DATASET}.${TABLE_PROJECTS}\`
    ORDER BY total_net_revenue DESC
  `;

  const [rows] = await bigquery.query(query);

  return rows.map((row: any) => ({
    project: row.project,
    total_net_revenue: parseFloat(row.total_net_revenue) || 0,
    total_cost: parseFloat(row.total_cost) || 0,
    roi: parseFloat(row.roi) || 0,
    created_at: row.created_at,
  }));
}

export async function getWeeklyData(project?: string): Promise<any[]> {
  // Use parameterized query to prevent SQL injection
  const query = project
    ? {
        query: `
          SELECT 
            project,
            iso_year,
            iso_week,
            week_start,
            week_last_ts,
            cum_revenue,
            cum_cost,
            roi,
            weekly_revenue
          FROM \`${bigquery.projectId}.${DATASET}.${TABLE_WEEKLY}\`
          WHERE project = @project
          ORDER BY iso_year DESC, iso_week DESC
        `,
        params: {
          project: project,
        },
      }
    : {
        query: `
          SELECT 
            project,
            iso_year,
            iso_week,
            week_start,
            week_last_ts,
            cum_revenue,
            cum_cost,
            roi,
            weekly_revenue
          FROM \`${bigquery.projectId}.${DATASET}.${TABLE_WEEKLY}\`
          ORDER BY iso_year DESC, iso_week DESC
        `,
      };

  const [rows] = await bigquery.query(query);

  return rows.map((row: any) => ({
    project: row.project,
    iso_year: parseInt(row.iso_year) || 0,
    iso_week: parseInt(row.iso_week) || 0,
    week_start: row.week_start,
    week_last_ts: row.week_last_ts,
    cum_revenue: parseFloat(row.cum_revenue) || 0,
    cum_cost: parseFloat(row.cum_cost) || 0,
    roi: parseFloat(row.roi) || 0,
    weekly_revenue: parseFloat(row.weekly_revenue) || 0,
  }));
}

export async function getCumulativeData(project?: string): Promise<any[]> {
  // Use parameterized query to prevent SQL injection
  const query = project
    ? {
        query: `
          SELECT 
            project,
            iso_year,
            iso_week,
            week_start,
            week_last_ts,
            cum_revenue,
            cum_cost,
            roi,
            weekly_revenue
          FROM \`${bigquery.projectId}.${DATASET}.${TABLE_WEEKLY}\`
          WHERE project = @project
          ORDER BY week_start ASC
        `,
        params: {
          project: project,
        },
      }
    : {
        query: `
          SELECT 
            project,
            iso_year,
            iso_week,
            week_start,
            week_last_ts,
            cum_revenue,
            cum_cost,
            roi,
            weekly_revenue
          FROM \`${bigquery.projectId}.${DATASET}.${TABLE_WEEKLY}\`
          ORDER BY week_start ASC
        `,
      };

  const [rows] = await bigquery.query(query);

  return rows.map((row: any) => ({
    project: row.project,
    iso_year: parseInt(row.iso_year) || 0,
    iso_week: parseInt(row.iso_week) || 0,
    week_start: row.week_start,
    week_last_ts: row.week_last_ts,
    cum_revenue: parseFloat(row.cum_revenue) || 0,
    cum_cost: parseFloat(row.cum_cost) || 0,
    roi: parseFloat(row.roi) || 0,
    weekly_revenue: parseFloat(row.weekly_revenue) || 0,
  }));
}

export async function getLastWeekImpact(): Promise<any[]> {
  const query = `
    WITH latest_week AS (
      SELECT 
        MAX(iso_year) as max_year,
        MAX(iso_week) as max_week
      FROM \`${bigquery.projectId}.${DATASET}.${TABLE_WEEKLY}\`
    )
    SELECT 
      w.project,
      w.weekly_revenue,
      w.week_start
    FROM \`${bigquery.projectId}.${DATASET}.${TABLE_WEEKLY}\` w
    CROSS JOIN latest_week lw
    WHERE w.iso_year = lw.max_year 
      AND w.iso_week = lw.max_week
    ORDER BY w.weekly_revenue DESC
  `;

  const [rows] = await bigquery.query(query);

  return rows.map((row: any) => ({
    project: row.project,
    weekly_revenue: parseFloat(row.weekly_revenue) || 0,
    week_start: row.week_start,
  }));
}

export async function getImpactValues(): Promise<{ thisWeek: number; lastWeek: number }> {
  const query = `
    WITH weekly_data AS (
      SELECT 
        iso_year,
        iso_week,
        SUM(weekly_revenue) as total_revenue,
        ROW_NUMBER() OVER (ORDER BY iso_year DESC, iso_week DESC) as row_num
      FROM \`${bigquery.projectId}.${DATASET}.${TABLE_WEEKLY}\`
      GROUP BY iso_year, iso_week
    )
    SELECT 
      MAX(CASE WHEN row_num = 1 THEN total_revenue END) as this_week,
      MAX(CASE WHEN row_num = 2 THEN total_revenue END) as last_week
    FROM weekly_data
    WHERE row_num <= 2
  `;

  const [rows] = await bigquery.query(query);

  if (rows.length > 0 && rows[0]) {
    return {
      thisWeek: parseFloat(rows[0].this_week) || 0,
      lastWeek: parseFloat(rows[0].last_week) || 0,
    };
  }

  return { thisWeek: 0, lastWeek: 0 };
}

