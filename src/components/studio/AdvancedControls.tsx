'use client';

import React, { useState } from 'react';
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Music,
  Gauge,
  KeyRound,
  Layers,
  Sparkles,
  Volume2,
  Clock,
} from 'lucide-react';
import { MusicSpecification } from '@/types/music';

interface AdvancedControlsProps {
  specification: MusicSpecification;
  onChange: (updated: Partial<MusicSpecification>) => void;
}

export const AdvancedControls: React.FC<AdvancedControlsProps> = ({
  specification,
  onChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'genre' | 'tempo' | 'key' | 'instruments' | 'effects' | 'dynamics'>('genre');
  const [tapTimes, setTapTimes] = useState<number[]>([]);

  const genres = [
    'Classical', 'Cinematic', 'Orchestral', 'Electronic', 'EDM', 'House', 'Techno',
    'Hip-Hop', 'Trap', 'R&B', 'Jazz', 'Blues', 'Rock', 'Metal',
    'Pop', 'Ambient', 'Lo-fi', 'Acoustic', 'Folk', 'World Music', 'Experimental'
  ];

  const moods = [
    'Happy', 'Sad', 'Emotional', 'Epic', 'Dark', 'Mysterious',
    'Peaceful', 'Romantic', 'Aggressive', 'Dreamy', 'Nostalgic',
    'Suspenseful', 'Triumphant', 'Melancholic'
  ];

  const keys = [
    'C Major', 'D Major', 'E Major', 'F Major', 'G Major', 'A Major', 'B Major',
    'C Minor', 'D Minor', 'E Minor', 'F Minor', 'G Minor', 'A Minor', 'B Minor',
    'D Dorian', 'E Phrygian', 'F Lydian', 'G Mixolydian', 'B Locrian', 'A Pentatonic Minor', 'C Blues'
  ];

  const timeSignatures = ['4/4', '3/4', '6/8', '2/4', '5/4', '7/8'];

  const allInstruments = [
    'Piano', 'Electric Piano', 'Acoustic Guitar', 'Electric Guitar',
    'Violin', 'Cello', 'Viola', 'Full Strings', 'Brass', 'Flute',
    'Saxophone', 'Synthesizer', 'Ambient Pads', 'Bass Guitar', '808 Bass',
    'Acoustic Drums', 'Electronic Drums', 'Orchestral Percussion', 'Choir', 'Vocals'
  ];

  const effects = [
    'Reverb', 'Delay', 'Compression', 'EQ', 'Distortion',
    'Saturation', 'Stereo Width', 'Sidechain', 'Chorus', 'Flanger', 'Filter', 'Limiter'
  ];

  const dynamicsLevels = [
    'Pianissimo (pp)', 'Piano (p)', 'Mezzo Piano (mp)', 'Mezzo Forte (mf)',
    'Forte (f)', 'Fortissimo (ff)', 'Crescendo', 'Decrescendo'
  ];

  // Tap Tempo calculation
  const handleTapTempo = () => {
    const now = performance.now();
    const newTaps = [...tapTimes, now].slice(-4);
    setTapTimes(newTaps);

    if (newTaps.length > 1) {
      const intervals = [];
      for (let i = 1; i < newTaps.length; i++) {
        intervals.push(newTaps[i] - newTaps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      if (calculatedBpm >= 40 && calculatedBpm <= 240) {
        onChange({ bpm: calculatedBpm });
      }
    }
  };

  const toggleMood = (mood: string) => {
    const current = specification.mood || [];
    if (current.includes(mood)) {
      onChange({ mood: current.filter((m) => m !== mood) });
    } else {
      onChange({ mood: [...current, mood] });
    }
  };

  const toggleInstrument = (inst: string) => {
    const current = specification.instruments || [];
    if (current.includes(inst)) {
      onChange({ instruments: current.filter((i) => i !== inst) });
    } else {
      onChange({ instruments: [...current, inst] });
    }
  };

  const toggleEffect = (effect: string) => {
    const current = specification.production_effects || [];
    if (current.includes(effect)) {
      onChange({ production_effects: current.filter((e) => e !== effect) });
    } else {
      onChange({ production_effects: [...current, effect] });
    }
  };

  return (
    <div className="rounded-2xl bg-panel/90 border border-border p-5 shadow-panel-soft backdrop-blur-xl">
      {/* Header with expand/collapse */}
      <div
        className="flex items-center justify-between cursor-pointer select-none pb-2 border-b border-border/60"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-accent-secondary/20 text-accent-primary">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text">Advanced Musical Controls</h3>
            <p className="text-[11px] text-text-muted">
              Tempo, Key & Scale, Time Signature, Instrumentation, and Master Production
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-accent-primary bg-[#111118] px-2.5 py-1 rounded-lg border border-border">
            {specification.genre} • {specification.bpm} BPM • {specification.key}
          </span>
          <button className="text-text-muted hover:text-text p-1">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-5 animate-in fade-in-50 duration-200">
          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-border/50">
            {[
              { id: 'genre', label: 'Genre & Mood', icon: Music },
              { id: 'tempo', label: 'Tempo & Meter', icon: Gauge },
              { id: 'key', label: 'Key & Scale', icon: KeyRound },
              { id: 'instruments', label: 'Instrumentation', icon: Layers },
              { id: 'effects', label: 'Production FX', icon: Sparkles },
              { id: 'dynamics', label: 'Dynamics', icon: Volume2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-accent-secondary/20 text-accent-primary border border-accent-secondary/50'
                      : 'text-text-muted hover:text-text hover:bg-panel'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: GENRE & MOOD */}
          {activeTab === 'genre' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">
                  Select Musical Genre
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {genres.map((g) => {
                    const isSelected = specification.genre === g;
                    return (
                      <button
                        key={g}
                        onClick={() => onChange({ genre: g })}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-accent-primary text-black font-semibold shadow-glow-primary'
                            : 'bg-[#101016] text-text-muted hover:text-text border border-border hover:border-border-light'
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">
                  Mood & Emotional Direction
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {moods.map((m) => {
                    const isSelected = specification.mood?.includes(m);
                    return (
                      <button
                        key={m}
                        onClick={() => toggleMood(m)}
                        className={`px-3 py-1 rounded-xl text-xs transition-colors ${
                          isSelected
                            ? 'bg-accent-secondary/30 text-accent-primary border border-accent-secondary/60'
                            : 'bg-[#101016] text-text-muted hover:text-text border border-border'
                        }`}
                      >
                        {isSelected ? '✓ ' : ''}{m}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TEMPO & METER */}
          {activeTab === 'tempo' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-text-muted font-medium">BPM (Beats Per Minute)</span>
                    <span className="font-mono text-base font-bold text-accent-primary">
                      {specification.bpm} BPM
                    </span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={240}
                    value={specification.bpm}
                    onChange={(e) => onChange({ bpm: parseInt(e.target.value, 10) })}
                    className="w-full h-2 bg-[#12121A] rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-text-muted font-mono mt-1">
                    <span>40 (Grave)</span>
                    <span>120 (Moderato)</span>
                    <span>240 (Presto)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-text-muted font-medium block">Tempo Presets & Tools</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onChange({ bpm: 72 })}
                      className="px-3 py-1.5 rounded-lg text-xs bg-[#101016] hover:bg-panel border border-border text-text"
                    >
                      Slow (72)
                    </button>
                    <button
                      onClick={() => onChange({ bpm: 110 })}
                      className="px-3 py-1.5 rounded-lg text-xs bg-[#101016] hover:bg-panel border border-border text-text"
                    >
                      Moderate (110)
                    </button>
                    <button
                      onClick={() => onChange({ bpm: 140 })}
                      className="px-3 py-1.5 rounded-lg text-xs bg-[#101016] hover:bg-panel border border-border text-text"
                    >
                      Fast (140)
                    </button>
                    <button
                      onClick={handleTapTempo}
                      className="px-3 py-1.5 rounded-lg text-xs bg-accent-secondary/20 hover:bg-accent-secondary/30 border border-accent-secondary/50 text-accent-primary font-semibold active:scale-95 transition-transform"
                      title="Tap repeatedly in rhythm to set BPM"
                    >
                      Tap Tempo ♩
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">
                  Time Signature
                </label>
                <div className="flex gap-2">
                  {timeSignatures.map((ts) => (
                    <button
                      key={ts}
                      onClick={() => onChange({ time_signature: ts })}
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-colors ${
                        specification.time_signature === ts
                          ? 'bg-accent-primary text-black'
                          : 'bg-[#101016] text-text-muted hover:text-text border border-border'
                      }`}
                    >
                      {ts}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KEY & SCALE */}
          {activeTab === 'key' && (
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">
                Musical Key Signature & Modal Tuning
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {keys.map((k) => {
                  const isSelected = specification.key === k;
                  return (
                    <button
                      key={k}
                      onClick={() => onChange({ key: k })}
                      className={`p-2.5 rounded-xl text-xs font-medium text-center transition-colors truncate ${
                        isSelected
                          ? 'bg-accent-primary text-black font-bold shadow-glow-primary'
                          : 'bg-[#101016] text-text-muted hover:text-text border border-border hover:border-border-light'
                      }`}
                      title={k}
                    >
                      {k}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: INSTRUMENTATION */}
          {activeTab === 'instruments' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Instruments in Arrangement ({specification.instruments?.length || 0} selected)
                </label>
                <button
                  onClick={() => onChange({ instruments: allInstruments.slice(0, 5) })}
                  className="text-xs text-accent-primary hover:underline"
                >
                  Reset to Essentials
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {allInstruments.map((inst) => {
                  const isSelected = specification.instruments?.includes(inst);
                  return (
                    <button
                      key={inst}
                      onClick={() => toggleInstrument(inst)}
                      className={`p-2 rounded-xl text-xs font-medium text-left transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-accent-secondary/30 text-accent-primary border border-accent-secondary/60'
                          : 'bg-[#101016] text-text-muted hover:text-text border border-border'
                      }`}
                    >
                      <span className="truncate">{inst}</span>
                      {isSelected && <span className="text-[10px] text-accent-primary">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: PRODUCTION FX */}
          {activeTab === 'effects' && (
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">
                Acoustic & Production Processing Effects
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {effects.map((ef) => {
                  const isSelected = specification.production_effects?.some((e) =>
                    e.toLowerCase().includes(ef.toLowerCase())
                  );
                  return (
                    <button
                      key={ef}
                      onClick={() => toggleEffect(ef)}
                      className={`p-2.5 rounded-xl text-xs font-medium text-left transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-accent-secondary/30 text-accent-primary border border-accent-secondary/60'
                          : 'bg-[#101016] text-text-muted hover:text-text border border-border'
                      }`}
                    >
                      <span>{ef}</span>
                      {isSelected && <span className="text-[10px] text-accent-primary">ACTIVE</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: DYNAMICS */}
          {activeTab === 'dynamics' && (
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">
                Orchestral & Sonic Dynamics
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {dynamicsLevels.map((dyn) => {
                  const isSelected = specification.dynamics?.some((d) => d.includes(dyn.split(' ')[0]));
                  return (
                    <button
                      key={dyn}
                      onClick={() => {
                        const current = specification.dynamics || [];
                        if (isSelected) {
                          onChange({ dynamics: current.filter((d) => !d.includes(dyn.split(' ')[0])) });
                        } else {
                          onChange({ dynamics: [...current, dyn] });
                        }
                      }}
                      className={`p-2.5 rounded-xl text-xs font-medium text-center transition-colors ${
                        isSelected
                          ? 'bg-accent-secondary/30 text-accent-primary border border-accent-secondary/60'
                          : 'bg-[#101016] text-text-muted hover:text-text border border-border'
                      }`}
                    >
                      {dyn}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
