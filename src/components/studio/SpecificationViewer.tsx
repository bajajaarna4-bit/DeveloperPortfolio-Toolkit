'use client';

import React, { useState } from 'react';
import {
  FileCode,
  Music,
  CheckCircle2,
  Copy,
  Check,
  Activity,
  Layers,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { MusicSpecification } from '@/types/music';

interface SpecificationViewerProps {
  specification: MusicSpecification;
  enhancedPrompt?: string;
}

export const SpecificationViewer: React.FC<SpecificationViewerProps> = ({
  specification,
  enhancedPrompt,
}) => {
  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(specification, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-panel/90 border border-border p-5 shadow-panel-soft backdrop-blur-xl">
      <div className="flex items-center justify-between pb-3 border-b border-border/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-accent-secondary/20 text-accent-primary">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text flex items-center gap-2">
              AI Music Theory Specification
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-success/20 text-success border border-success/30 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Validated Architecture
              </span>
            </h3>
            <p className="text-[11px] text-text-muted">
              Deep musical analysis, voice-leading rules, and harmonic arrangement plan
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowJson(!showJson)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-colors ${
            showJson
              ? 'bg-accent-secondary/20 text-accent-primary border border-accent-secondary/40'
              : 'text-text-muted hover:text-text bg-panel border border-border'
          }`}
        >
          <FileCode className="h-3.5 w-3.5" />
          {showJson ? 'Visual Specs' : 'Raw JSON'}
        </button>
      </div>

      {showJson ? (
        <div className="mt-3 relative">
          <button
            onClick={handleCopyJson}
            className="absolute right-3 top-3 p-1.5 rounded-lg bg-[#1D1D28] text-text-muted hover:text-text border border-border text-xs flex items-center gap-1 transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <pre className="p-4 rounded-xl bg-[#0B0B10] border border-border/80 text-xs font-mono text-accent-primary overflow-x-auto max-h-80 leading-relaxed">
            {JSON.stringify(specification, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="mt-4 space-y-4 text-xs">
          {/* Top Quick Attributes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-[#101016] border border-border">
              <span className="text-text-muted text-[10px] uppercase font-mono block">Key & Mode</span>
              <span className="font-bold text-text text-sm">{specification.key}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#101016] border border-border">
              <span className="text-text-muted text-[10px] uppercase font-mono block">Tempo & Meter</span>
              <span className="font-bold text-text text-sm">
                {specification.bpm} BPM • {specification.time_signature}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#101016] border border-border">
              <span className="text-text-muted text-[10px] uppercase font-mono block">Genre Archetype</span>
              <span className="font-bold text-text text-sm truncate block">{specification.subgenre || specification.genre}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#101016] border border-border">
              <span className="text-text-muted text-[10px] uppercase font-mono block">Target Duration</span>
              <span className="font-bold text-text text-sm">{specification.duration || '2:15'}</span>
            </div>
          </div>

          {/* Chord Progression */}
          <div className="p-3.5 rounded-xl bg-[#101016] border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-text flex items-center gap-1.5">
                <Music className="h-3.5 w-3.5 text-accent-primary" />
                Harmonic Chord Progression
              </span>
              <span className="text-[10px] font-mono text-text-muted">Cadence & Voice Leading</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {specification.chord_progression?.map((chord, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-panel border border-accent-secondary/40 text-accent-primary font-mono font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <span className="text-[10px] text-text-muted">#{idx + 1}</span>
                  {chord}
                </div>
              ))}
            </div>
          </div>

          {/* Song Structure Timeline */}
          {specification.song_structure && specification.song_structure.length > 0 && (
            <div className="p-3.5 rounded-xl bg-[#101016] border border-border space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-text flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-accent-primary" />
                  Arrangement Structure & Dynamics Flow
                </span>
                <span className="text-[10px] text-text-muted">Bars & Intensities (1-10)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                {specification.song_structure.map((sec, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-panel/70 border border-border space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text">{sec.name}</span>
                      <span className="font-mono text-[10px] text-text-muted">{sec.bars} bars</span>
                    </div>
                    <div className="w-full bg-[#0D0D14] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-primary rounded-full"
                        style={{ width: `${(sec.intensity / 10) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-text-muted line-clamp-2 leading-relaxed">
                      {sec.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Melodic & Rhythm Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-[#101016] border border-border">
              <span className="font-semibold text-text block mb-1">Melodic Style</span>
              <p className="text-text-muted leading-relaxed">{specification.melodic_style}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#101016] border border-border">
              <span className="font-semibold text-text block mb-1">Rhythm & Groove</span>
              <p className="text-text-muted leading-relaxed">{specification.rhythm_style}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
