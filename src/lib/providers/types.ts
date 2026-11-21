import { MusicSpecification, GenerationJob, GenerationMode } from '@/types/music';

export interface GenerationOptions {
  mode: GenerationMode;
  lyrics?: string;
  referenceAudioUrl?: string;
  temperature?: number;
  durationSeconds?: number;
}

export interface IMusicProvider {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  isAvailable(): boolean;
  generate(prompt: string, spec: MusicSpecification, options?: GenerationOptions): Promise<GenerationJob>;
  getStatus(jobId: string): Promise<GenerationJob | null>;
  extend?(jobId: string, seconds: number): Promise<GenerationJob>;
  variation?(jobId: string, intensity: number): Promise<GenerationJob>;
}
