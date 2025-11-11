import { NextResponse } from 'next/server';
import { getProjectPerformance } from '@/lib/bigquery';

export async function GET() {
  try {
    const data = await getProjectPerformance();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching project performance:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch project performance' },
      { status: 500 }
    );
  }
}

