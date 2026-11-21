import { NextRequest, NextResponse } from 'next/server';
import { musicManager } from '@/lib/providers/manager';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId, durationSeconds = 30 } = body;

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const extendedJob = await musicManager.extendJob(jobId, durationSeconds);
    return NextResponse.json({ success: true, job: extendedJob });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error)?.message || 'Extension failed' },
      { status: 500 }
    );
  }
}
