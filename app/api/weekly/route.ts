import { NextResponse } from 'next/server';
import { getWeeklyData } from '@/lib/bigquery';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const project = searchParams.get('project') || undefined;
    
    const data = await getWeeklyData(project);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching weekly data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch weekly data' },
      { status: 500 }
    );
  }
}

