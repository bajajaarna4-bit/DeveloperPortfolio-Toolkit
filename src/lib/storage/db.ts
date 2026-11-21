import { Project, GenerationJob, ArrangementTrack, MidiNote } from '@/types/music';

const INITIAL_TRACKS: ArrangementTrack[] = [
  {
    id: 'trk-drums',
    name: 'Drums',
    trackType: 'drums',
    color: '#F43F5E',
    volume: 0.85,
    pan: 0,
    muted: false,
    solo: false,
    clips: [
      { id: 'clip-d1', name: 'Kick & Snare Pattern', startBar: 1, lengthBars: 7, color: '#F43F5E' },
    ],
  },
  {
    id: 'trk-bass',
    name: 'Sub Bass',
    trackType: 'bass',
    color: '#8B5CF6',
    volume: 0.9,
    pan: 0,
    muted: false,
    solo: false,
    clips: [
      { id: 'clip-b1', name: 'Bassline Ostinato', startBar: 0, lengthBars: 8, color: '#8B5CF6' },
    ],
  },
  {
    id: 'trk-piano',
    name: 'Piano',
    trackType: 'piano',
    color: '#A78BFA',
    volume: 0.8,
    pan: -0.15,
    muted: false,
    solo: false,
    clips: [
      { id: 'clip-p1', name: 'Acoustic Piano Chords', startBar: 0, lengthBars: 8, color: '#A78BFA' },
    ],
  },
  {
    id: 'trk-melody',
    name: 'Melody',
    trackType: 'melody',
    color: '#38BDF8',
    volume: 0.75,
    pan: 0.2,
    muted: false,
    solo: false,
    clips: [
      { id: 'clip-m1', name: 'Lead Theme Hook', startBar: 1, lengthBars: 7, color: '#38BDF8' },
    ],
  },
  {
    id: 'trk-chords',
    name: 'Chords',
    trackType: 'chords',
    color: '#2DD4BF',
    volume: 0.7,
    pan: -0.2,
    muted: false,
    solo: false,
    clips: [
      { id: 'clip-c1', name: 'Pad Progression', startBar: 0, lengthBars: 8, color: '#2DD4BF' },
    ],
  },
  {
    id: 'trk-strings',
    name: 'Strings',
    trackType: 'strings',
    color: '#F59E0B',
    volume: 0.75,
    pan: 0,
    muted: false,
    solo: false,
    clips: [
      { id: 'clip-s1', name: 'Atmospheric String Swell', startBar: 2, lengthBars: 6, color: '#F59E0B' },
    ],
  },
  {
    id: 'trk-synths',
    name: 'Synths',
    trackType: 'synths',
    color: '#EC4899',
    volume: 0.65,
    pan: 0.3,
    muted: false,
    solo: false,
    clips: [
      { id: 'clip-sy1', name: 'Arp 16th Motion', startBar: 4, lengthBars: 4, color: '#EC4899' },
    ],
  },
  {
    id: 'trk-vocals',
    name: 'Vocals',
    trackType: 'vocals',
    color: '#E879F9',
    volume: 0.7,
    pan: 0,
    muted: false,
    solo: false,
    clips: [],
  },
  {
    id: 'trk-fx',
    name: 'FX & Risers',
    trackType: 'fx',
    color: '#94A3B8',
    volume: 0.6,
    pan: 0,
    muted: false,
    solo: false,
    clips: [
      { id: 'clip-fx1', name: 'Cinematic Sub Drop', startBar: 0, lengthBars: 2, color: '#94A3B8' },
      { id: 'clip-fx2', name: 'Tension Riser', startBar: 6, lengthBars: 2, color: '#94A3B8' },
    ],
  },
];

const INITIAL_PIANO_NOTES: MidiNote[] = [
  { id: 'n1', pitch: 'A3', midi: 57, time: 0, duration: 4, velocity: 85 },
  { id: 'n2', pitch: 'C4', midi: 60, time: 0, duration: 4, velocity: 80 },
  { id: 'n3', pitch: 'E4', midi: 64, time: 0, duration: 4, velocity: 85 },

  { id: 'n4', pitch: 'F3', midi: 53, time: 4, duration: 4, velocity: 85 },
  { id: 'n5', pitch: 'A3', midi: 57, time: 4, duration: 4, velocity: 80 },
  { id: 'n6', pitch: 'C4', midi: 60, time: 4, duration: 4, velocity: 85 },

  { id: 'n7', pitch: 'C3', midi: 48, time: 8, duration: 4, velocity: 90 },
  { id: 'n8', pitch: 'E3', midi: 52, time: 8, duration: 4, velocity: 85 },
  { id: 'n9', pitch: 'G3', midi: 55, time: 8, duration: 4, velocity: 85 },

  { id: 'n10', pitch: 'G3', midi: 55, time: 12, duration: 4, velocity: 90 },
  { id: 'n11', pitch: 'B3', midi: 59, time: 12, duration: 4, velocity: 85 },
  { id: 'n12', pitch: 'D4', midi: 62, time: 12, duration: 4, velocity: 85 },

  // Melody
  { id: 'm1', pitch: 'E5', midi: 76, time: 4, duration: 2, velocity: 105 },
  { id: 'm2', pitch: 'G5', midi: 79, time: 6, duration: 2, velocity: 100 },
  { id: 'm3', pitch: 'A5', midi: 81, time: 8, duration: 4, velocity: 110 },
  { id: 'm4', pitch: 'G5', midi: 79, time: 12, duration: 2, velocity: 95 },
  { id: 'm5', pitch: 'E5', midi: 76, time: 14, duration: 2, velocity: 90 },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Interstellar Horizons (Cinematic)',
    description: 'Dark cinematic orchestral theme with emotional felt piano and deep taiko hits',
    genre: 'Cinematic',
    bpm: 88,
    keySignature: 'A minor',
    timeSignature: '4/4',
    durationSeconds: 135,
    isFavorite: true,
    tracks: INITIAL_TRACKS,
    pianoRollNotes: INITIAL_PIANO_NOTES,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'proj-2',
    title: 'Midnight Rain Lofi',
    description: 'Chill nostalgic Rhodes piano with warm tape saturation and vinyl hiss',
    genre: 'Lo-fi',
    bpm: 78,
    keySignature: 'C Major',
    timeSignature: '4/4',
    durationSeconds: 160,
    isFavorite: false,
    tracks: INITIAL_TRACKS,
    pianoRollNotes: INITIAL_PIANO_NOTES,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'proj-3',
    title: 'Cyberpunk Awakening',
    description: 'Heavy sidechained synthwave with driving 808s and analog saw leads',
    genre: 'Electronic',
    bpm: 126,
    keySignature: 'F minor',
    timeSignature: '4/4',
    durationSeconds: 180,
    isFavorite: true,
    tracks: INITIAL_TRACKS,
    pianoRollNotes: INITIAL_PIANO_NOTES,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

// In-Memory store for Server & fallback
class InMemoryDatabase {
  private projects: Map<string, Project> = new Map();
  private generations: Map<string, GenerationJob> = new Map();
  private userCredits: number = 185;

  constructor() {
    INITIAL_PROJECTS.forEach((p) => this.projects.set(p.id, p));
  }

  public getProjects(): Project[] {
    return Array.from(this.projects.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  public getProject(id: string): Project | undefined {
    return this.projects.get(id);
  }

  public saveProject(project: Project): Project {
    const updated = {
      ...project,
      updatedAt: new Date().toISOString(),
    };
    this.projects.set(project.id, updated);
    return updated;
  }

  public deleteProject(id: string): boolean {
    return this.projects.delete(id);
  }

  public duplicateProject(id: string): Project | null {
    const orig = this.projects.get(id);
    if (!orig) return null;
    const dup: Project = {
      ...orig,
      id: `proj-${Date.now()}`,
      title: `${orig.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
    };
    this.projects.set(dup.id, dup);
    return dup;
  }

  public getGenerations(): GenerationJob[] {
    return Array.from(this.generations.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getGeneration(id: string): GenerationJob | undefined {
    return this.generations.get(id);
  }

  public saveGeneration(job: GenerationJob): GenerationJob {
    this.generations.set(job.id, job);
    return job;
  }

  public getCredits(): number {
    return this.userCredits;
  }

  public deductCredits(amount: number): number {
    this.userCredits = Math.max(0, this.userCredits - amount);
    return this.userCredits;
  }
}

// Global server-safe singleton
const globalForDb = globalThis as unknown as {
  sonoraDb?: InMemoryDatabase;
};

export const db = globalForDb.sonoraDb ?? new InMemoryDatabase();
if (process.env.NODE_ENV !== 'production') globalForDb.sonoraDb = db;
