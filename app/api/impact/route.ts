import { NextResponse } from 'next/server';
import { getLastWeekImpact, getImpactValues } from '@/lib/bigquery';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    if (type === 'values') {
      const data = await getImpactValues();
      return NextResponse.json(data);
    } else {
      const data = await getLastWeekImpact();
      return NextResponse.json(data);
    }
  } catch (error: any) {
    console.error('Error fetching impact data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch impact data' },
      { status: 500 }
    );
  }
}

