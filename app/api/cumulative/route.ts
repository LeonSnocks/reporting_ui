import { NextResponse } from 'next/server';
import { getCumulativeData } from '@/lib/bigquery';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const project = searchParams.get('project') || undefined;
    
    const data = await getCumulativeData(project);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching cumulative data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch cumulative data' },
      { status: 500 }
    );
  }
}

