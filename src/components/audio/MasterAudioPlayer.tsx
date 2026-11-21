'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Repeat,
  Download,
  SplitSquareVertical,
  RotateCcw,
  FastForward,
  Rewind,
  Music,
} from 'lucide-react';

interface MasterAudioPlayerProps {
  title: string;
  artist?: string;
  audioUrl?: string;
  waveformData?: number[];
  durationSeconds?: number;
  onOpenABModal: () => void;
}

export const MasterAudioPlayer: React.FC<MasterAudioPlayerProps> = ({
  title,
  artist = 'SONORA AI',
  audioUrl,
  waveformData = [],
  durationSeconds = 135,
  onOpenABModal,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Play / Pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch((e) => console.log('Audio play error:', e));
    }
  };

  const handleStop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progress = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = progress * (audioRef.current.duration || durationSeconds);
    audioRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    if (isLooping && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
    if (isMuted && newVol > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleSpeedSelect = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
    setShowSpeedMenu(false);
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Master.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Draw waveform on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const peaks = waveformData.length > 0
      ? waveformData
      : Array.from({ length: 100 }, (_, i) => 0.2 + 0.6 * Math.abs(Math.sin(i * 0.1)));

    const barWidth = width / peaks.length;
    const totalDur = (audioRef.current?.duration && !isNaN(audioRef.current.duration))
      ? audioRef.current.duration
      : durationSeconds;
    const currentProgress = totalDur > 0 ? currentTime / totalDur : 0;

    peaks.forEach((peak, i) => {
      const x = i * barWidth;
      const barHeight = peak * (height - 8);
      const y = (height - barHeight) / 2;
      const isPast = (i / peaks.length) <= currentProgress;

      ctx.fillStyle = isPast ? '#A78BFA' : '#282836';
      ctx.fillRect(x + 1, y, Math.max(1, barWidth - 1.5), barHeight);
    });
  }, [waveformData, currentTime, durationSeconds]);

  return (
    <footer className="h-20 bg-[#0B0B10]/95 backdrop-blur-xl border-t border-border px-6 flex items-center justify-between sticky bottom-0 z-30 select-none shadow-2xl">
      {/* Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
      )}

      {/* Track Info */}
      <div className="flex items-center gap-3.5 w-64 shrink-0">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-accent-primary/30 to-accent-secondary/40 border border-accent-primary/40 flex items-center justify-center text-accent-primary shadow-glow-primary">
          <Music className="h-6 w-6" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-text truncate">{title}</span>
          <span className="text-xs text-text-muted truncate">{artist}</span>
        </div>
      </div>

      {/* Center Controls & Waveform */}
      <div className="flex-1 max-w-2xl px-6 flex flex-col items-center gap-1.5">
        {/* Buttons Row */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (audioRef.current) audioRef.current.currentTime = Math.max(0, currentTime - 5);
            }}
            className="text-text-muted hover:text-text p-1 transition-colors"
            title="Rewind 5s"
          >
            <Rewind className="h-4 w-4" />
          </button>

          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-accent-primary hover:bg-violet-300 text-black flex items-center justify-center shadow-glow-primary transition-transform active:scale-95"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 fill-current" />
            ) : (
              <Play className="h-4 w-4 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={handleStop}
            className="text-text-muted hover:text-text p-1 transition-colors"
            title="Stop"
          >
            <Square className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => {
              if (audioRef.current) audioRef.current.currentTime = Math.min(durationSeconds, currentTime + 5);
            }}
            className="text-text-muted hover:text-text p-1 transition-colors"
            title="Fast Forward 5s"
          >
            <FastForward className="h-4 w-4" />
          </button>

          <button
            onClick={() => setIsLooping(!isLooping)}
            className={`p-1 transition-colors ${
              isLooping ? 'text-accent-primary' : 'text-text-muted hover:text-text'
            }`}
            title="Loop playback"
          >
            <Repeat className="h-4 w-4" />
          </button>
        </div>

        {/* Waveform & Time Track */}
        <div className="w-full flex items-center gap-3">
          <span className="text-[11px] font-mono text-text-muted w-10 text-right">
            {formatTime(currentTime)}
          </span>

          <div
            onClick={handleSeek}
            className="flex-1 h-8 bg-[#101016] rounded-lg border border-border/80 relative cursor-pointer overflow-hidden flex items-center px-1"
            title="Click to scrub playback position"
          >
            <canvas ref={canvasRef} width={500} height={32} className="w-full h-full" />
          </div>

          <span className="text-[11px] font-mono text-text-muted w-10">
            {formatTime(durationSeconds)}
          </span>
        </div>
      </div>

      {/* Right Tools: Volume, Speed, A/B Comparison, Download */}
      <div className="flex items-center gap-3 w-64 justify-end shrink-0">
        {/* Speed button */}
        <div className="relative">
          <button
            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
            className="px-2 py-1 rounded-lg bg-panel border border-border text-xs font-mono text-text-muted hover:text-text"
            title="Playback Speed"
          >
            {playbackRate}x
          </button>

          {showSpeedMenu && (
            <div className="absolute bottom-9 right-0 bg-panel border border-border rounded-xl shadow-panel-soft p-1 space-y-1 z-50 text-xs font-mono">
              {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleSpeedSelect(rate)}
                  className={`w-full px-3 py-1 rounded-lg text-left hover:bg-[#1D1D28] ${
                    playbackRate === rate ? 'text-accent-primary font-bold' : 'text-text-muted'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          )}
        </div>

        {/* A/B Comparison */}
        <button
          onClick={onOpenABModal}
          className="p-2 rounded-xl text-text-muted hover:text-accent-primary hover:bg-panel border border-border transition-colors"
          title="A/B Compare Generations"
        >
          <SplitSquareVertical className="h-4 w-4" />
        </button>

        {/* Volume */}
        <div className="flex items-center gap-1.5">
          <button onClick={toggleMute} className="text-text-muted hover:text-text">
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4 text-danger" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-16 h-1 bg-border rounded cursor-pointer"
          />
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={!audioUrl}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-panel hover:bg-panel-subtle text-accent-primary border border-border hover:border-accent-primary/40 disabled:opacity-40 transition-colors"
          title="Download Master WAV"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden xl:inline">Export</span>
        </button>
      </div>
    </footer>
  );
};
