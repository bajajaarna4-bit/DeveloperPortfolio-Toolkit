-- =========================================================================
-- SONORA AI - OPTIMIZED SUPABASE DATABASE SCHEMA
-- Next-Generation AI Music Creation Platform
-- Compliant with Supabase Postgres Best Practices (v1.1.1)
-- =========================================================================

-- -------------------------------------------------------------------------
-- 0. EXTENSIONS & HELPER FUNCTIONS
-- -------------------------------------------------------------------------
-- Using native gen_random_uuid() (standard in Postgres 13+)
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Recommended for fast text search

-- Trigger function to automatically maintain updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- -------------------------------------------------------------------------
-- 1. PROFILES (Extends Supabase auth.users)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    plan_tier TEXT DEFAULT 'pro' CHECK (plan_tier IN ('free', 'creator', 'pro', 'studio')),
    credits_remaining INTEGER DEFAULT 200 CHECK (credits_remaining >= 0),
    credits_total INTEGER DEFAULT 200 CHECK (credits_total >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Profiles trigger
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile trigger on auth.users sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, plan_tier, credits_remaining, credits_total)
    VALUES (
        NEW.id,
        COALESCE(NEW.email, ''),
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Producer'),
        NEW.raw_user_meta_data->>'avatar_url',
        'pro',
        200,
        200
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

-- Revoke direct execution of security definer function from public/anon roles
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- -------------------------------------------------------------------------
-- 2. PROJECTS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Untitled Project',
    description TEXT,
    genre TEXT DEFAULT 'Cinematic',
    bpm INTEGER DEFAULT 120 CHECK (bpm BETWEEN 20 AND 300),
    key_signature TEXT DEFAULT 'A minor',
    time_signature TEXT DEFAULT '4/4',
    duration_seconds NUMERIC DEFAULT 180 CHECK (duration_seconds >= 0),
    is_favorite BOOLEAN DEFAULT FALSE NOT NULL,
    is_public BOOLEAN DEFAULT FALSE NOT NULL,
    arrangement_data JSONB DEFAULT '{}'::jsonb NOT NULL,
    midi_data JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Projects trigger
DROP TRIGGER IF EXISTS set_projects_updated_at ON public.projects;
CREATE TRIGGER set_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- -------------------------------------------------------------------------
-- 3. GENERATIONS (AI Audio Jobs & Pipeline Stems)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    enhanced_prompt TEXT,
    status TEXT DEFAULT 'queued' NOT NULL CHECK (status IN ('queued', 'analyzing', 'synthesizing', 'rendering', 'completed', 'failed')),
    progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    error_message TEXT,
    mode TEXT DEFAULT 'text_to_music' NOT NULL CHECK (mode IN ('text_to_music', 'instrumental', 'song_with_vocals', 'lyrics_to_song', 'melody_to_music', 'extension', 'variation', 'section_regen')),
    specification JSONB NOT NULL DEFAULT '{}'::jsonb,
    audio_url TEXT,
    waveform_data JSONB DEFAULT '[]'::jsonb,
    duration_seconds NUMERIC CHECK (duration_seconds IS NULL OR duration_seconds >= 0),
    provider TEXT DEFAULT 'web_audio_engine' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMPTZ
);

-- -------------------------------------------------------------------------
-- 4. GENERATION PROMPTS (Prompt History)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.generation_prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt_text TEXT NOT NULL,
    genre TEXT,
    moods TEXT[],
    bpm INTEGER CHECK (bpm IS NULL OR (bpm BETWEEN 20 AND 300)),
    musical_key TEXT,
    times_used INTEGER DEFAULT 1 CHECK (times_used >= 1),
    last_used_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- -------------------------------------------------------------------------
-- 5. TRACKS (DAW Arrangement Stems & Lanes)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    track_type TEXT NOT NULL CHECK (track_type IN ('drums', 'bass', 'piano', 'melody', 'chords', 'strings', 'synths', 'vocals', 'fx')),
    color TEXT DEFAULT '#A78BFA' NOT NULL,
    order_index INTEGER DEFAULT 0 NOT NULL,
    volume NUMERIC DEFAULT 0.8 CHECK (volume BETWEEN 0 AND 2),
    pan NUMERIC DEFAULT 0 CHECK (pan BETWEEN -1 AND 1),
    is_muted BOOLEAN DEFAULT FALSE NOT NULL,
    is_solo BOOLEAN DEFAULT FALSE NOT NULL,
    clips JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- -------------------------------------------------------------------------
-- 6. AUDIO ASSETS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audio_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    generation_id UUID REFERENCES public.generations(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_format TEXT DEFAULT 'wav' NOT NULL CHECK (file_format IN ('wav', 'mp3', 'ogg', 'flac')),
    sample_rate INTEGER DEFAULT 44100 CHECK (sample_rate > 0),
    duration_seconds NUMERIC CHECK (duration_seconds IS NULL OR duration_seconds >= 0),
    size_bytes BIGINT CHECK (size_bytes IS NULL OR size_bytes >= 0),
    waveform_json JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- -------------------------------------------------------------------------
-- 7. MIDI ASSETS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.midi_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    midi_events JSONB NOT NULL DEFAULT '[]'::jsonb,
    bpm INTEGER DEFAULT 120 CHECK (bpm BETWEEN 20 AND 300),
    time_signature TEXT DEFAULT '4/4',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- -------------------------------------------------------------------------
-- 8. FAVORITES
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_favorites_user_project UNIQUE(user_id, project_id)
);

-- -------------------------------------------------------------------------
-- 9. SUBSCRIPTIONS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'trialing')),
    current_period_start TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- -------------------------------------------------------------------------
-- 10. USAGE CREDITS (Audit & Ledger)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.usage_credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    action_type TEXT NOT NULL,
    reference_id UUID,
    balance_after INTEGER NOT NULL CHECK (balance_after >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =========================================================================
-- INDEX OPTIMIZATIONS (Supabase Postgres Best Practices)
-- =========================================================================

-- 1. FOREIGN KEY INDEXES (Crucial for fast JOINs and ON DELETE CASCADE)
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects (user_id);
CREATE INDEX IF NOT EXISTS idx_generations_project_id ON public.generations (project_id);
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON public.generations (user_id);
CREATE INDEX IF NOT EXISTS idx_generation_prompts_user_id ON public.generation_prompts (user_id);
CREATE INDEX IF NOT EXISTS idx_tracks_project_id ON public.tracks (project_id);
CREATE INDEX IF NOT EXISTS idx_audio_assets_user_id ON public.audio_assets (user_id);
CREATE INDEX IF NOT EXISTS idx_audio_assets_project_id ON public.audio_assets (project_id);
CREATE INDEX IF NOT EXISTS idx_audio_assets_generation_id ON public.audio_assets (generation_id);
CREATE INDEX IF NOT EXISTS idx_midi_assets_user_id ON public.midi_assets (user_id);
CREATE INDEX IF NOT EXISTS idx_midi_assets_project_id ON public.midi_assets (project_id);
CREATE INDEX IF NOT EXISTS idx_favorites_project_id ON public.favorites (project_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions (user_id);
CREATE INDEX IF NOT EXISTS idx_usage_credits_user_id ON public.usage_credits (user_id);
CREATE INDEX IF NOT EXISTS idx_usage_credits_reference_id ON public.usage_credits (reference_id);

-- 2. COMPOSITE INDEXES FOR FREQUENT QUERY PATTERNS (leftmost prefix rules)
-- Primary user project list sorted by most recently modified
CREATE INDEX IF NOT EXISTS idx_projects_user_updated ON public.projects (user_id, updated_at DESC);

-- Primary user generation history sorted chronologically
CREATE INDEX IF NOT EXISTS idx_generations_user_created ON public.generations (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generations_project_created ON public.generations (project_id, created_at DESC);

-- Track ordering inside DAW timeline
CREATE INDEX IF NOT EXISTS idx_tracks_project_order ON public.tracks (project_id, order_index ASC);

-- Prompt composer history sorted by last used
CREATE INDEX IF NOT EXISTS idx_generation_prompts_user_last_used ON public.generation_prompts (user_id, last_used_at DESC);

-- Usage credit ledger sorted by timestamp
CREATE INDEX IF NOT EXISTS idx_usage_credits_user_created ON public.usage_credits (user_id, created_at DESC);

-- Active subscriptions lookup
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON public.subscriptions (user_id, status);

-- 3. PARTIAL INDEXES (High impact, reduced disk footprint)
-- Worker queue: Only index active/in-flight audio synthesis jobs
CREATE INDEX IF NOT EXISTS idx_generations_active_queue ON public.generations (status, created_at ASC)
    WHERE status NOT IN ('completed', 'failed');

-- Explore / Community Feed: Only public tracks, skipping private user projects
CREATE INDEX IF NOT EXISTS idx_projects_public_feed ON public.projects (created_at DESC)
    WHERE is_public = TRUE;

-- Favorites tab query
CREATE INDEX IF NOT EXISTS idx_projects_user_favorites ON public.projects (user_id, updated_at DESC)
    WHERE is_favorite = TRUE;

-- 4. COVERING INDEXES (Index-Only Scans skipping heap fetches)
CREATE INDEX IF NOT EXISTS idx_projects_list_covering ON public.projects (user_id, updated_at DESC)
    INCLUDE (title, genre, bpm, duration_seconds, is_favorite, is_public);

-- 5. JSONB GIN INDEXES (Path-ops for efficient containment querying)
CREATE INDEX IF NOT EXISTS idx_generations_specification_gin ON public.generations USING gin (specification jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_tracks_clips_gin ON public.tracks USING gin (clips jsonb_path_ops);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Performance-optimized: Uses (select auth.uid()) to avoid per-row execution
-- Explicit roles: Targeted to 'authenticated' and 'anon' to avoid policy bloat
-- =========================================================================

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

-- -------------------------------------------------------------------------
-- PROFILES POLICIES
-- -------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT TO authenticated
    USING (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE TO authenticated
    USING (id = (SELECT auth.uid()))
    WITH CHECK (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT TO authenticated
    WITH CHECK (id = (SELECT auth.uid()));

-- -------------------------------------------------------------------------
-- PROJECTS POLICIES
-- -------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users view own or public projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
CREATE POLICY "Users view own or public projects" ON public.projects
    FOR SELECT TO authenticated, anon
    USING (is_public = TRUE OR user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users insert own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON public.projects;
CREATE POLICY "Users insert own projects" ON public.projects
    FOR INSERT TO authenticated
    WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users update own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
CREATE POLICY "Users update own projects" ON public.projects
    FOR UPDATE TO authenticated
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users delete own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;
CREATE POLICY "Users delete own projects" ON public.projects
    FOR DELETE TO authenticated
    USING (user_id = (SELECT auth.uid()));

-- -------------------------------------------------------------------------
-- GENERATIONS POLICIES
-- -------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users view own generations" ON public.generations;
CREATE POLICY "Users view own generations" ON public.generations
    FOR SELECT TO authenticated
    USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users insert own generations" ON public.generations;
CREATE POLICY "Users insert own generations" ON public.generations
    FOR INSERT TO authenticated
    WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users update own generations" ON public.generations;
CREATE POLICY "Users update own generations" ON public.generations
    FOR UPDATE TO authenticated
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users delete own generations" ON public.generations;
CREATE POLICY "Users delete own generations" ON public.generations
    FOR DELETE TO authenticated
    USING (user_id = (SELECT auth.uid()));

-- -------------------------------------------------------------------------
-- GENERATION PROMPTS POLICIES
-- -------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users manage own prompts" ON public.generation_prompts;
CREATE POLICY "Users view own prompts" ON public.generation_prompts
    FOR SELECT TO authenticated
    USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users insert own prompts" ON public.generation_prompts
    FOR INSERT TO authenticated
    WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users update own prompts" ON public.generation_prompts
    FOR UPDATE TO authenticated
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users delete own prompts" ON public.generation_prompts
    FOR DELETE TO authenticated
    USING (user_id = (SELECT auth.uid()));

-- -------------------------------------------------------------------------
-- TRACKS POLICIES (Hierarchical Access via Projects)
-- Fast indexed subqueries on projects(id) and tracks(project_id)
-- -------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users view tracks of own projects" ON public.tracks;
CREATE POLICY "Users view tracks of own projects" ON public.tracks
    FOR SELECT TO authenticated, anon
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = tracks.project_id
            AND (projects.user_id = (SELECT auth.uid()) OR projects.is_public = TRUE)
        )
    );

DROP POLICY IF EXISTS "Users modify tracks of own projects" ON public.tracks;
CREATE POLICY "Users insert tracks to own projects" ON public.tracks
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = tracks.project_id
            AND projects.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Users update tracks of own projects" ON public.tracks
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = tracks.project_id
            AND projects.user_id = (SELECT auth.uid())
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = tracks.project_id
            AND projects.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Users delete tracks of own projects" ON public.tracks
    FOR DELETE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = tracks.project_id
            AND projects.user_id = (SELECT auth.uid())
        )
    );

-- -------------------------------------------------------------------------
-- AUDIO & MIDI ASSETS POLICIES
-- -------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users manage own audio assets" ON public.audio_assets;
CREATE POLICY "Users view own audio assets" ON public.audio_assets
    FOR SELECT TO authenticated
    USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users insert own audio assets" ON public.audio_assets
    FOR INSERT TO authenticated
    WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users delete own audio assets" ON public.audio_assets
    FOR DELETE TO authenticated
    USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users manage own midi assets" ON public.midi_assets;
CREATE POLICY "Users view own midi assets" ON public.midi_assets
    FOR SELECT TO authenticated
    USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users insert own midi assets" ON public.midi_assets
    FOR INSERT TO authenticated
    WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users delete own midi assets" ON public.midi_assets
    FOR DELETE TO authenticated
    USING (user_id = (SELECT auth.uid()));

-- -------------------------------------------------------------------------
-- FAVORITES POLICIES
-- -------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users manage own favorites" ON public.favorites;
CREATE POLICY "Users view own favorites" ON public.favorites
    FOR SELECT TO authenticated
    USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users insert own favorites" ON public.favorites
    FOR INSERT TO authenticated
    WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users delete own favorites" ON public.favorites
    FOR DELETE TO authenticated
    USING (user_id = (SELECT auth.uid()));

-- -------------------------------------------------------------------------
-- SUBSCRIPTIONS POLICIES (Users read own, billing webhooks update)
-- -------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users view own subscriptions" ON public.subscriptions
    FOR SELECT TO authenticated
    USING (user_id = (SELECT auth.uid()));

-- -------------------------------------------------------------------------
-- USAGE CREDITS POLICIES (Read-only ledger for authenticated users)
-- -------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users view own usage credits" ON public.usage_credits;
CREATE POLICY "Users view own usage credits" ON public.usage_credits
    FOR SELECT TO authenticated
    USING (user_id = (SELECT auth.uid()));
