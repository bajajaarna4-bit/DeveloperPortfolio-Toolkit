import { NextRequest, NextResponse } from 'next/server';
import { musicManager } from '@/lib/providers/manager';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, specification, mode, lyrics, referenceAudioUrl } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const job = await musicManager.createJob({
      prompt,
      specification,
      mode,
      lyrics,
      referenceAudioUrl,
    });

    return NextResponse.json({
      success: true,
      job,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error)?.message || 'Generation failed' },
      { status: 500 }
    );
  }
}
