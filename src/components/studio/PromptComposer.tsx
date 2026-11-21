'use client';

import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  Shuffle,
  Trash2,
  Mic,
  Music,
  FileText,
  Radio,
  Split,
  Repeat,
  History,
  Send,
  Loader2,
} from 'lucide-react';
import { GenerationMode, MusicSpecification } from '@/types/music';
import { INSPIRATION_PROMPTS } from '@/lib/musicTheory/engine';

interface PromptComposerProps {
  prompt: string;
  onPromptChange: (newPrompt: string) => void;
  onGenerate: () => void;
  onEnhance: () => void;
  isGenerating: boolean;
  isEnhancing: boolean;
  generationProgress: number;
  generationStatusText: string;
  generationMode: GenerationMode;
  onSelectMode: (mode: GenerationMode) => void;
  lyrics: string;
  onLyricsChange: (lyrics: string) => void;
  specification?: MusicSpecification;
}

export const PromptComposer: React.FC<PromptComposerProps> = ({
  prompt,
  onPromptChange,
  onGenerate,
  onEnhance,
  isGenerating,
  isEnhancing,
  generationProgress,
  generationStatusText,
  generationMode,
  onSelectMode,
  lyrics,
  onLyricsChange,
  specification,
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [promptHistory, setPromptHistory] = useState<string[]>([
    'A dark cinematic orchestral soundtrack with emotional piano, atmospheric strings, deep cinematic percussion, a slow build-up, dramatic tension, and an explosive orchestral climax. Use A minor, 88 BPM, and a powerful Hollywood-style sound.',
    'A warm, rain-soaked lo-fi hip hop groove with vintage Rhodes electric piano chords, dusty vinyl crackle, mellow acoustic bassline, tape warble, and relaxed unquantized drum swing. 78 BPM, C Major.',
    'Deep hypnotic melodic techno with warm analog modular basslines, intricate percussion layers, atmospheric reverb washes, and a hypnotic rolling groove. 124 BPM, G minor.',
  ]);

  const modes: { id: GenerationMode; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'text_to_music', label: 'Text to Music', icon: Wand2 },
    { id: 'instrumental', label: 'Instrumental', icon: Music },
    { id: 'song_with_vocals', label: 'Song with Vocals', icon: Mic },
    { id: 'lyrics_to_song', label: 'Lyrics to Song', icon: FileText },
    { id: 'melody_to_music', label: 'Melody to Music', icon: Radio },
    { id: 'extension', label: 'Music Extension', icon: Split },
    { id: 'variation', label: 'Music Variation', icon: Repeat },
  ];

  const handleRandomInspiration = () => {
    const random = INSPIRATION_PROMPTS[Math.floor(Math.random() * INSPIRATION_PROMPTS.length)];
    onPromptChange(random);
  };

  const handleClear = () => {
    onPromptChange('');
  };

  const handleSelectHistory = (item: string) => {
    onPromptChange(item);
    setShowHistory(false);
  };

  return (
    <div className="rounded-2xl bg-panel/90 border border-border p-5 shadow-panel-soft backdrop-blur-xl relative overflow-hidden">
      {/* Top Bar: Mode Selector & History */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-border/80">
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
          {modes.map((m) => {
            const Icon = m.icon;
            const isSelected = generationMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectMode(m.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-accent-secondary/20 text-accent-primary border border-accent-secondary/50 shadow-glow-primary'
                    : 'text-text-muted hover:text-text hover:bg-panel border border-transparent'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {m.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
            showHistory
              ? 'bg-[#1E1E2B] text-accent-primary border-accent-primary/40'
              : 'text-text-muted hover:text-text hover:bg-panel border-border'
          }`}
        >
          <History className="h-3.5 w-3.5" />
          Prompt History
        </button>
      </div>

      {/* Prompt History Drawer */}
      {showHistory && (
        <div className="mb-4 p-3 rounded-xl bg-[#12121A] border border-border space-y-2 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between text-xs text-text-muted font-medium pb-1 border-b border-border/50">
            <span>Recent Musical Prompts</span>
            <span className="text-[10px]">Click any to load</span>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {promptHistory.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectHistory(item)}
                className="p-2 rounded-lg bg-panel/60 hover:bg-panel hover:border-accent-primary/40 border border-transparent cursor-pointer text-xs text-text-muted hover:text-text transition-colors line-clamp-2"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Text Editor */}
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Describe the music in your imagination... Example: An emotional cinematic piano composition that slowly evolves into a powerful orchestral soundtrack with atmospheric strings, heavy brass, and epic taiko percussion. Use A minor, 88 BPM, and a Hollywood climax."
          rows={4}
          className="w-full bg-[#101016] border border-border/80 focus:border-accent-primary/60 rounded-xl p-4 text-sm text-text placeholder:text-text-subtle focus:outline-none transition-all resize-y min-h-[110px] leading-relaxed font-sans"
        />

        {/* Character Counter */}
        <div className="absolute right-3 bottom-3 text-[11px] font-mono text-text-muted/70 bg-[#101016]/80 px-2 py-0.5 rounded">
          {prompt.length} / 1000
        </div>
      </div>

      {/* Lyrics Editor (when in Lyrics to Song or Song with Vocals mode) */}
      {(generationMode === 'lyrics_to_song' || generationMode === 'song_with_vocals') && (
        <div className="mt-3 p-3.5 rounded-xl bg-[#101016] border border-border/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="font-semibold text-text flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-accent-primary" />
              Song Lyrics & Vocal Cadence
            </span>
            <span className="text-[11px] font-mono text-accent-primary">[Verse / Chorus / Outro]</span>
          </div>
          <textarea
            value={lyrics}
            onChange={(e) => onLyricsChange(e.target.value)}
            placeholder="[Verse 1]&#10;Shadows creeping across the floor&#10;Echoes of what came before...&#10;&#10;[Chorus]&#10;Rise like lightning in the night&#10;Turn the darkness into light..."
            rows={3}
            className="w-full bg-panel/70 border border-border rounded-lg p-3 text-xs text-text placeholder:text-text-subtle focus:outline-none focus:border-accent-primary/50 font-mono resize-y"
          />
        </div>
      )}

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-border/80">
        {/* Left Utility Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onEnhance}
            disabled={!prompt.trim() || isEnhancing || isGenerating}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-panel hover:bg-panel-subtle text-accent-primary border border-border hover:border-accent-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title="Translate simple description into rich music theory and acoustic specification"
          >
            {isEnhancing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 text-accent-primary" />
            )}
            Enhance Prompt
          </button>

          <button
            onClick={handleRandomInspiration}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-text-muted hover:text-text bg-panel/50 hover:bg-panel border border-border hover:border-border-light transition-colors"
            title="Get an inspiring professional music composition prompt"
          >
            <Shuffle className="h-3.5 w-3.5" />
            Inspiration
          </button>

          <button
            onClick={handleClear}
            disabled={!prompt || isGenerating}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-text-muted hover:text-danger bg-panel/50 hover:bg-panel border border-border hover:border-danger/30 transition-colors disabled:opacity-30"
            title="Clear prompt"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>
        </div>

        {/* Right Primary Generate Button & Progress */}
        <div className="flex items-center gap-3">
          {isGenerating && (
            <div className="flex items-center gap-2.5 text-xs text-text-muted">
              <Loader2 className="h-4 w-4 animate-spin text-accent-primary" />
              <div className="flex flex-col">
                <span className="text-text font-medium">{generationStatusText}</span>
                <span className="text-[10px] text-accent-primary font-mono">{generationProgress}% completed</span>
              </div>
            </div>
          )}

          <button
            onClick={onGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-accent-secondary to-accent-primary hover:from-purple-600 hover:to-indigo-500 shadow-glow-primary hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Synthesizing...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                Generate Music
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
