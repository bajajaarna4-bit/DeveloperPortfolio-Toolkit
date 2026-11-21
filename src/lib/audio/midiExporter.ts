import { MidiNote } from '@/types/music';

/**
 * Standard MIDI File (.mid) encoder for browser download.
 * Generates a valid Type 0 or Type 1 Standard MIDI file.
 */
export function exportMidiFile(notes: MidiNote[], bpm: number = 120, trackName: string = 'SONORA MIDI'): Blob {
  const ticksPerQuarterNote = 480;
  const microsecondsPerMinute = 60000000;
  const tempoMicros = Math.round(microsecondsPerMinute / bpm);

  // MIDI variable length quantity encoder
  const toVarLen = (val: number): number[] => {
    let buffer = val & 0x7f;
    const bytes: number[] = [];
    while ((val >>= 7)) {
      buffer <<= 8;
      buffer |= (val & 0x7f) | 0x80;
    }
    while (true) {
      bytes.push(buffer & 0xff);
      if (buffer & 0x80) buffer >>= 8;
      else break;
    }
    return bytes;
  };

  // Convert MidiNote array to MIDI events sorted by absolute tick
  interface RawEvent {
    tick: number;
    type: 'on' | 'off';
    pitch: number;
    velocity: number;
  }

  const events: RawEvent[] = [];
  for (const n of notes) {
    const startTick = Math.round(n.time * ticksPerQuarterNote);
    const endTick = Math.round((n.time + n.duration) * ticksPerQuarterNote);
    events.push({ tick: startTick, type: 'on', pitch: n.midi, velocity: n.velocity || 90 });
    events.push({ tick: endTick, type: 'off', pitch: n.midi, velocity: 0 });
  }

  events.sort((a, b) => a.tick - b.tick);

  // Build track data
  const trackBytes: number[] = [];

  // Track Name meta event
  trackBytes.push(0x00, 0xff, 0x03, trackName.length, ...trackName.split('').map(c => c.charCodeAt(0)));

  // Tempo meta event
  trackBytes.push(
    0x00,
    0xff,
    0x51,
    0x03,
    (tempoMicros >> 16) & 0xff,
    (tempoMicros >> 8) & 0xff,
    tempoMicros & 0xff
  );

  let lastTick = 0;
  for (const ev of events) {
    const delta = ev.tick - lastTick;
    lastTick = ev.tick;
    trackBytes.push(...toVarLen(delta));
    if (ev.type === 'on') {
      trackBytes.push(0x90, ev.pitch, ev.velocity);
    } else {
      trackBytes.push(0x80, ev.pitch, 0);
    }
  }

  // End of Track meta event
  trackBytes.push(0x00, 0xff, 0x2f, 0x00);

  // Build File Header: 'MThd' (4 bytes), length 6, format 0, tracks 1, division 480
  const header: number[] = [
    0x4d, 0x54, 0x68, 0x64, // 'MThd'
    0x00, 0x00, 0x00, 0x06, // header length
    0x00, 0x00,             // format 0
    0x00, 0x01,             // 1 track
    (ticksPerQuarterNote >> 8) & 0xff, ticksPerQuarterNote & 0xff,
  ];

  // Track chunk: 'MTrk' (4 bytes), chunk length (4 bytes), track data
  const trackHeader: number[] = [
    0x4d, 0x54, 0x72, 0x6b, // 'MTrk'
    (trackBytes.length >> 24) & 0xff,
    (trackBytes.length >> 16) & 0xff,
    (trackBytes.length >> 8) & 0xff,
    trackBytes.length & 0xff,
  ];

  const fullData = new Uint8Array([...header, ...trackHeader, ...trackBytes]);
  return new Blob([fullData], { type: 'audio/midi' });
}
