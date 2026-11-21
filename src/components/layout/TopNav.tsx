'use client';

import React, { useState } from 'react';
import {
  Search,
  Bell,
  Coins,
  Crown,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  Headphones,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface TopNavProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  credits: number;
  onOpenSettings: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  searchQuery,
  onSearchChange,
  credits,
  onOpenSettings,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Composition Synthesized',
      message: '"Interstellar Horizons" rendered in A minor (88 BPM).',
      time: '10m ago',
      read: false,
    },
    {
      id: 2,
      title: 'Monthly Credits Refreshed',
      message: '200 Pro Studio generation credits added to your account.',
      time: '1h ago',
      read: true,
    },
    {
      id: 3,
      title: 'New AI Model Online',
      message: 'SONORA High-Fidelity Multi-Track Engine is active.',
      time: '1d ago',
      read: true,
    },
  ];

  return (
    <header className="h-16 border-b border-border bg-[#0B0B10]/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Global Search Bar */}
      <div className="flex items-center w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search projects, prompts, genres, or MIDI sequences... (Ctrl+K)"
            className="w-full bg-panel/70 border border-border rounded-xl pl-10 pr-12 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent-primary/60 transition-colors"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-text-muted bg-[#111118] border border-border rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls: Credits, Pro Badge, Notifications, Avatar */}
      <div className="flex items-center gap-3">
        {/* Credits Badge */}
        <div
          onClick={onOpenSettings}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-panel border border-border hover:border-accent-primary/40 cursor-pointer transition-colors"
          title="Usage Credits"
        >
          <Coins className="h-4 w-4 text-amber-400" />
          <span className="text-xs font-semibold text-text font-mono">{credits}</span>
          <span className="text-[11px] text-text-muted">Credits</span>
        </div>

        {/* Subscription Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-accent-secondary/20 to-accent-primary/20 border border-accent-primary/30 text-xs font-semibold text-accent-primary">
          <Crown className="h-3.5 w-3.5" />
          <span>Pro Studio</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-panel border border-transparent hover:border-border transition-colors relative"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-panel border border-border shadow-panel-soft p-3 z-50 animate-in fade-in-50 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-border text-xs">
                <span className="font-semibold text-text">Notifications</span>
                <span className="text-accent-primary cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl text-xs transition-colors ${
                      !n.read ? 'bg-[#1D1D28] border border-accent-primary/20' : 'hover:bg-[#12121A]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-text font-medium mb-1">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-text-muted">{n.time}</span>
                    </div>
                    <p className="text-text-muted text-[11px] leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 pl-2 rounded-xl hover:bg-panel border border-transparent hover:border-border transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-primary to-accent-secondary flex items-center justify-center text-white font-bold text-xs ring-2 ring-accent-primary/30">
              SO
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-text-muted hidden md:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-panel border border-border shadow-panel-soft p-2 z-50 animate-in fade-in-50 duration-150">
              <div className="px-3 py-2 border-b border-border mb-1">
                <p className="text-sm font-semibold text-text">Sonora Producer</p>
                <p className="text-[11px] text-text-muted font-mono truncate">producer@sonora.ai</p>
              </div>

              <div className="space-y-0.5 text-xs text-text-muted">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenSettings();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:text-text hover:bg-[#1D1D28] text-left transition-colors"
                >
                  <Sliders className="h-3.5 w-3.5" />
                  Studio Settings
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenSettings();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:text-text hover:bg-[#1D1D28] text-left transition-colors"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  API Providers & Keys
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenSettings();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:text-text hover:bg-[#1D1D28] text-left transition-colors"
                >
                  <Headphones className="h-3.5 w-3.5" />
                  Audio Buffer & Sample Rate
                </button>
              </div>

              <div className="border-t border-border mt-1 pt-1">
                <div className="px-3 py-1.5 text-[11px] text-success flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3" />
                  Web Audio Engine Ready
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
