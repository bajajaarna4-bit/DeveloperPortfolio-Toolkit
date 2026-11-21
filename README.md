# SONORA AI — NEXT-GENERATION AI MUSIC CREATION PLATFORM

**SONORA AI** is a complete, production-grade AI music creation and production web application combining:
- **Suno AI**: Deep natural-language prompt-to-music generation & lyrics orchestration.
- **Ableton Live**: Professional multi-track arrangement timeline, stems, mixer, mute/solo, and clip editing.
- **FL Studio**: Interactive 88-key piano roll, velocity editor, scale highlighting, and standard MIDI export (.mid).
- **Intelligent AI Assistant**: Deep music theory reasoning engine (scales, modes, circle of fifths, chord progressions, dynamic curves, and structured specification output).

---

## 🌟 Key Capabilities

### 1. AI Music Generation Studio
- **Natural Language Prompting**: Describe any musical idea in free-form language (e.g. *"A dark cinematic orchestral soundtrack with emotional piano, atmospheric strings, deep taiko percussion in A minor, 88 BPM"*).
- **Prompt Enhancement Engine**: Translates simple prompts into rich acoustic and music theory specifications with one click.
- **8 Generation Modes**:
  1. *Text to Music*
  2. *Instrumental*
  3. *Song with Vocals*
  4. *Lyrics to Song* (built-in lyrics editor)
  5. *Melody to Music*
  6. *Music Extension* (+30s / +60s)
  7. *Music Variation* (customizable intensity)
  8. *Section Regeneration* (Intro, Build, Climax, Outro)
- **Advanced Musical Controls**:
  - **21 Genres**: Classical, Cinematic, Orchestral, Electronic, EDM, House, Techno, Hip-Hop, Trap, R&B, Jazz, Blues, Rock, Metal, Pop, Ambient, Lo-fi, Acoustic, Folk, World Music, Experimental.
  - **14 Moods**: Happy, Sad, Emotional, Epic, Dark, Mysterious, Peaceful, Romantic, Aggressive, Dreamy, Nostalgic, Suspenseful, Triumphant, Melancholic.
  - **Precision Tempo (BPM 40–240)**: Slider, numeric input, presets (Slow / Moderate / Fast), and interactive **Tap Tempo**.
  - **Keys & Modes**: C Major, A Minor, D Minor, Dorian, Phrygian, Lydian, Mixolydian, Locrian, Pentatonic, Blues.
  - **Time Signatures**: 4/4, 3/4, 6/8, 2/4, 5/4, 7/8.
  - **19 Instruments & 12 Production Effects**: Grand Piano, Strings, 808s, Reverb, Tape Saturation, Parallel Compression, Stereo Imaging, etc.
  - **Dynamics**: Pianissimo through Fortissimo, Crescendo, Decrescendo.

### 2. Intelligent AI Music Assistant & Theory Engine
Outputs and validates a structured JSON specification for every composition:
```json
{
  "genre": "Cinematic",
  "subgenre": "Hollywood Epic Trailer",
  "mood": ["Epic", "Dark", "Emotional"],
  "bpm": 88,
  "key": "A minor",
  "time_signature": "4/4",
  "instruments": ["Grand Piano", "Strings", "Orchestral Percussion", "808 Bass"],
  "chord_progression": ["Am", "F", "C", "G"],
  "melodic_style": "Cantabile lyrical motif with dramatic contouring",
  "rhythm_style": "Driving cinematic pulse with polyrhythmic syncopations",
  "song_structure": [
    {"name": "Intro", "bars": 4, "intensity": 2},
    {"name": "Build-Up", "bars": 8, "intensity": 5},
    {"name": "Climax", "bars": 8, "intensity": 9},
    {"name": "Outro", "bars": 4, "intensity": 3}
  ],
  "dynamics": ["Pianissimo", "Crescendo", "Fortissimo"],
  "production_effects": ["Cathedral Reverb", "Tape Saturation", "Stereo Imaging"],
  "vocal_style": "None (Instrumental)",
  "duration": "2:15",
  "generation_instructions": "..."
}
```

### 3. Song Arrangement Editor (Ableton Live Style DAW)
- Multitrack timeline with timeline ruler and zoom controls.
- 9 Default tracks: Drums, Bass, Piano, Melody, Chords, Strings, Synths, Vocals, FX.
- Track Mute, Track Solo, Volume faders, and Pan knobs.
- Clip visualization, draggable clips, duplication, deletion.
- Real-time playhead synchronized to multi-track Tone.js audio playback.

### 4. Piano Roll & MIDI Editor (FL Studio Style)
- Interactive 88-key piano keyboard: click any key to hear instantaneous physical audio feedback.
- Horizontal timeline with snap grid (1/16, 1/8, 1/4 beat).
- Click to create or delete MIDI note blocks.
- Real-time scale highlighting (Major, Natural Minor, Dorian, Phrygian, Lydian, Pentatonic, Blues).
- **Export MIDI (.mid)**: Encodes and downloads a standard Type 0 MIDI file for any external DAW.
- Integrated Tone.js polyphonic sequence synthesizer.

### 5. High-Fidelity Master Audio Player
- Real-time Canvas waveform with seek and scrub capabilities.
- Play, Pause, Stop, Seek (+5s / -5s), and Loop playback.
- Variable playback rate (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x).
- Master 16-bit PCM WAV export.
- **A/B Comparison Deck**: Side-by-side auditioning of two generations or acoustic variations with a real-time crossfader slider.

### 6. AI Music Templates (16 Presets)
- Cinematic Trailer
- Emotional Piano
- Epic Orchestral
- Dark Ambient
- Lo-fi Study
- Chill Electronic
- Deep House
- Melodic Techno
- Trap Beat
- Hip-Hop Instrumental
- Romantic Acoustic
- Fantasy Soundtrack
- Horror Soundscape
- Game Background Music
- Meditation Music
- Corporate Background Music

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons.
- **Audio Synthesis**: Web Audio API, Tone.js, OfflineAudioContext procedural synthesizer, Custom PCM WAV & Standard MIDI Encoders.
- **Backend**: Next.js API Routes (`/api/music/interpret`, `/api/music/generate`, `/api/music/extend`, `/api/music/variation`, `/api/music/status/[id]`, `/api/projects`).
- **Database & Persistence**: Supabase SQL Schema (`supabase/schema.sql`) with Row-Level Security (RLS) + In-Memory & LocalStorage resilient fallback.
- **AI Providers**: OpenAI (GPT-4o), Replicate (Meta MusicGen), Gemini, or SONORA's local Music Theory Engine.

---

## 🚀 Getting Started

### 1. Installation
```bash
# Install dependencies
pnpm install
```

### 2. Environment Variables (.env.local)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Optional keys:
```env
# Optional LLM reasoning:
OPENAI_API_KEY=""
GEMINI_API_KEY=""

# Optional external audio generation:
REPLICATE_API_TOKEN=""

# Optional Supabase database:
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
```
> **Note:** If API keys are omitted, SONORA AI functions **100% out-of-the-box** using its built-in Music Theory Engine and high-fidelity Web Audio procedural synthesis engine!

### 3. Run Development Server
```bash
pnpm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
pnpm run build
pnpm run start
```
