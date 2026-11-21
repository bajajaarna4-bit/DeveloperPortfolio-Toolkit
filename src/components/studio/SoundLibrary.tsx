'use client';

import React, { useState } from 'react';
import {
  Flame,
  Play,
  Pause,
  Download,
  Copy,
  Sparkles,
  Music,
  Share2,
} from 'lucide-react';

interface SoundItem {
  id: string;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  key: string;
  plays: string;
  prompt: string;
}

export const SoundLibrary: React.FC<{ onLoadPrompt: (prompt: string) => void }> = ({ onLoadPrompt }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const curatedSounds: SoundItem[] = [
    {
      id: 'snd-1',
      title: 'Neon Odyssey (Synthwave Master)',
      artist: 'AI Producer Unit 01',
      genre: 'Electronic',
      bpm: 118,
      key: 'F minor',
      plays: '42.8k',
      prompt: 'An ethereal cyberpunk synthwave journey with shimmering analog arpeggios, nostalgic DX7 synth leads, driving 808 sidechained bassline, and punchy LinnDrum percussion. 118 BPM, F minor.',
    },
    {
      id: 'snd-2',
      title: 'Echoes of the Colosseum',
      artist: 'Orchestral AI Guild',
      genre: 'Cinematic',
      bpm: 88,
      key: 'A minor',
      plays: '68.4k',
      prompt: 'A dark cinematic orchestral soundtrack with emotional piano, atmospheric strings, deep cinematic percussion, a slow build-up, dramatic tension, and an explosive orchestral climax. Use A minor, 88 BPM, and a powerful Hollywood-style sound.',
    },
    {
      id: 'snd-3',
      title: 'Coffee Beans & Sunday Rain',
      artist: 'Lo-Fi ChillBot',
      genre: 'Lo-fi',
      bpm: 78,
      key: 'C Major',
      plays: '89.2k',
      prompt: 'A warm, rain-soaked lo-fi hip hop groove with vintage Rhodes electric piano chords, dusty vinyl crackle, mellow acoustic bassline, tape warble, and relaxed unquantized drum swing. 78 BPM, C Major.',
    },
    {
      id: 'snd-4',
      title: 'Quantum Horizon (Melodic Techno)',
      artist: 'Berlin AI Lab',
      genre: 'Techno',
      bpm: 126,
      key: 'G minor',
      plays: '31.5k',
      prompt: 'Driving melodic techno featuring a powerful rolling rumble kick, emotive analog saw leads, dramatic filter sweeps, cavernous reverb, and a spine-tingling breakdown into a high-energy drop. 126 BPM, G minor.',
    },
  ];

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    onLoadPrompt(prompt);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-panel to-[#1D1D2B] border border-border shadow-panel-soft flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-text flex items-center gap-2">
            <Flame className="h-6 w-6 text-amber-400" />
            Curated Community & AI Sound Library
          </h2>
          <p className="text-xs text-text-muted mt-1 max-w-xl leading-relaxed">
            Discover award-winning AI compositions, inspect their underlying music theory specifications, and use their prompts directly in your own studio projects.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {curatedSounds.map((snd) => (
          <div
            key={snd.id}
            className="p-5 rounded-2xl bg-panel/80 hover:bg-panel border border-border hover:border-accent-primary/40 shadow-panel-soft transition-all space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPlayingId(playingId === snd.id ? null : snd.id)}
                  className="w-10 h-10 rounded-xl bg-accent-primary text-black flex items-center justify-center shadow-glow-primary hover:bg-violet-300 transition-colors"
                >
                  {playingId === snd.id ? (
                    <Pause className="h-5 w-5 fill-current" />
                  ) : (
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  )}
                </button>
                <div>
                  <h4 className="text-sm font-bold text-text">{snd.title}</h4>
                  <span className="text-xs text-text-muted">{snd.artist}</span>
                </div>
              </div>

              <span className="text-[11px] font-mono text-accent-primary bg-[#101016] px-2.5 py-1 rounded-lg border border-border">
                {snd.genre} • {snd.bpm} BPM
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#0D0D14] border border-border/60 text-xs text-text-muted font-mono leading-relaxed line-clamp-3">
              "{snd.prompt}"
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
              <span className="text-text-muted font-mono">{snd.plays} plays</span>
              <button
                onClick={() => handleCopyPrompt(snd.prompt)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-secondary/20 hover:bg-accent-primary text-accent-primary hover:text-black border border-accent-secondary/40 font-semibold transition-all"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Use in Studio
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
