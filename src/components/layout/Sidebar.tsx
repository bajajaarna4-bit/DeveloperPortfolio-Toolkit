'use client';

import React from 'react';
import {
  Wand2,
  Sliders,
  FolderKanban,
  Compass,
  BookmarkCheck,
  Disc3,
  Clock,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Piano,
  Flame,
} from 'lucide-react';

export type NavView =
  | 'home'
  | 'create'
  | 'arrangement'
  | 'piano-roll'
  | 'projects'
  | 'discover'
  | 'templates'
  | 'sound-library'
  | 'favorites'
  | 'recently-played'
  | 'settings';

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  credits: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  collapsed,
  onToggleCollapse,
  credits,
}) => {
  const mainNavItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'create', label: 'Create Music', icon: Wand2, highlight: true },
    { id: 'arrangement', label: 'Arrangement DAW', icon: Layers },
    { id: 'piano-roll', label: 'Piano Roll & MIDI', icon: Piano },
    { id: 'projects', label: 'My Projects', icon: FolderKanban },
    { id: 'discover', label: 'Discover', icon: Flame },
    { id: 'templates', label: 'Templates', icon: Sliders },
    { id: 'sound-library', label: 'Sound Library', icon: Disc3 },
    { id: 'favorites', label: 'Favorites', icon: BookmarkCheck },
    { id: 'recently-played', label: 'Recently Played', icon: Clock },
  ];

  return (
    <aside
      className={`relative flex flex-col justify-between border-r border-border bg-[#0B0B10] transition-all duration-300 z-30 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Branding */}
      <div>
        <div className="flex h-16 items-center justify-between px-4 border-b border-border/80">
          {!collapsed ? (
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => onSelectView('home')}
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary shadow-glow-primary">
                <Sparkles className="h-5 w-5 text-white animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold tracking-wider text-base text-text flex items-center gap-1.5">
                  SONORA <span className="text-xs px-1.5 py-0.5 rounded bg-accent-secondary/20 text-accent-primary font-mono border border-accent-secondary/40">AI</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase text-text-muted">Studio DAW</span>
              </div>
            </div>
          ) : (
            <div
              className="flex h-10 w-10 mx-auto items-center justify-center rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary shadow-glow-primary cursor-pointer"
              onClick={() => onSelectView('home')}
            >
              <Sparkles className="h-5 w-5 text-white" />
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className={`p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-panel border border-transparent hover:border-border transition-colors ${
              collapsed ? 'hidden' : 'block'
            }`}
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-230px)]">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id as NavView)}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-panel-subtle text-text border border-accent-primary/40 shadow-glow-primary'
                    : 'text-text-muted hover:text-text hover:bg-panel/60 border border-transparent'
                } ${item.highlight && !isActive ? 'hover:border-accent-primary/30' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <div
                  className={`flex items-center justify-center rounded-lg p-1 transition-colors ${
                    isActive
                      ? 'text-accent-primary'
                      : 'text-text-muted group-hover:text-accent-primary'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                {!collapsed && (
                  <span className="truncate flex-1 text-left flex items-center justify-between">
                    {item.label}
                    {item.highlight && (
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-accent-secondary/20 text-accent-primary border border-accent-secondary/40">
                        AI
                      </span>
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile, Credits, Settings */}
      <div className="p-3 border-t border-border/80 space-y-3 bg-[#0B0B10]">
        {!collapsed && (
          <div className="p-3 rounded-xl bg-panel/80 border border-border">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-text-muted flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-accent-primary" />
                Generation Credits
              </span>
              <span className="font-mono font-bold text-accent-primary">{credits}/200</span>
            </div>
            <div className="w-full bg-[#111118] h-1.5 rounded-full overflow-hidden border border-border">
              <div
                className="h-full bg-gradient-to-r from-accent-secondary to-accent-primary transition-all duration-500 rounded-full"
                style={{ width: `${(credits / 200) * 100}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-border/50 text-[11px]">
              <span className="text-success font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Pro Studio Plan
              </span>
              <button
                onClick={() => onSelectView('settings')}
                className="text-text-muted hover:text-accent-primary underline transition-colors"
              >
                Top up
              </button>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <button
            onClick={() => onSelectView('settings')}
            className={`w-full flex items-center gap-3.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              currentView === 'settings'
                ? 'bg-panel text-text border border-border'
                : 'text-text-muted hover:text-text hover:bg-panel/50'
            }`}
            title="Settings"
          >
            <Settings className="h-4 w-4 text-text-muted" />
            {!collapsed && <span>Settings</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};
