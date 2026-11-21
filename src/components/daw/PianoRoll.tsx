'use client';

import React, { useState, useRef } from 'react';
import {
  Play,
  Square,
  Download,
  Plus,
  Trash2,
  Sliders,
  Grid,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { MidiNote } from '@/types/music';
import { toneEngine } from '@/lib/audio/tonePlayer';
import { exportMidiFile } from '@/lib/audio/midiExporter';
import { SCALES } from '@/lib/musicTheory/engine';

interface PianoRollProps {
  notes: MidiNote[];
  onNotesChange: (notes: MidiNote[]) => void;
  bpm: number;
}

// 2 octaves of keys from B4 down to C3
const PIANO_PITCHES = [
  { pitch: 'B4', midi: 71, isBlack: false },
  { pitch: 'A#4', midi: 70, isBlack: true },
  { pitch: 'A4', midi: 69, isBlack: false },
  { pitch: 'G#4', midi: 68, isBlack: true },
  { pitch: 'G4', midi: 67, isBlack: false },
  { pitch: 'F#4', midi: 66, isBlack: true },
  { pitch: 'F4', midi: 65, isBlack: false },
  { pitch: 'E4', midi: 64, isBlack: false },
  { pitch: 'D#4', midi: 63, isBlack: true },
  { pitch: 'D4', midi: 62, isBlack: false },
  { pitch: 'C#4', midi: 61, isBlack: true },
  { pitch: 'C4', midi: 60, isBlack: false },

  { pitch: 'B3', midi: 59, isBlack: false },
  { pitch: 'A#3', midi: 58, isBlack: true },
  { pitch: 'A3', midi: 57, isBlack: false },
  { pitch: 'G#3', midi: 56, isBlack: true },
  { pitch: 'G3', midi: 55, isBlack: false },
  { pitch: 'F#3', midi: 54, isBlack: true },
  { pitch: 'F3', midi: 53, isBlack: false },
  { pitch: 'E3', midi: 52, isBlack: false },
  { pitch: 'D#3', midi: 51, isBlack: true },
  { pitch: 'D3', midi: 50, isBlack: false },
  { pitch: 'C#3', midi: 49, isBlack: true },
  { pitch: 'C3', midi: 48, isBlack: false },
];

export const PianoRoll: React.FC<PianoRollProps> = ({
  notes,
  onNotesChange,
  bpm,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedScale, setSelectedScale] = useState<string>('Natural Minor');
  const [scaleRoot, setScaleRoot] = useState<string>('A');
  const [snapGrid, setSnapGrid] = useState<number>(1); // 1 beat
  const [activeVelocityNote, setActiveVelocityNote] = useState<string | null>(null);

  const totalBeats = 16; // 4 bars of 4/4
  const beatWidth = 48; // px per beat
  const keyHeight = 22; // px per piano key

  // Scale highlighting detection
  const isKeyInScale = (midi: number) => {
    const scaleDef = SCALES[selectedScale];
    if (!scaleDef) return true;
    const noteIndex = midi % 12;
    const rootIndex = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].indexOf(scaleRoot);
    const semitonesFromRoot = (noteIndex - rootIndex + 12) % 12;
    return scaleDef.intervals.includes(semitonesFromRoot);
  };

  // Preview key sound
  const handleKeyClick = (pitch: string) => {
    toneEngine.playNote(pitch, '8n');
  };

  // Add or remove note on grid click
  const handleGridClick = (pitchObj: { pitch: string; midi: number }, beat: number) => {
    const existing = notes.find((n) => n.midi === pitchObj.midi && Math.abs(n.time - beat) < 0.5);
    if (existing) {
      // Delete note
      onNotesChange(notes.filter((n) => n.id !== existing.id));
    } else {
      // Create new note
      const newNote: MidiNote = {
        id: `note-${Date.now()}-${Math.random()}`,
        pitch: pitchObj.pitch,
        midi: pitchObj.midi,
        time: beat,
        duration: snapGrid,
        velocity: 90,
      };
      toneEngine.playNote(pitchObj.pitch, '8n');
      onNotesChange([...notes, newNote]);
    }
  };

  // Play MIDI sequence
  const handlePlaySequence = async () => {
    if (isPlaying) {
      toneEngine.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      await toneEngine.playMidiSequence(notes, bpm, () => {
        setIsPlaying(false);
      });
    }
  };

  // Export Standard MIDI (.mid) file
  const handleExportMidi = () => {
    const blob = exportMidiFile(notes, bpm, 'SONORA_Sequence');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SONORA_${selectedScale.replace(/\s+/g, '_')}_${bpm}BPM.mid`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Clear all notes
  const handleClearAll = () => {
    onNotesChange([]);
  };

  return (
    <div className="rounded-2xl bg-panel/90 border border-border shadow-panel-soft backdrop-blur-xl overflow-hidden flex flex-col h-[600px]">
      {/* Top Piano Roll Toolbar */}
      <div className="h-14 bg-[#101016] border-b border-border px-5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePlaySequence}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isPlaying
                ? 'bg-amber-500 text-black shadow-amber-500/20'
                : 'bg-accent-primary text-black hover:bg-violet-300 shadow-glow-primary'
            }`}
          >
            {isPlaying ? <Square className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
            {isPlaying ? 'Stop' : 'Play Sequence'}
          </button>

          <button
            onClick={handleExportMidi}
            disabled={notes.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-text-muted hover:text-text bg-panel border border-border hover:border-accent-primary/40 disabled:opacity-40 transition-colors"
            title="Download standard .mid file"
          >
            <Download className="h-3.5 w-3.5" />
            Export MIDI (.mid)
          </button>

          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-text-muted hover:text-danger bg-panel border border-border transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>
        </div>

        {/* Scale Highlighting & Quantize Controls */}
        <div className="flex items-center gap-2">
          {/* Root Note */}
          <select
            value={scaleRoot}
            onChange={(e) => setScaleRoot(e.target.value)}
            className="bg-[#0B0B10] border border-border rounded-lg px-2 py-1 text-xs text-text focus:outline-none focus:border-accent-primary"
          >
            {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          {/* Scale Type */}
          <select
            value={selectedScale}
            onChange={(e) => setSelectedScale(e.target.value)}
            className="bg-[#0B0B10] border border-border rounded-lg px-2 py-1 text-xs text-text focus:outline-none focus:border-accent-primary"
          >
            {Object.keys(SCALES).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Snap Grid */}
          <select
            value={snapGrid}
            onChange={(e) => setSnapGrid(parseFloat(e.target.value))}
            className="bg-[#0B0B10] border border-border rounded-lg px-2 py-1 text-xs text-text font-mono focus:outline-none focus:border-accent-primary"
          >
            <option value={0.5}>Snap: 1/8 Beat</option>
            <option value={1}>Snap: 1/4 (1 Beat)</option>
            <option value={2}>Snap: 1/2 (2 Beats)</option>
            <option value={4}>Snap: 1 Bar (4 Beats)</option>
          </select>
        </div>
      </div>

      {/* Main Piano Roll Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Vertical Piano Keyboard */}
        <div className="w-20 bg-[#0B0B10] border-r border-border shrink-0 overflow-y-auto select-none">
          <div className="divide-y divide-border/20">
            {PIANO_PITCHES.map((p) => {
              const inScale = isKeyInScale(p.midi);
              return (
                <div
                  key={p.pitch}
                  onClick={() => handleKeyClick(p.pitch)}
                  className={`h-[22px] px-2 flex items-center justify-between text-[10px] font-mono cursor-pointer transition-colors ${
                    p.isBlack
                      ? 'bg-[#121218] text-text-muted hover:bg-accent-secondary/50 piano-black-key'
                      : 'bg-[#22222E] text-text hover:bg-accent-primary/40 piano-white-key'
                  } ${inScale ? 'font-bold' : 'opacity-40'}`}
                  title={`${p.pitch} ${inScale ? '(In Scale)' : ''}`}
                >
                  <span>{p.pitch}</span>
                  {p.pitch.startsWith('C') && !p.isBlack && (
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Note Grid */}
        <div className="flex-1 overflow-auto bg-[#09090D] relative">
          {/* Horizontal Bar Labels */}
          <div className="h-6 bg-[#111118] border-b border-border sticky top-0 z-10 flex">
            {Array.from({ length: totalBeats / 4 }).map((_, barIdx) => (
              <div
                key={barIdx}
                className="border-r border-border px-2 text-[10px] font-mono text-text-muted flex items-center shrink-0"
                style={{ width: `${beatWidth * 4}px` }}
              >
                Bar {barIdx + 1}
              </div>
            ))}
          </div>

          {/* Grid Canvas & Notes */}
          <div className="relative min-w-max" style={{ height: `${PIANO_PITCHES.length * keyHeight}px` }}>
            {/* Beat grid vertical lines */}
            {Array.from({ length: totalBeats }).map((_, b) => (
              <div
                key={b}
                className={`absolute top-0 bottom-0 pointer-events-none ${
                  b % 4 === 0 ? 'border-r border-border/60' : 'border-r border-border/20'
                }`}
                style={{ left: `${b * beatWidth}px`, width: `${beatWidth}px` }}
              />
            ))}

            {/* Pitch horizontal rows */}
            {PIANO_PITCHES.map((p, rowIdx) => {
              const inScale = isKeyInScale(p.midi);
              return (
                <div
                  key={p.pitch}
                  className={`h-[22px] border-b border-border/20 relative flex ${
                    inScale ? 'bg-accent-secondary/[0.03]' : 'bg-transparent'
                  }`}
                  style={{ width: `${totalBeats * beatWidth}px` }}
                >
                  {/* Clickable beat slots */}
                  {Array.from({ length: totalBeats }).map((_, beat) => (
                    <div
                      key={beat}
                      onClick={() => handleGridClick(p, beat)}
                      className="h-full hover:bg-accent-primary/20 cursor-pointer border-r border-transparent hover:border-accent-primary/40 transition-colors"
                      style={{ width: `${beatWidth}px` }}
                      title={`Add/Remove ${p.pitch} at beat ${beat + 1}`}
                    />
                  ))}
                </div>
              );
            })}

            {/* Render Active MIDI Notes */}
            {notes.map((note) => {
              const rowIndex = PIANO_PITCHES.findIndex((p) => p.midi === note.midi);
              if (rowIndex === -1) return null;

              return (
                <div
                  key={note.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Remove on click
                    onNotesChange(notes.filter((n) => n.id !== note.id));
                  }}
                  className="absolute rounded bg-gradient-to-r from-accent-primary to-accent-secondary border border-white/40 text-black font-bold text-[9px] px-1 flex items-center justify-between cursor-pointer shadow-glow-primary hover:brightness-125 transition-all z-20 group"
                  style={{
                    top: `${rowIndex * keyHeight + 2}px`,
                    height: `${keyHeight - 4}px`,
                    left: `${note.time * beatWidth}px`,
                    width: `${note.duration * beatWidth - 2}px`,
                  }}
                  title={`${note.pitch} (Beat ${note.time}, Duration: ${note.duration}) - Click to delete`}
                >
                  <span className="truncate">{note.pitch}</span>
                  <span className="opacity-0 group-hover:opacity-100 text-[8px]">✕</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="h-8 bg-[#0D0D14] border-t border-border px-4 flex items-center justify-between text-[11px] text-text-muted">
        <span>{notes.length} MIDI notes recorded</span>
        <span>
          Key highlight: {scaleRoot} {selectedScale} ({SCALES[selectedScale]?.description || ''})
        </span>
      </div>
    </div>
  );
};
