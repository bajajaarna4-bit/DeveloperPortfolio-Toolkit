'use client';

import { MidiNote, ArrangementTrack } from '@/types/music';

// Converts pitch string or MIDI number to exact frequency (Hz)
export function pitchToFrequency(pitchOrMidi: string | number): number {
  if (typeof pitchOrMidi === 'number') {
    return 440 * Math.pow(2, (pitchOrMidi - 69) / 12);
  }
  const noteMap: Record<string, number> = {
    C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5,
    'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11,
  };
  const match = pitchOrMidi.match(/^([A-G][#b]?)(-?\d+)$/);
  if (!match) return 440;
  const noteName = match[1];
  const octave = parseInt(match[2], 10);
  const semitone = noteMap[noteName] ?? 9;
  const midi = (octave + 1) * 12 + semitone;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

class StudioWebAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private activeTimeouts: NodeJS.Timeout[] = [];
  private activeNodes: { stop: () => void }[] = [];

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public async init() {
    this.getContext();
  }

  /**
   * Play a single preview note (e.g. clicking key on piano roll)
   */
  public async playNote(pitch: string, durationStr: string = '8n') {
    const ctx = this.getContext();
    const freq = pitchToFrequency(pitch);
    const now = ctx.currentTime;
    const duration = 0.4;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    // Warm ADSR envelope
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  /**
   * Play MIDI sequence on the piano roll
   */
  public async playMidiSequence(notes: MidiNote[], bpm: number = 120, onComplete?: () => void) {
    this.stop();
    const ctx = this.getContext();
    const secondsPerBeat = 60 / bpm;
    const startTime = ctx.currentTime + 0.05;

    let maxEndTime = 0;

    notes.forEach((note) => {
      const noteStart = startTime + note.time * secondsPerBeat;
      const noteDuration = Math.max(0.1, note.duration * secondsPerBeat);
      if (noteStart + noteDuration > maxEndTime) maxEndTime = noteStart + noteDuration;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const freq = note.midi ? pitchToFrequency(note.midi) : pitchToFrequency(note.pitch);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteStart);

      const velFactor = (note.velocity || 90) / 127;
      gain.gain.setValueAtTime(0.001, noteStart);
      gain.gain.linearRampToValueAtTime(0.2 * velFactor, noteStart + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + noteDuration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + noteDuration + 0.05);
      this.activeNodes.push({ stop: () => osc.stop() });
    });

    this.isPlaying = true;

    if (onComplete) {
      const timeoutMs = Math.max(500, (maxEndTime - ctx.currentTime) * 1000);
      const tid = setTimeout(() => {
        this.isPlaying = false;
        onComplete();
      }, timeoutMs);
      this.activeTimeouts.push(tid);
    }
  }

  /**
   * Play multitrack arrangement DAW tracks
   */
  public async playArrangement(tracks: ArrangementTrack[], bpm: number = 120, onTick?: (bar: number) => void) {
    this.stop();
    const ctx = this.getContext();
    const secondsPerBeat = 60 / bpm;
    const totalBars = 8;
    const beatsPerBar = 4;
    const startTime = ctx.currentTime + 0.05;

    tracks.forEach((track) => {
      if (track.muted) return;

      track.clips.forEach((clip) => {
        const clipStartSec = startTime + clip.startBar * beatsPerBar * secondsPerBeat;

        if (track.trackType === 'drums') {
          // Synthesize rhythmic kick and snare
          for (let bar = 0; bar < clip.lengthBars; bar++) {
            for (let beat = 0; beat < 4; beat++) {
              const hitTime = clipStartSec + (bar * 4 + beat) * secondsPerBeat;

              // Kick on 0 and 2
              if (beat === 0 || beat === 2) {
                const kOsc = ctx.createOscillator();
                const kGain = ctx.createGain();
                kOsc.type = 'sine';
                kOsc.frequency.setValueAtTime(130, hitTime);
                kOsc.frequency.exponentialRampToValueAtTime(40, hitTime + 0.1);

                kGain.gain.setValueAtTime(0.5 * track.volume, hitTime);
                kGain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.25);

                kOsc.connect(kGain);
                kGain.connect(ctx.destination);
                kOsc.start(hitTime);
                kOsc.stop(hitTime + 0.26);
                this.activeNodes.push({ stop: () => kOsc.stop() });
              }

              // Snare on 1 and 3
              if (beat === 1 || beat === 3) {
                const sOsc = ctx.createOscillator();
                const sGain = ctx.createGain();
                sOsc.type = 'triangle';
                sOsc.frequency.setValueAtTime(220, hitTime);

                sGain.gain.setValueAtTime(0.25 * track.volume, hitTime);
                sGain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.15);

                sOsc.connect(sGain);
                sGain.connect(ctx.destination);
                sOsc.start(hitTime);
                sOsc.stop(hitTime + 0.16);
                this.activeNodes.push({ stop: () => sOsc.stop() });
              }
            }
          }
        } else if (track.trackType === 'bass') {
          const bassPitches = ['A1', 'F1', 'C2', 'G1'];
          for (let bar = 0; bar < clip.lengthBars; bar++) {
            const barTime = clipStartSec + bar * 4 * secondsPerBeat;
            const p = bassPitches[bar % bassPitches.length];
            const freq = pitchToFrequency(p);

            const bOsc = ctx.createOscillator();
            const bGain = ctx.createGain();
            bOsc.type = 'sawtooth';
            bOsc.frequency.setValueAtTime(freq, barTime);

            bGain.gain.setValueAtTime(0.001, barTime);
            bGain.gain.linearRampToValueAtTime(0.22 * track.volume, barTime + 0.05);
            bGain.gain.exponentialRampToValueAtTime(0.001, barTime + 4 * secondsPerBeat - 0.05);

            bOsc.connect(bGain);
            bGain.connect(ctx.destination);
            bOsc.start(barTime);
            bOsc.stop(barTime + 4 * secondsPerBeat);
            this.activeNodes.push({ stop: () => bOsc.stop() });
          }
        } else if (track.trackType === 'piano' || track.trackType === 'chords') {
          const chordProg = [
            ['A3', 'C4', 'E4'],
            ['F3', 'A3', 'C4'],
            ['C3', 'E3', 'G3'],
            ['G3', 'B3', 'D4'],
          ];
          for (let bar = 0; bar < clip.lengthBars; bar++) {
            const barTime = clipStartSec + bar * 4 * secondsPerBeat;
            const chord = chordProg[bar % chordProg.length];

            chord.forEach((note) => {
              const freq = pitchToFrequency(note);
              const cOsc = ctx.createOscillator();
              const cGain = ctx.createGain();
              cOsc.type = 'triangle';
              cOsc.frequency.setValueAtTime(freq, barTime);

              cGain.gain.setValueAtTime(0.001, barTime);
              cGain.gain.linearRampToValueAtTime(0.08 * track.volume, barTime + 0.08);
              cGain.gain.exponentialRampToValueAtTime(0.001, barTime + 4 * secondsPerBeat - 0.05);

              cOsc.connect(cGain);
              cGain.connect(ctx.destination);
              cOsc.start(barTime);
              cOsc.stop(barTime + 4 * secondsPerBeat);
              this.activeNodes.push({ stop: () => cOsc.stop() });
            });
          }
        }
      });
    });

    this.isPlaying = true;
  }

  public stop() {
    this.isPlaying = false;
    this.activeTimeouts.forEach(clearTimeout);
    this.activeTimeouts = [];
    this.activeNodes.forEach((n) => {
      try {
        n.stop();
      } catch (e) {
        // ignore
      }
    });
    this.activeNodes = [];
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const toneEngine = new StudioWebAudioEngine();
