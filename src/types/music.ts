export type GenerationMode =
  | 'text_to_music'
  | 'instrumental'
  | 'song_with_vocals'
  | 'lyrics_to_song'
  | 'melody_to_music'
  | 'extension'
  | 'variation'
  | 'section_regen';

export type JobStatus =
  | 'queued'
  | 'analyzing'
  | 'synthesizing'
  | 'rendering'
  | 'completed'
  | 'failed';

export interface SongSection {
  name: string; // 'Intro' | 'Verse 1' | 'Chorus' | 'Bridge' | 'Climax' | 'Outro'
  bars: number;
  description: string;
  intensity: number; // 1 to 10
}

export interface MusicSpecification {
  genre: string;
  subgenre: string;
  mood: string[];
  bpm: number;
  key: string;
  time_signature: string;
  instruments: string[];
  chord_progression: string[];
  melodic_style: string;
  rhythm_style: string;
  song_structure: SongSection[];
  dynamics: string[];
  production_effects: string[];
  vocal_style: string;
  duration: string;
  generation_instructions: string;
}

export interface MidiNote {
  id: string;
  pitch: string; // e.g. "C4", "A#3"
  midi: number;  // 0-127
  time: number;  // in beats / 16th notes
  duration: number; // in beats
  velocity: number; // 0-127
}

export interface TrackClip {
  id: string;
  name: string;
  startBar: number;
  lengthBars: number;
  color: string;
  audioUrl?: string;
  notes?: MidiNote[];
}

export type TrackType =
  | 'drums'
  | 'bass'
  | 'piano'
  | 'melody'
  | 'chords'
  | 'strings'
  | 'synths'
  | 'vocals'
  | 'fx';

export interface ArrangementTrack {
  id: string;
  name: string;
  trackType: TrackType;
  color: string;
  volume: number; // 0 to 1
  pan: number;    // -1 to +1
  muted: boolean;
  solo: boolean;
  clips: TrackClip[];
}

export interface GenerationJob {
  id: string;
  projectId?: string;
  prompt: string;
  enhancedPrompt?: string;
  status: JobStatus;
  progress: number; // 0 to 100
  mode: GenerationMode;
  specification: MusicSpecification;
  audioUrl?: string;
  waveformData?: number[];
  durationSeconds?: number;
  provider: string;
  createdAt: string;
  completedAt?: string;
  errorMessage?: string;
  lyrics?: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  genre: string;
  bpm: number;
  keySignature: string;
  timeSignature: string;
  durationSeconds: number;
  isFavorite: boolean;
  tracks: ArrangementTrack[];
  pianoRollNotes: MidiNote[];
  latestGenerationId?: string;
  audioUrl?: string;
  waveformData?: number[];
  createdAt: string;
  updatedAt: string;
}

export interface MusicTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  genre: string;
  subgenre: string;
  bpm: number;
  key: string;
  timeSignature: string;
  moods: string[];
  instruments: string[];
  prompt: string;
  tags: string[];
  icon: string;
}
