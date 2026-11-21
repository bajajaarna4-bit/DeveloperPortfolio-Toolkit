'use client';

import React, { useState } from 'react';
import {
  FolderKanban,
  Star,
  Copy,
  Trash2,
  Clock,
  Play,
  Layers,
  Search,
  Plus,
} from 'lucide-react';
import { Project } from '@/types/music';

interface ProjectsListProps {
  projects: Project[];
  onOpenProject: (project: Project) => void;
  onDuplicateProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onCreateNew: () => void;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  onOpenProject,
  onDuplicateProject,
  onDeleteProject,
  onToggleFavorite,
  onCreateNew,
}) => {
  const [search, setSearch] = useState('');
  const [filterGenre, setFilterGenre] = useState('All');

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    const matchesGenre = filterGenre === 'All' || p.genre === filterGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full bg-panel border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
            />
          </div>

          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            className="bg-panel border border-border rounded-xl px-3 py-2 text-xs text-text focus:outline-none focus:border-accent-primary"
          >
            <option value="All">All Genres</option>
            <option value="Cinematic">Cinematic</option>
            <option value="Lo-fi">Lo-fi</option>
            <option value="Electronic">Electronic</option>
            <option value="Classical">Classical</option>
          </select>
        </div>

        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-black bg-accent-primary hover:bg-violet-300 shadow-glow-primary transition-all"
        >
          <Plus className="h-4 w-4" />
          New Music Project
        </button>
      </div>

      {/* Projects Table / Cards */}
      <div className="divide-y divide-border/60 rounded-2xl bg-panel/80 border border-border overflow-hidden shadow-panel-soft">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-text-muted space-y-2">
            <FolderKanban className="h-10 w-10 mx-auto text-text-subtle" />
            <p className="text-sm font-semibold text-text">No projects found</p>
            <p className="text-xs">Create your first AI musical masterpiece above</p>
          </div>
        ) : (
          filtered.map((proj) => (
            <div
              key={proj.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-panel transition-colors group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <button
                  onClick={() => onToggleFavorite(proj.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    proj.isFavorite ? 'text-amber-400' : 'text-text-subtle hover:text-text-muted'
                  }`}
                  title="Favorite Project"
                >
                  <Star className="h-4 w-4 fill-current" />
                </button>

                <div
                  className="cursor-pointer min-w-0"
                  onClick={() => onOpenProject(proj)}
                >
                  <h4 className="text-sm font-bold text-text group-hover:text-accent-primary transition-colors truncate">
                    {proj.title}
                  </h4>
                  <p className="text-xs text-text-muted truncate mt-0.5">
                    {proj.description || 'Custom composition'}
                  </p>
                </div>
              </div>

              {/* Badges & Actions */}
              <div className="flex items-center gap-4 text-xs shrink-0">
                <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-text-muted">
                  <span className="px-2 py-0.5 rounded bg-[#101016] border border-border">
                    {proj.genre}
                  </span>
                  <span>{proj.bpm} BPM</span>
                  <span>•</span>
                  <span>{proj.keySignature}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenProject(proj)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-accent-secondary/20 hover:bg-accent-primary text-accent-primary hover:text-black border border-accent-secondary/40 transition-colors"
                  >
                    <Layers className="h-3.5 w-3.5" />
                    Open Studio
                  </button>

                  <button
                    onClick={() => onDuplicateProject(proj.id)}
                    className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-panel border border-transparent hover:border-border transition-colors"
                    title="Duplicate Project"
                  >
                    <Copy className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => onDeleteProject(proj.id)}
                    className="p-2 rounded-xl text-text-muted hover:text-danger hover:bg-panel border border-transparent hover:border-danger/30 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
