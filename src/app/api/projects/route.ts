import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/storage/db';
import { Project } from '@/types/music';

export async function GET() {
  try {
    const projects = db.getProjects();
    return NextResponse.json({ projects, credits: db.getCredits() });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error)?.message || 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: body.title || 'Untitled Project',
      description: body.description || '',
      genre: body.genre || 'Cinematic',
      bpm: body.bpm || 120,
      keySignature: body.keySignature || 'A minor',
      timeSignature: body.timeSignature || '4/4',
      durationSeconds: body.durationSeconds || 135,
      isFavorite: false,
      tracks: body.tracks || [],
      pianoRollNotes: body.pianoRollNotes || [],
      audioUrl: body.audioUrl,
      waveformData: body.waveformData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = db.saveProject(newProject);
    return NextResponse.json({ success: true, project: saved });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error)?.message || 'Failed to create project' },
      { status: 500 }
    );
  }
}
