import { NextRequest, NextResponse } from 'next/server';
import { musicManager } from '@/lib/providers/manager';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const job = musicManager.getJob(id);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error)?.message || 'Failed to retrieve job status' },
      { status: 500 }
    );
  }
}
