'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Square,
  Repeat,
  ZoomIn,
  ZoomOut,
  Plus,
  Volume2,
  VolumeX,
  Trash2,
  Copy,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ArrangementTrack, TrackClip } from '@/types/music';
import { toneEngine } from '@/lib/audio/tonePlayer';

interface ArrangementEditorProps {
  tracks: ArrangementTrack[];
  onTracksChange: (tracks: ArrangementTrack[]) => void;
  bpm: number;
}

export const ArrangementEditor: React.FC<ArrangementEditorProps> = ({
  tracks,
  onTracksChange,
  bpm,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBar, setCurrentBar] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(48); // pixels per bar
  const [isLooping, setIsLooping] = useState(true);
  const totalBars = 16;
  const playheadInterval = useRef<NodeJS.Timeout | null>(null);

  // Toggle Track Mute
  const handleToggleMute = (trackId: string) => {
    onTracksChange(
      tracks.map((t) => (t.id === trackId ? { ...t, muted: !t.muted } : t))
    );
  };

  // Toggle Track Solo
  const handleToggleSolo = (trackId: string) => {
    onTracksChange(
      tracks.map((t) => (t.id === trackId ? { ...t, solo: !t.solo } : t))
    );
  };

  // Change Track Volume
  const handleVolumeChange = (trackId: string, vol: number) => {
    onTracksChange(
      tracks.map((t) => (t.id === trackId ? { ...t, volume: vol } : t))
    );
  };

  // Duplicate Track
  const handleDuplicateTrack = (trackId: string) => {
    const orig = tracks.find((t) => t.id === trackId);
    if (!orig) return;
    const dup: ArrangementTrack = {
      ...orig,
      id: `trk-${Date.now()}`,
      name: `${orig.name} (Copy)`,
      clips: orig.clips.map((c) => ({ ...c, id: `clip-${Date.now()}-${Math.random()}` })),
    };
    onTracksChange([...tracks, dup]);
  };

  // Delete Track
  const handleDeleteTrack = (trackId: string) => {
    if (tracks.length <= 1) return;
    onTracksChange(tracks.filter((t) => t.id !== trackId));
  };

  // Play / Pause Arrangement
  const handlePlay = async () => {
    if (isPlaying) {
      toneEngine.stop();
      setIsPlaying(false);
      if (playheadInterval.current) clearInterval(playheadInterval.current);
    } else {
      setIsPlaying(true);
      await toneEngine.playArrangement(tracks, bpm, (bar) => {
        setCurrentBar(bar);
      });

      // UI smooth playhead updater
      const secondsPerBar = (60 / bpm) * 4;
      const stepMs = 50;
      const barStep = (stepMs / 1000) / secondsPerBar;

      playheadInterval.current = setInterval(() => {
        setCurrentBar((prev) => {
          const next = prev + barStep;
          if (next >= 8) {
            return isLooping ? 0 : 8;
          }
          return next;
        });
      }, stepMs);
    }
  };

  const handleStop = () => {
    toneEngine.stop();
    setIsPlaying(false);
    setCurrentBar(0);
    if (playheadInterval.current) clearInterval(playheadInterval.current);
  };

  useEffect(() => {
    return () => {
      if (playheadInterval.current) clearInterval(playheadInterval.current);
      toneEngine.stop();
    };
  }, []);

  return (
    <div className="rounded-2xl bg-panel/90 border border-border shadow-panel-soft backdrop-blur-xl overflow-hidden flex flex-col h-[600px]">
      {/* Top DAW Transport Bar */}
      <div className="h-14 bg-[#101016] border-b border-border px-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePlay}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isPlaying
                ? 'bg-amber-500 text-black shadow-amber-500/20'
                : 'bg-accent-primary text-black hover:bg-violet-300 shadow-glow-primary'
            }`}
          >
            {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
            {isPlaying ? 'Pause' : 'Play Timeline'}
          </button>

          <button
            onClick={handleStop}
            className="p-2 rounded-xl text-text-muted hover:text-text bg-panel border border-border transition-colors"
            title="Stop & Reset Playhead"
          >
            <Square className="h-4 w-4" />
          </button>

          <button
            onClick={() => setIsLooping(!isLooping)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              isLooping
                ? 'bg-accent-secondary/20 text-accent-primary border-accent-secondary/50'
                : 'text-text-muted border-border hover:bg-panel'
            }`}
            title="Toggle 8-bar loop"
          >
            <Repeat className="h-3.5 w-3.5" />
            Loop (Bars 1-8)
          </button>

          <div className="h-5 w-px bg-border mx-1" />

          {/* Time display */}
          <div className="px-3 py-1 rounded-lg bg-[#0A0A0F] border border-border text-xs font-mono text-accent-primary">
            Bar {Math.floor(currentBar) + 1}.{Math.floor((currentBar % 1) * 4) + 1}.0
          </div>
        </div>

        {/* Right Tools: Zoom & Track count */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomLevel((z) => Math.max(30, z - 8))}
            className="p-1.5 rounded-lg text-text-muted hover:text-text bg-panel border border-border"
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="text-[11px] font-mono text-text-muted">{zoomLevel}px/bar</span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(90, z + 8))}
            className="p-1.5 rounded-lg text-text-muted hover:text-text bg-panel border border-border"
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Multitrack Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Track Headers Column */}
        <div className="w-64 bg-[#0D0D14] border-r border-border flex flex-col shrink-0 overflow-y-auto">
          {/* Header spacer aligned with ruler */}
          <div className="h-9 border-b border-border px-3 flex items-center justify-between text-xs text-text-muted font-semibold bg-[#111118]">
            <span>Tracks ({tracks.length})</span>
            <span className="text-[10px] uppercase font-mono">Vol / Pan</span>
          </div>

          {/* Track Headers List */}
          <div className="divide-y divide-border/40">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="h-16 px-3 py-2 flex flex-col justify-between hover:bg-[#14141E] transition-colors group relative"
              >
                {/* Track color bar indicator */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ backgroundColor: track.color }}
                />

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text truncate max-w-[120px]">
                    {track.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleMute(track.id)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                        track.muted
                          ? 'bg-danger text-white'
                          : 'bg-[#181824] text-text-muted hover:text-text'
                      }`}
                      title="Mute Track"
                    >
                      M
                    </button>
                    <button
                      onClick={() => handleToggleSolo(track.id)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                        track.solo
                          ? 'bg-amber-400 text-black'
                          : 'bg-[#181824] text-text-muted hover:text-text'
                      }`}
                      title="Solo Track"
                    >
                      S
                    </button>
                    <button
                      onClick={() => handleDuplicateTrack(track.id)}
                      className="p-1 text-text-muted hover:text-text opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Duplicate Track"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteTrack(track.id)}
                      className="p-1 text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete Track"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Track Volume Slider */}
                <div className="flex items-center gap-2">
                  <Volume2 className="h-3 w-3 text-text-muted shrink-0" />
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={track.volume}
                    onChange={(e) => handleVolumeChange(track.id, parseFloat(e.target.value))}
                    className="w-full h-1 bg-[#1A1A26] rounded cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-text-muted shrink-0 w-7 text-right">
                    {Math.round(track.volume * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline & Track Lanes Area */}
        <div className="flex-1 flex flex-col overflow-x-auto relative">
          {/* Top Timeline Ruler */}
          <div className="h-9 bg-[#111118] border-b border-border flex items-center relative shrink-0 select-none">
            {Array.from({ length: totalBars }).map((_, barIdx) => (
              <div
                key={barIdx}
                className="h-full border-r border-border/40 flex items-center px-1.5 text-[10px] font-mono text-text-muted shrink-0"
                style={{ width: `${zoomLevel}px` }}
              >
                {barIdx + 1}
              </div>
            ))}

            {/* Visual Playhead cursor */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-accent-primary z-30 pointer-events-none transition-all duration-75"
              style={{ left: `${currentBar * zoomLevel}px` }}
            >
              <div className="w-2.5 h-2.5 -ml-1 bg-accent-primary rotate-45 rounded-sm shadow-glow-primary" />
            </div>
          </div>

          {/* Track Lanes with Clips */}
          <div className="relative divide-y divide-border/40 min-w-max">
            {/* Playhead line continuing through all tracks */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-accent-primary/80 z-20 pointer-events-none transition-all duration-75 shadow-glow-primary"
              style={{ left: `${currentBar * zoomLevel}px` }}
            />

            {tracks.map((track) => (
              <div
                key={track.id}
                className="h-16 relative bg-[#09090D] hover:bg-[#0D0D14] transition-colors"
                style={{ width: `${totalBars * zoomLevel}px` }}
              >
                {/* Bar Grid lines */}
                {Array.from({ length: totalBars }).map((_, barIdx) => (
                  <div
                    key={barIdx}
                    className="absolute top-0 bottom-0 border-r border-border/20 pointer-events-none"
                    style={{ left: `${barIdx * zoomLevel}px`, width: `${zoomLevel}px` }}
                  />
                ))}

                {/* Clips in Track */}
                {track.clips.map((clip) => (
                  <div
                    key={clip.id}
                    className="absolute top-1 bottom-1 rounded-lg border border-white/20 p-2 flex flex-col justify-between overflow-hidden shadow-sm cursor-grab active:cursor-grabbing hover:brightness-110 transition-all select-none"
                    style={{
                      left: `${clip.startBar * zoomLevel}px`,
                      width: `${clip.lengthBars * zoomLevel}px`,
                      backgroundColor: `${track.color}40`,
                      borderColor: track.color,
                    }}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-white truncate">
                      <span className="truncate">{clip.name}</span>
                      <span className="text-[9px] font-mono opacity-80">{clip.lengthBars}b</span>
                    </div>

                    {/* Waveform / MIDI Pattern simulation */}
                    <div className="flex items-center gap-0.5 h-4 opacity-75">
                      {Array.from({ length: Math.min(30, Math.floor(clip.lengthBars * 6)) }).map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-white/70 rounded-full"
                          style={{ height: `${20 + (Math.sin(i * 1.2) * 40 + 40)}%` }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
