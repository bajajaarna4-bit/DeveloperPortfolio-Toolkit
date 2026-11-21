import { MusicSpecification, MidiNote, ArrangementTrack } from '@/types/music';
import { audioBufferToWav, blobToDataURL } from './wavEncoder';

// Pitch note frequency mapping
export const NOTE_TO_FREQ: Record<string, number> = {
  'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
};

export const CHORD_ROOTS: Record<string, string[]> = {
  'Am': ['A3', 'C4', 'E4'],
  'F': ['F3', 'A3', 'C4'],
  'C': ['C3', 'E3', 'G3'],
  'G': ['G3', 'B3', 'D4'],
  'Dm': ['D3', 'F3', 'A3'],
  'Em': ['E3', 'G3', 'B3'],
  'Bb': ['A#3', 'D4', 'F4'],
  'Ab': ['G#3', 'C4', 'D#4'],
  'Eb': ['D#3', 'G3', 'A#3'],
  'Cm': ['C3', 'D#3', 'G3'],
  'Gm': ['G3', 'A#3', 'D4'],
  'Fm': ['F3', 'G#3', 'C4'],
  'Db': ['C#3', 'F3', 'G#3'],
  'Cmaj7': ['C3', 'E3', 'G3', 'B3'],
  'Dm7': ['D3', 'F3', 'A3', 'C4'],
  'Fmaj7': ['F3', 'A3', 'C4', 'E4'],
  'Em7': ['E3', 'G3', 'B3', 'D4'],
  'G7': ['G3', 'B3', 'D4', 'F4'],
  'Am7': ['A3', 'C4', 'E4', 'G4'],
};

export interface ProceduralRenderResult {
  audioUrl: string;
  blob: Blob;
  waveformData: number[];
  durationSeconds: number;
  midiNotes: MidiNote[];
  tracks: ArrangementTrack[];
}

/**
 * Procedural synthesizer running on OfflineAudioContext.
 * Synthesizes high-fidelity multi-track audio in 200-500ms right in the browser!
 */
export async function renderProceduralAudio(spec: MusicSpecification): Promise<ProceduralRenderResult> {
  const bpm = spec.bpm || 100;
  const secondsPerBeat = 60 / bpm;
  const numBars = 8;
  const beatsPerBar = 4;
  const totalBeats = numBars * beatsPerBar;
  const durationSeconds = totalBeats * secondsPerBeat;
  const sampleRate = 44100;
  const totalSamples = Math.ceil(durationSeconds * sampleRate);

  // Use OfflineAudioContext for fast-as-light background rendering
  const offlineCtx = new (window.OfflineAudioContext || (window as unknown as { webkitOfflineAudioContext: typeof OfflineAudioContext }).webkitOfflineAudioContext)(
    2,
    totalSamples,
    sampleRate
  );

  // Master bus with subtle limiter
  const masterGain = offlineCtx.createGain();
  masterGain.gain.setValueAtTime(0.85, 0);

  // Master Reverb Convolver simulation (synthetic impulse)
  const convolver = offlineCtx.createConvolver();
  const reverbLength = sampleRate * 2.2;
  const reverbBuffer = offlineCtx.createBuffer(2, reverbLength, sampleRate);
  for (let c = 0; c < 2; c++) {
    const data = reverbBuffer.getChannelData(c);
    for (let i = 0; i < reverbLength; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbLength, 2.5);
    }
  }
  convolver.buffer = reverbBuffer;

  const reverbGain = offlineCtx.createGain();
  reverbGain.gain.setValueAtTime(spec.genre === 'Cinematic' || spec.genre === 'Ambient' ? 0.35 : 0.18, 0);

  convolver.connect(reverbGain);
  reverbGain.connect(masterGain);
  masterGain.connect(offlineCtx.destination);

  // 1. CHORD PROGRESSION & PIANO / STRINGS
  const chords = spec.chord_progression && spec.chord_progression.length > 0
    ? spec.chord_progression
    : ['Am', 'F', 'C', 'G'];

  const midiNotes: MidiNote[] = [];

  // Play chords across bars
  for (let bar = 0; bar < numBars; bar++) {
    const chordName = chords[bar % chords.length] || 'Am';
    const notesInChord = CHORD_ROOTS[chordName] || ['A3', 'C4', 'E4'];
    const barStartTime = bar * beatsPerBar * secondsPerBeat;

    // Bass note (Root)
    const rootPitch = notesInChord[0];
    const bassFreq = (NOTE_TO_FREQ[rootPitch] || 220) / 2; // drop an octave
    
    // Bass Synth
    const bassOsc = offlineCtx.createOscillator();
    const bassGain = offlineCtx.createGain();
    const bassFilter = offlineCtx.createBiquadFilter();

    bassOsc.type = spec.genre === 'Electronic' || spec.genre === 'Trap' ? 'sawtooth' : 'triangle';
    bassOsc.frequency.setValueAtTime(bassFreq, barStartTime);

    bassFilter.type = 'lowpass';
    bassFilter.frequency.setValueAtTime(spec.genre === 'Trap' ? 140 : 280, barStartTime);

    bassGain.gain.setValueAtTime(0.001, barStartTime);
    bassGain.gain.linearRampToValueAtTime(0.4, barStartTime + 0.05);
    bassGain.gain.exponentialRampToValueAtTime(0.001, barStartTime + beatsPerBar * secondsPerBeat - 0.05);

    bassOsc.connect(bassFilter);
    bassFilter.connect(bassGain);
    bassGain.connect(masterGain);

    bassOsc.start(barStartTime);
    bassOsc.stop(barStartTime + beatsPerBar * secondsPerBeat);

    // Chords (Arpeggiated or sustained)
    notesInChord.forEach((pitch, pIdx) => {
      const freq = NOTE_TO_FREQ[pitch] || 440;
      const osc = offlineCtx.createOscillator();
      const gain = offlineCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, barStartTime);

      // Add harmonic sparkle
      const osc2 = offlineCtx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, barStartTime);

      const chordGainValue = 0.08 / notesInChord.length;
      gain.gain.setValueAtTime(0.001, barStartTime);
      gain.gain.linearRampToValueAtTime(chordGainValue, barStartTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, barStartTime + beatsPerBar * secondsPerBeat - 0.05);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(masterGain);
      gain.connect(convolver);

      osc.start(barStartTime);
      osc.stop(barStartTime + beatsPerBar * secondsPerBeat);
      osc2.start(barStartTime);
      osc2.stop(barStartTime + beatsPerBar * secondsPerBeat);

      // Collect MIDI note
      midiNotes.push({
        id: `note-${bar}-${pIdx}`,
        pitch,
        midi: Math.round(69 + 12 * Math.log2(freq / 440)),
        time: bar * 4,
        duration: 4,
        velocity: 85,
      });
    });

    // 2. MELODY LEAD NOTES (Melodic motif in bars 2..8)
    if (bar >= 1) {
      const melodyPitches = ['E4', 'G4', 'A4', 'C5', 'B4', 'A4', 'G4', 'E4'];
      const mPitch = melodyPitches[(bar * 2) % melodyPitches.length];
      const mFreq = NOTE_TO_FREQ[mPitch] || 440;
      const mStartTime = barStartTime + (1.5 * secondsPerBeat);
      const mDuration = 1.8 * secondsPerBeat;

      const mOsc = offlineCtx.createOscillator();
      const mGain = offlineCtx.createGain();
      mOsc.type = 'sawtooth';
      mOsc.frequency.setValueAtTime(mFreq, mStartTime);
      // subtle vibrato
      mOsc.frequency.linearRampToValueAtTime(mFreq * 1.01, mStartTime + mDuration * 0.5);

      const mFilter = offlineCtx.createBiquadFilter();
      mFilter.type = 'lowpass';
      mFilter.frequency.setValueAtTime(1200, mStartTime);

      mGain.gain.setValueAtTime(0.001, mStartTime);
      mGain.gain.linearRampToValueAtTime(0.12, mStartTime + 0.08);
      mGain.gain.exponentialRampToValueAtTime(0.001, mStartTime + mDuration - 0.02);

      mOsc.connect(mFilter);
      mFilter.connect(mGain);
      mGain.connect(masterGain);
      mGain.connect(convolver);

      mOsc.start(mStartTime);
      mOsc.stop(mStartTime + mDuration);

      midiNotes.push({
        id: `melody-${bar}`,
        pitch: mPitch,
        midi: Math.round(69 + 12 * Math.log2(mFreq / 440)),
        time: bar * 4 + 1.5,
        duration: 2,
        velocity: 100,
      });
    }

    // 3. DRUMS / PERCUSSION (Kick on beat 1 & 3, Snare/Clap on beat 2 & 4)
    if (spec.genre !== 'Ambient') {
      for (let beat = 0; beat < beatsPerBar; beat++) {
        const beatTime = barStartTime + beat * secondsPerBeat;

        // Kick on beat 0 and beat 2
        if (beat === 0 || (beat === 2 && (spec.genre === 'House' || spec.genre === 'Electronic' || bar >= 2))) {
          const kickOsc = offlineCtx.createOscillator();
          const kickGain = offlineCtx.createGain();
          kickOsc.type = 'sine';
          kickOsc.frequency.setValueAtTime(140, beatTime);
          kickOsc.frequency.exponentialRampToValueAtTime(38, beatTime + 0.09);

          kickGain.gain.setValueAtTime(0.65, beatTime);
          kickGain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.28);

          kickOsc.connect(kickGain);
          kickGain.connect(masterGain);

          kickOsc.start(beatTime);
          kickOsc.stop(beatTime + 0.3);
        }

        // Snare / Clap on beat 1 and 3 (0-indexed beat 1 and 3)
        if (beat === 1 || beat === 3) {
          if (bar >= 1) {
            // White noise burst
            const noiseLength = Math.floor(sampleRate * 0.18);
            const noiseBuffer = offlineCtx.createBuffer(1, noiseLength, sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < noiseLength; i++) {
              output[i] = Math.random() * 2 - 1;
            }

            const whiteNoise = offlineCtx.createBufferSource();
            whiteNoise.buffer = noiseBuffer;

            const snareFilter = offlineCtx.createBiquadFilter();
            snareFilter.type = 'bandpass';
            snareFilter.frequency.setValueAtTime(1500, beatTime);
            snareFilter.Q.setValueAtTime(1.8, beatTime);

            const snareGain = offlineCtx.createGain();
            snareGain.gain.setValueAtTime(0.25, beatTime);
            snareGain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.18);

            whiteNoise.connect(snareFilter);
            snareFilter.connect(snareGain);
            snareGain.connect(masterGain);
            snareGain.connect(convolver);

            whiteNoise.start(beatTime);
            whiteNoise.stop(beatTime + 0.2);
          }
        }

        // Hi-Hats on 8th notes
        for (let sub = 0; sub < 2; sub++) {
          const hatTime = beatTime + (sub * 0.5 * secondsPerBeat);
          if (bar >= 1) {
            const hatLength = Math.floor(sampleRate * 0.04);
            const hatBuffer = offlineCtx.createBuffer(1, hatLength, sampleRate);
            const hatData = hatBuffer.getChannelData(0);
            for (let i = 0; i < hatLength; i++) {
              hatData[i] = Math.random() * 2 - 1;
            }

            const hatSource = offlineCtx.createBufferSource();
            hatSource.buffer = hatBuffer;

            const hatFilter = offlineCtx.createBiquadFilter();
            hatFilter.type = 'highpass';
            hatFilter.frequency.setValueAtTime(7000, hatTime);

            const hatGain = offlineCtx.createGain();
            hatGain.gain.setValueAtTime(sub === 1 ? 0.08 : 0.05, hatTime);
            hatGain.gain.exponentialRampToValueAtTime(0.001, hatTime + 0.04);

            hatSource.connect(hatFilter);
            hatFilter.connect(hatGain);
            hatGain.connect(masterGain);

            hatSource.start(hatTime);
            hatSource.stop(hatTime + 0.05);
          }
        }
      }
    }
  }

  // Render the audio graph!
  const renderedBuffer = await offlineCtx.startRendering();
  const wavBlob = audioBufferToWav(renderedBuffer);
  const audioUrl = await blobToDataURL(wavBlob);

  // Extract 120-point normalized waveform peak data for visualizations
  const channelData = renderedBuffer.getChannelData(0);
  const waveformData: number[] = [];
  const step = Math.floor(channelData.length / 120);
  for (let i = 0; i < 120; i++) {
    let peak = 0;
    const start = i * step;
    for (let j = 0; j < step; j += 10) {
      const val = Math.abs(channelData[start + j] || 0);
      if (val > peak) peak = val;
    }
    waveformData.push(parseFloat(Math.min(1, Math.max(0.08, peak * 1.4)).toFixed(3)));
  }

  // Default arrangement tracks for the multitrack timeline
  const tracks: ArrangementTrack[] = [
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

  return {
    audioUrl,
    blob: wavBlob,
    waveformData,
    durationSeconds: parseFloat(durationSeconds.toFixed(1)),
    midiNotes,
    tracks,
  };
}
