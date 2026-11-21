-- =========================================================================
-- SONORA AI - SUPABASE DATABASE SCHEMA
-- Next-Generation AI Music Creation Platform
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    plan_tier TEXT DEFAULT 'pro' CHECK (plan_tier IN ('free', 'creator', 'pro', 'studio')),
    credits_remaining INTEGER DEFAULT 200,
    credits_total INTEGER DEFAULT 200,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Untitled Project',
    description TEXT,
    genre TEXT DEFAULT 'Cinematic',
    bpm INTEGER DEFAULT 120,
    key_signature TEXT DEFAULT 'A minor',
    time_signature TEXT DEFAULT '4/4',
    duration_seconds NUMERIC DEFAULT 180,
    is_favorite BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    arrangement_data JSONB DEFAULT '{}'::jsonb,
    midi_data JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. GENERATIONS
CREATE TABLE IF NOT EXISTS public.generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    enhanced_prompt TEXT,
    status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'analyzing', 'synthesizing', 'rendering', 'completed', 'failed')),
    progress INTEGER DEFAULT 0,
    error_message TEXT,
    mode TEXT DEFAULT 'text_to_music' CHECK (mode IN ('text_to_music', 'instrumental', 'song_with_vocals', 'lyrics_to_song', 'melody_to_music', 'extension', 'variation', 'section_regen')),
    specification JSONB NOT NULL,
    audio_url TEXT,
    waveform_data JSONB DEFAULT '[]'::jsonb,
    duration_seconds NUMERIC,
    provider TEXT DEFAULT 'web_audio_engine',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 4. GENERATION PROMPTS (Prompt History)
CREATE TABLE IF NOT EXISTS public.generation_prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt_text TEXT NOT NULL,
    genre TEXT,
    moods TEXT[],
    bpm INTEGER,
    musical_key TEXT,
    times_used INTEGER DEFAULT 1,
    last_used_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TRACKS (DAW Arrangement Stems & Lanes)
CREATE TABLE IF NOT EXISTS public.tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    track_type TEXT NOT NULL CHECK (track_type IN ('drums', 'bass', 'piano', 'melody', 'chords', 'strings', 'synths', 'vocals', 'fx')),
    color TEXT DEFAULT '#A78BFA',
    order_index INTEGER DEFAULT 0,
    volume NUMERIC DEFAULT 0.8,
    pan NUMERIC DEFAULT 0,
    is_muted BOOLEAN DEFAULT FALSE,
    is_solo BOOLEAN DEFAULT FALSE,
    clips JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. AUDIO ASSETS
CREATE TABLE IF NOT EXISTS public.audio_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    generation_id UUID REFERENCES public.generations(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_format TEXT DEFAULT 'wav' CHECK (file_format IN ('wav', 'mp3', 'ogg', 'flac')),
    sample_rate INTEGER DEFAULT 44100,
    duration_seconds NUMERIC,
    size_bytes BIGINT,
    waveform_json JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MIDI ASSETS
CREATE TABLE IF NOT EXISTS public.midi_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    midi_events JSONB NOT NULL DEFAULT '[]'::jsonb,
    bpm INTEGER DEFAULT 120,
    time_signature TEXT DEFAULT '4/4',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. FAVORITES
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, project_id)
);

-- 9. SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'trialing')),
    current_period_start TIMESTAMPTZ DEFAULT NOW(),
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. USAGE CREDITS (Audit & Ledger)
CREATE TABLE IF NOT EXISTS public.usage_credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    action_type TEXT NOT NULL,
    reference_id UUID,
    balance_after INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.midi_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_credits ENABLE ROW LEVEL SECURITY;

-- Profiles: users read and update their own
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Projects: users manage their own, or view public projects
CREATE POLICY "Users view own or public projects" ON public.projects FOR SELECT USING (auth.uid() = user_id OR is_public = TRUE);
CREATE POLICY "Users insert own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- Generations: users view and insert own
CREATE POLICY "Users view own generations" ON public.generations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own generations" ON public.generations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Tracks: users manage tracks belonging to their projects
CREATE POLICY "Users view tracks of own projects" ON public.tracks FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects WHERE projects.id = tracks.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users modify tracks of own projects" ON public.tracks FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects WHERE projects.id = tracks.project_id AND projects.user_id = auth.uid())
);
