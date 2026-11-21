'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar, NavView } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { PromptComposer } from '@/components/studio/PromptComposer';
import { AdvancedControls } from '@/components/studio/AdvancedControls';
import { SpecificationViewer } from '@/components/studio/SpecificationViewer';
import { ArrangementEditor } from '@/components/daw/ArrangementEditor';
import { PianoRoll } from '@/components/daw/PianoRoll';
import { MasterAudioPlayer } from '@/components/audio/MasterAudioPlayer';
import { ABComparisonModal } from '@/components/audio/ABComparisonModal';
import { TemplatesGrid } from '@/components/studio/TemplatesGrid';
import { ProjectsList } from '@/components/projects/ProjectsList';
import { SoundLibrary } from '@/components/studio/SoundLibrary';
import { SettingsModal } from '@/components/settings/SettingsModal';

import {
  MusicSpecification,
  Project,
  GenerationMode,
  ArrangementTrack,
  MidiNote,
  MusicTemplate,
} from '@/types/music';
import { interpretPrompt } from '@/lib/musicTheory/engine';
import { renderProceduralAudio } from '@/lib/audio/proceduralSynth';
import { INITIAL_PROJECTS } from '@/lib/storage/db';

import {
  Wand2,
  Sparkles,
  Layers,
  Piano,
  ArrowRight,
  FolderKanban,
} from 'lucide-react';

export default function SonoraApp() {
  // Navigation & View state
  const [currentView, setCurrentView] = useState<NavView>('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isABModalOpen, setIsABModalOpen] = useState(false);

  // User State
  const [credits, setCredits] = useState(185);

  // Projects State
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [currentProject, setCurrentProject] = useState<Project>(INITIAL_PROJECTS[0]);

  // Prompt Composer State
  const [prompt, setPrompt] = useState(
    'A dark cinematic orchestral soundtrack with emotional piano, atmospheric strings, deep cinematic percussion, a slow build-up, dramatic tension, and an explosive orchestral climax. Use A minor, 88 BPM, and a powerful Hollywood-style sound.'
  );
  const [generationMode, setGenerationMode] = useState<GenerationMode>('text_to_music');
  const [lyrics, setLyrics] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatusText, setGenerationStatusText] = useState('Initializing Studio...');

  // Current Working Music Specification
  const [specification, setSpecification] = useState<MusicSpecification>(() =>
    interpretPrompt('Cinematic Orchestral in A minor at 88 BPM')
  );

  // Current Working Arrangement & MIDI Notes
  const [activeTracks, setActiveTracks] = useState<ArrangementTrack[]>(INITIAL_PROJECTS[0].tracks);
  const [activeNotes, setActiveNotes] = useState<MidiNote[]>(INITIAL_PROJECTS[0].pianoRollNotes);

  // Master Audio Player State
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | undefined>(undefined);
  const [currentWaveformData, setCurrentWaveformData] = useState<number[]>([]);
  const [currentTrackTitle, setCurrentTrackTitle] = useState('Interstellar Horizons (Cinematic)');
  const [currentDuration, setCurrentDuration] = useState(135);

  // Initial Audio Synthesis for default project on load so user can immediately press play!
  useEffect(() => {
    async function loadDefaultAudio() {
      try {
        const result = await renderProceduralAudio(specification);
        setCurrentAudioUrl(result.audioUrl);
        setCurrentWaveformData(result.waveformData);
        setCurrentDuration(result.durationSeconds);
      } catch (err) {
        console.warn('Initial procedural audio pre-render:', err);
      }
    }
    loadDefaultAudio();
  }, []);

  // Handle Prompt Enhancement
  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancing) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/music/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, overrides: specification }),
      });
      const data = await res.json();
      if (data.specification) {
        setSpecification(data.specification);
      }
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
      }
    } catch (err) {
      console.error('Enhance prompt failed:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Handle Music Generation
  const handleGenerateMusic = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setGenerationProgress(10);
    setGenerationStatusText('Analyzing musical structure & scales...');

    try {
      // Step 1: Interpret and formalize specification
      const interpretRes = await fetch('/api/music/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, overrides: specification }),
      });
      const interpData = await interpretRes.json();
      const finalSpec: MusicSpecification = interpData.specification || specification;
      setSpecification(finalSpec);

      setGenerationProgress(35);
      setGenerationStatusText('Synthesizing multi-track harmony & arrangement...');

      // Step 2: Render procedural multi-track audio buffer
      const renderedAudio = await renderProceduralAudio(finalSpec);

      setGenerationProgress(75);
      setGenerationStatusText('Encoding master 16-bit PCM WAV & peak waveforms...');

      // Step 3: Trigger server job tracking and deduct credits
      const jobRes = await fetch('/api/music/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          specification: finalSpec,
          mode: generationMode,
          lyrics,
        }),
      });
      await jobRes.json();

      setGenerationProgress(100);
      setGenerationStatusText('Mastering completed!');

      // Update audio player state
      setCurrentAudioUrl(renderedAudio.audioUrl);
      setCurrentWaveformData(renderedAudio.waveformData);
      setCurrentDuration(renderedAudio.durationSeconds);
      setActiveTracks(renderedAudio.tracks);
      setActiveNotes(renderedAudio.midiNotes);
      setCredits((c) => Math.max(0, c - 5));

      const generatedTitle = `${finalSpec.genre} — ${finalSpec.subgenre || 'Master'}`;
      setCurrentTrackTitle(generatedTitle);

      // Create new Project in library
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        title: generatedTitle,
        description: prompt.slice(0, 100),
        genre: finalSpec.genre,
        bpm: finalSpec.bpm,
        keySignature: finalSpec.key,
        timeSignature: finalSpec.time_signature,
        durationSeconds: renderedAudio.durationSeconds,
        isFavorite: false,
        tracks: renderedAudio.tracks,
        pianoRollNotes: renderedAudio.midiNotes,
        audioUrl: renderedAudio.audioUrl,
        waveformData: renderedAudio.waveformData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setProjects((prev) => [newProj, ...prev]);
      setCurrentProject(newProj);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress(0);
      }, 600);
    }
  };

  // Open Project in Studio / DAW
  const handleOpenProject = (proj: Project) => {
    setCurrentProject(proj);
    setSpecification(interpretPrompt(proj.title, {
      genre: proj.genre,
      bpm: proj.bpm,
      key: proj.keySignature,
      time_signature: proj.timeSignature,
    }));
    setActiveTracks(proj.tracks || []);
    setActiveNotes(proj.pianoRollNotes || []);
    if (proj.audioUrl) setCurrentAudioUrl(proj.audioUrl);
    if (proj.waveformData) setCurrentWaveformData(proj.waveformData);
    setCurrentTrackTitle(proj.title);
    setCurrentDuration(proj.durationSeconds);
    setCurrentView('create');
  };

  // Duplicate Project
  const handleDuplicateProject = (id: string) => {
    const orig = projects.find((p) => p.id === id);
    if (!orig) return;
    const dup: Project = {
      ...orig,
      id: `proj-${Date.now()}`,
      title: `${orig.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
    };
    setProjects([dup, ...projects]);
  };

  // Delete Project
  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  // Toggle Favorite
  const handleToggleFavorite = (id: string) => {
    setProjects(
      projects.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  // Select Template from Grid
  const handleSelectTemplate = (template: MusicTemplate) => {
    setPrompt(template.prompt);
    setSpecification(interpretPrompt(template.prompt, {
      genre: template.genre,
      subgenre: template.subgenre,
      bpm: template.bpm,
      key: template.key,
      time_signature: template.timeSignature,
      mood: template.moods,
      instruments: template.instruments,
    }));
    setCurrentView('create');
  };

  return (
    <div className="flex h-screen bg-background text-text overflow-hidden">
      {/* 1. Left Sidebar */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        credits={credits}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* 2. Top Navigation */}
        <TopNav
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          credits={credits}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* 3. Main Workspace Router */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* VIEW: HOME DASHBOARD */}
          {currentView === 'home' && (
            <div className="space-y-8 max-w-7xl mx-auto">
              {/* Hero Banner */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-[#181528] via-[#12121A] to-[#0A0A0E] border border-border/80 shadow-2xl relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-2xl space-y-4 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-secondary/20 border border-accent-secondary/40 text-xs font-mono font-semibold text-accent-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    Next-Gen AI Music Engine 2.0
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black text-text tracking-tight leading-tight">
                    Translate your musical imagination into{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-purple-400">
                      mastered compositions.
                    </span>
                  </h1>
                  <p className="text-sm text-text-muted leading-relaxed">
                    SONORA AI combines Suno prompt intelligence, Ableton Live arrangement timelines, and FL Studio piano rolls into one seamless studio environment.
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => setCurrentView('create')}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-black bg-accent-primary hover:bg-violet-300 shadow-glow-primary transition-all active:scale-[0.98]"
                    >
                      <Wand2 className="h-4 w-4" />
                      Create Music Now
                    </button>
                    <button
                      onClick={() => setCurrentView('templates')}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-text hover:bg-panel border border-border transition-colors"
                    >
                      Explore 16 Templates
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Creation Templates (Top 4) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-text flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-accent-primary" />
                    Popular Creation Templates
                  </h2>
                  <button
                    onClick={() => setCurrentView('templates')}
                    className="text-xs text-accent-primary hover:underline font-semibold"
                  >
                    View all 16 →
                  </button>
                </div>

                <TemplatesGrid onSelectTemplate={handleSelectTemplate} />
              </div>

              {/* Recent Projects Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-text flex items-center gap-2">
                    <FolderKanban className="h-5 w-5 text-accent-primary" />
                    Recent Projects
                  </h2>
                  <button
                    onClick={() => setCurrentView('projects')}
                    className="text-xs text-accent-primary hover:underline font-semibold"
                  >
                    Manage projects →
                  </button>
                </div>

                <ProjectsList
                  projects={projects.slice(0, 3)}
                  onOpenProject={handleOpenProject}
                  onDuplicateProject={handleDuplicateProject}
                  onDeleteProject={handleDeleteProject}
                  onToggleFavorite={handleToggleFavorite}
                  onCreateNew={() => setCurrentView('create')}
                />
              </div>
            </div>
          )}

          {/* VIEW: CREATE MUSIC STUDIO */}
          {currentView === 'create' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-text tracking-tight flex items-center gap-2">
                    AI Music Creation Studio
                  </h1>
                  <p className="text-xs text-text-muted mt-1">
                    Compose full multi-track productions with natural language prompts and professional music theory controls
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentView('arrangement')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-panel hover:bg-panel-subtle text-text border border-border"
                  >
                    <Layers className="h-3.5 w-3.5 text-accent-primary" />
                    Open in Arrangement DAW
                  </button>
                  <button
                    onClick={() => setCurrentView('piano-roll')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-panel hover:bg-panel-subtle text-text border border-border"
                  >
                    <Piano className="h-3.5 w-3.5 text-accent-primary" />
                    Open in Piano Roll
                  </button>
                </div>
              </div>

              {/* 1. Prompt Composer */}
              <PromptComposer
                prompt={prompt}
                onPromptChange={setPrompt}
                onGenerate={handleGenerateMusic}
                onEnhance={handleEnhancePrompt}
                isGenerating={isGenerating}
                isEnhancing={isEnhancing}
                generationProgress={generationProgress}
                generationStatusText={generationStatusText}
                generationMode={generationMode}
                onSelectMode={setGenerationMode}
                lyrics={lyrics}
                onLyricsChange={setLyrics}
                specification={specification}
              />

              {/* 2. Advanced Controls */}
              <AdvancedControls
                specification={specification}
                onChange={(updated) => setSpecification((prev) => ({ ...prev, ...updated }))}
              />

              {/* 3. AI Music Theory Specification Viewer */}
              <SpecificationViewer specification={specification} />
            </div>
          )}

          {/* VIEW: ARRANGEMENT DAW */}
          {currentView === 'arrangement' && (
            <div className="space-y-4 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-text flex items-center gap-2">
                    <Layers className="h-5 w-5 text-accent-primary" />
                    Song Arrangement Editor (Ableton Live Style)
                  </h1>
                  <p className="text-xs text-text-muted">
                    Multitrack timeline with audio stems, MIDI clips, track solo/mute, volume, and synchronized playback
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView('create')}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-panel border border-border text-text hover:text-accent-primary"
                >
                  ← Back to Prompt Studio
                </button>
              </div>

              <ArrangementEditor
                tracks={activeTracks}
                onTracksChange={setActiveTracks}
                bpm={specification.bpm}
              />
            </div>
          )}

          {/* VIEW: PIANO ROLL & MIDI */}
          {currentView === 'piano-roll' && (
            <div className="space-y-4 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-text flex items-center gap-2">
                    <Piano className="h-5 w-5 text-accent-primary" />
                    Piano Roll & MIDI Editor (FL Studio Style)
                  </h1>
                  <p className="text-xs text-text-muted">
                    Interactive keyboard, note sequencer, scale highlighting, live Tone.js audio preview, and standard .mid export
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView('create')}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-panel border border-border text-text hover:text-accent-primary"
                >
                  ← Back to Prompt Studio
                </button>
              </div>

              <PianoRoll
                notes={activeNotes}
                onNotesChange={setActiveNotes}
                bpm={specification.bpm}
              />
            </div>
          )}

          {/* VIEW: MY PROJECTS */}
          {currentView === 'projects' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h1 className="text-2xl font-black text-text">My Projects</h1>
                <p className="text-xs text-text-muted mt-1">
                  Manage, duplicate, edit, and reopen your musical projects and arrangements
                </p>
              </div>

              <ProjectsList
                projects={projects}
                onOpenProject={handleOpenProject}
                onDuplicateProject={handleDuplicateProject}
                onDeleteProject={handleDeleteProject}
                onToggleFavorite={handleToggleFavorite}
                onCreateNew={() => setCurrentView('create')}
              />
            </div>
          )}

          {/* VIEW: TEMPLATES */}
          {currentView === 'templates' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h1 className="text-2xl font-black text-text">AI Music Templates</h1>
                <p className="text-xs text-text-muted mt-1">
                  16 professionally tuned starter presets spanning Hollywood film scores, Lo-fi study, Techno, and Ambient
                </p>
              </div>

              <TemplatesGrid onSelectTemplate={handleSelectTemplate} />
            </div>
          )}

          {/* VIEW: SOUND LIBRARY & DISCOVER */}
          {(currentView === 'discover' || currentView === 'sound-library') && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <SoundLibrary
                onLoadPrompt={(p) => {
                  setPrompt(p);
                  setSpecification(interpretPrompt(p));
                  setCurrentView('create');
                }}
              />
            </div>
          )}

          {/* VIEW: FAVORITES */}
          {currentView === 'favorites' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h1 className="text-2xl font-black text-text">Favorites</h1>
                <p className="text-xs text-text-muted mt-1">Bookmarked projects and arrangements</p>
              </div>

              <ProjectsList
                projects={projects.filter((p) => p.isFavorite)}
                onOpenProject={handleOpenProject}
                onDuplicateProject={handleDuplicateProject}
                onDeleteProject={handleDeleteProject}
                onToggleFavorite={handleToggleFavorite}
                onCreateNew={() => setCurrentView('create')}
              />
            </div>
          )}

          {/* VIEW: RECENTLY PLAYED */}
          {currentView === 'recently-played' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h1 className="text-2xl font-black text-text">Recently Played</h1>
                <p className="text-xs text-text-muted mt-1">Audio generations played in your current session</p>
              </div>

              <ProjectsList
                projects={projects.slice(0, 5)}
                onOpenProject={handleOpenProject}
                onDuplicateProject={handleDuplicateProject}
                onDeleteProject={handleDeleteProject}
                onToggleFavorite={handleToggleFavorite}
                onCreateNew={() => setCurrentView('create')}
              />
            </div>
          )}
        </main>

        {/* 4. Master Audio Player Dock (Bottom persistent bar) */}
        <MasterAudioPlayer
          title={currentTrackTitle}
          artist="SONORA AI Studio"
          audioUrl={currentAudioUrl}
          waveformData={currentWaveformData}
          durationSeconds={currentDuration}
          onOpenABModal={() => setIsABModalOpen(true)}
        />
      </div>

      {/* A/B Comparison Modal */}
      <ABComparisonModal
        isOpen={isABModalOpen}
        onClose={() => setIsABModalOpen(false)}
        titleA={currentTrackTitle}
        audioUrlA={currentAudioUrl}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        credits={credits}
      />
    </div>
  );
}
