import { NextRequest, NextResponse } from 'next/server';
import { musicManager } from '@/lib/providers/manager';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId, intensity = 0.5 } = body;

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const variationJob = await musicManager.variationJob(jobId, intensity);
    return NextResponse.json({ success: true, job: variationJob });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error)?.message || 'Variation creation failed' },
      { status: 500 }
    );
  }
}
