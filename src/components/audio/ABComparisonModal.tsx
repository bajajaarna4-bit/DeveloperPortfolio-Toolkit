'use client';

import React, { useState } from 'react';
import {
  X,
  SplitSquareVertical,
  Play,
  Pause,
  Sliders,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface ABComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  titleA: string;
  titleB?: string;
  audioUrlA?: string;
  audioUrlB?: string;
}

export const ABComparisonModal: React.FC<ABComparisonModalProps> = ({
  isOpen,
  onClose,
  titleA,
  titleB = 'Variation A/B (Enhanced Dynamics)',
  audioUrlA,
  audioUrlB,
}) => {
  const [crossfade, setCrossfade] = useState(0.5); // 0 = 100% A, 1 = 100% B
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl bg-panel border border-border shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-panel-subtle"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-accent-secondary/20 text-accent-primary">
            <SplitSquareVertical className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-text">A/B Master Audio Comparison</h2>
            <p className="text-xs text-text-muted">
              Audition nuances between original generation and acoustic variations
            </p>
          </div>
        </div>

        {/* Visual Slots */}
        <div className="grid grid-cols-2 gap-4 my-6">
          {/* Deck A */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              crossfade < 0.5
                ? 'bg-accent-secondary/15 border-accent-primary/60 shadow-glow-primary'
                : 'bg-[#101016] border-border'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-mono font-bold text-accent-primary">DECK A (Original)</span>
              <span className="text-[10px] text-text-muted font-mono">{Math.round((1 - crossfade) * 100)}%</span>
            </div>
            <p className="text-sm font-semibold text-text truncate">{titleA}</p>
            <p className="text-xs text-text-muted mt-1">Full orchestral master with wide stereo panning</p>
          </div>

          {/* Deck B */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              crossfade > 0.5
                ? 'bg-accent-secondary/15 border-accent-primary/60 shadow-glow-primary'
                : 'bg-[#101016] border-border'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-mono font-bold text-accent-primary">DECK B (Variation)</span>
              <span className="text-[10px] text-text-muted font-mono">{Math.round(crossfade * 100)}%</span>
            </div>
            <p className="text-sm font-semibold text-text truncate">{titleB}</p>
            <p className="text-xs text-text-muted mt-1">Enhanced dynamic build with tape harmonic saturation</p>
          </div>
        </div>

        {/* Crossfader */}
        <div className="p-4 rounded-xl bg-[#0D0D14] border border-border mb-6">
          <div className="flex justify-between text-xs font-semibold text-text mb-2">
            <span>Deck A</span>
            <span className="font-mono text-accent-primary">Crossfader Position</span>
            <span>Deck B</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={crossfade}
            onChange={(e) => setCrossfade(parseFloat(e.target.value))}
            className="w-full h-3 bg-border rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-text-muted font-mono mt-1">
            <span>100% Deck A</span>
            <span>50 / 50 Blend</span>
            <span>100% Deck B</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-text-muted hover:text-text hover:bg-panel border border-border"
          >
            Close
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-black bg-accent-primary hover:bg-violet-300 shadow-glow-primary transition-all"
          >
            Select Current Deck as Master
          </button>
        </div>
      </div>
    </div>
  );
};
