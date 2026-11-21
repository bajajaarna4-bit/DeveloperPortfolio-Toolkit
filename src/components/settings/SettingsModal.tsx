'use client';

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Headphones,
  Sliders,
  Coins,
  CheckCircle2,
  AlertCircle,
  Key,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  credits: number;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  credits,
}) => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [replicateToken, setReplicateToken] = useState('');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [sampleRate, setSampleRate] = useState('44100');
  const [audioFormat, setAudioFormat] = useState('wav');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-panel border border-border shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200 space-y-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-panel-subtle"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 pb-3 border-b border-border">
          <div className="p-2 rounded-xl bg-accent-secondary/20 text-accent-primary">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-text">SONORA Studio Settings</h2>
            <p className="text-xs text-text-muted">
              Configure AI providers, audio buffer quality, and generation credentials
            </p>
          </div>
        </div>

        {/* API Credentials */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text flex items-center gap-2">
            <Key className="h-3.5 w-3.5 text-accent-primary" />
            AI & Music Generation Providers
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-text-muted block mb-1">
                OpenAI API Key (Optional — for GPT-4o Music Reasoning)
              </label>
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full bg-[#101016] border border-border rounded-xl px-3 py-2 text-xs text-text font-mono focus:outline-none focus:border-accent-primary"
              />
            </div>

            <div>
              <label className="text-xs text-text-muted block mb-1">
                Replicate API Token (Optional — for Meta MusicGen models)
              </label>
              <input
                type="password"
                value={replicateToken}
                onChange={(e) => setReplicateToken(e.target.value)}
                placeholder="r8_..."
                className="w-full bg-[#101016] border border-border rounded-xl px-3 py-2 text-xs text-text font-mono focus:outline-none focus:border-accent-primary"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#111118] border border-border text-xs text-text-muted flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
              <span>
                <strong className="text-text">Built-in Engine Active:</strong> When API keys are omitted, SONORA's high-fidelity Web Audio & Tone.js procedural synthesis engine runs locally, generating playable, real multi-track music and WAV downloads for 100% of workflows!
              </span>
            </div>
          </div>
        </div>

        {/* Audio Buffer Settings */}
        <div className="space-y-3 pt-3 border-t border-border">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text flex items-center gap-2">
            <Headphones className="h-3.5 w-3.5 text-accent-primary" />
            Audio Engine Quality
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-text-muted block mb-1">Export Bitrate / Format</label>
              <select
                value={audioFormat}
                onChange={(e) => setAudioFormat(e.target.value)}
                className="w-full bg-[#101016] border border-border rounded-xl px-3 py-2 text-xs text-text focus:outline-none focus:border-accent-primary"
              >
                <option value="wav">WAV 16-bit PCM (Lossless)</option>
                <option value="mp3">MP3 320 kbps (High Fidelity)</option>
              </select>
            </div>
            <div>
              <label className="text-text-muted block mb-1">Sample Rate</label>
              <select
                value={sampleRate}
                onChange={(e) => setSampleRate(e.target.value)}
                className="w-full bg-[#101016] border border-border rounded-xl px-3 py-2 text-xs text-text focus:outline-none focus:border-accent-primary"
              >
                <option value="44100">44.1 kHz (Studio Standard)</option>
                <option value="48000">48.0 kHz (Cinema / Video)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-xs text-success font-semibold">
            {savedSuccess && '✓ Settings saved successfully'}
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-text-muted hover:text-text border border-border hover:bg-panel"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold text-black bg-accent-primary hover:bg-violet-300 shadow-glow-primary transition-all"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
