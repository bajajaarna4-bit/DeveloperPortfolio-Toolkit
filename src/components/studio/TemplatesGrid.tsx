'use client';

import React, { useState } from 'react';
import {
  Film,
  Music2,
  Sparkles,
  Moon,
  Coffee,
  Headphones,
  Disc,
  Zap,
  Flame,
  Radio,
  Heart,
  Feather,
  Skull,
  Gamepad2,
  Waves,
  Briefcase,
  Play,
  ArrowRight,
} from 'lucide-react';
import { MUSIC_TEMPLATES } from '@/lib/storage/templates';
import { MusicTemplate } from '@/types/music';

interface TemplatesGridProps {
  onSelectTemplate: (template: MusicTemplate) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Film,
  Music2,
  Sparkles,
  Moon,
  Coffee,
  Headphones,
  Disc,
  Zap,
  Flame,
  Radio,
  Heart,
  Feather,
  Skull,
  Gamepad2,
  Waves,
  Briefcase,
};

export const TemplatesGrid: React.FC<TemplatesGridProps> = ({ onSelectTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Cinematic', 'Electronic', 'Hip-Hop', 'Acoustic', 'Ambient'];

  const filtered = MUSIC_TEMPLATES.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.genre.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Category Filter Pills & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === c
                  ? 'bg-accent-primary text-black font-bold shadow-glow-primary'
                  : 'bg-panel text-text-muted hover:text-text border border-border'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search templates..."
          className="bg-panel border border-border rounded-xl px-4 py-2 text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-accent-primary w-64"
        />
      </div>

      {/* Grid of 16 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((t) => {
          const IconComponent = ICON_MAP[t.icon] || Sparkles;
          return (
            <div
              key={t.id}
              className="p-5 rounded-2xl bg-panel/80 hover:bg-panel border border-border hover:border-accent-primary/50 shadow-panel-soft transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-accent-secondary/20 text-accent-primary group-hover:scale-110 transition-transform shadow-glow-primary">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#111118] border border-border text-text-muted">
                    {t.genre}
                  </span>
                </div>

                <h3 className="text-base font-bold text-text group-hover:text-accent-primary transition-colors">
                  {t.title}
                </h3>
                <p className="text-xs text-text-muted mt-1.5 leading-relaxed line-clamp-2">
                  {t.description}
                </p>

                <div className="flex items-center gap-2 mt-3 text-[11px] font-mono text-accent-primary">
                  <span>{t.bpm} BPM</span>
                  <span>•</span>
                  <span>{t.key}</span>
                  <span>•</span>
                  <span>{t.timeSignature}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {t.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-[#101016] text-text-muted"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => onSelectTemplate(t)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-accent-secondary/20 hover:bg-accent-primary text-accent-primary hover:text-black border border-accent-secondary/40 hover:border-accent-primary transition-all shadow-sm"
                >
                  Use Template
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
