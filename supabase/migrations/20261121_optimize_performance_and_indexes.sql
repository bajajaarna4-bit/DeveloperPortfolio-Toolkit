-- =========================================================================
-- MIGRATION: 20261121_optimize_performance_and_indexes.sql
-- Optimizes Postgres queries, foreign key indexes, and RLS policies
-- according to Supabase Postgres Best Practices.
-- =========================================================================

-- -------------------------------------------------------------------------
-- PART 1: REMEDIATE UNINDEXED FOREIGN KEYS (Linter Rule: 0001)
-- Missing FK indexes cause slow JOINs and cascading table locks on DELETE.
-- -------------------------------------------------------------------------

-- Sonora AI Tables (if present or created)
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'projects') THEN
        CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects (user_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'generations') THEN
        CREATE INDEX IF NOT EXISTS idx_generations_project_id ON public.generations (project_id);
        CREATE INDEX IF NOT EXISTS idx_generations_user_id ON public.generations (user_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'generation_prompts') THEN
        CREATE INDEX IF NOT EXISTS idx_generation_prompts_user_id ON public.generation_prompts (user_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tracks') THEN
        CREATE INDEX IF NOT EXISTS idx_tracks_project_id ON public.tracks (project_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'audio_assets') THEN
        CREATE INDEX IF NOT EXISTS idx_audio_assets_user_id ON public.audio_assets (user_id);
        CREATE INDEX IF NOT EXISTS idx_audio_assets_project_id ON public.audio_assets (project_id);
        CREATE INDEX IF NOT EXISTS idx_audio_assets_generation_id ON public.audio_assets (generation_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'midi_assets') THEN
        CREATE INDEX IF NOT EXISTS idx_midi_assets_user_id ON public.midi_assets (user_id);
        CREATE INDEX IF NOT EXISTS idx_midi_assets_project_id ON public.midi_assets (project_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'favorites') THEN
        CREATE INDEX IF NOT EXISTS idx_favorites_project_id ON public.favorites (project_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'subscriptions') THEN
        CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions (user_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'usage_credits') THEN
        CREATE INDEX IF NOT EXISTS idx_usage_credits_user_id ON public.usage_credits (user_id);
        CREATE INDEX IF NOT EXISTS idx_usage_credits_reference_id ON public.usage_credits (reference_id);
    END IF;
END $$;

-- Existing / Auxiliary Tables Detected in Instance
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'acknowledgements') THEN
        CREATE INDEX IF NOT EXISTS idx_acknowledgements_alert_id ON public.acknowledgements (alert_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agent_outputs') THEN
        CREATE INDEX IF NOT EXISTS idx_agent_outputs_project_id ON public.agent_outputs (project_id);
        CREATE INDEX IF NOT EXISTS idx_agent_outputs_user_id ON public.agent_outputs (user_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'campus_memberships') THEN
        CREATE INDEX IF NOT EXISTS idx_campus_memberships_campus_id ON public.campus_memberships (campus_id);
        CREATE INDEX IF NOT EXISTS idx_campus_memberships_user_id ON public.campus_memberships (user_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'check_ins') THEN
        CREATE INDEX IF NOT EXISTS idx_check_ins_journey_id ON public.check_ins (journey_id);
        CREATE INDEX IF NOT EXISTS idx_check_ins_user_id ON public.check_ins (user_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contact_invitations') THEN
        CREATE INDEX IF NOT EXISTS idx_contact_invitations_owner_id ON public.contact_invitations (owner_id);
        CREATE INDEX IF NOT EXISTS idx_contact_invitations_contact_id ON public.contact_invitations (contact_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'emergency_alerts') THEN
        CREATE INDEX IF NOT EXISTS idx_emergency_alerts_user_id ON public.emergency_alerts (user_id);
        CREATE INDEX IF NOT EXISTS idx_emergency_alerts_journey_id ON public.emergency_alerts (journey_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'emergency_recipients') THEN
        CREATE INDEX IF NOT EXISTS idx_emergency_recipients_alert_id ON public.emergency_recipients (alert_id);
        CREATE INDEX IF NOT EXISTS idx_emergency_recipients_contact_id ON public.emergency_recipients (contact_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journey_locations') THEN
        CREATE INDEX IF NOT EXISTS idx_journey_locations_journey_id ON public.journey_locations (journey_id);
        CREATE INDEX IF NOT EXISTS idx_journey_locations_user_id ON public.journey_locations (user_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journeys') THEN
        CREATE INDEX IF NOT EXISTS idx_journeys_user_id ON public.journeys (user_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notifications') THEN
        CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications (user_id);
        CREATE INDEX IF NOT EXISTS idx_notifications_alert_id ON public.notifications (alert_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'risk_assessments') THEN
        CREATE INDEX IF NOT EXISTS idx_risk_assessments_journey_id ON public.risk_assessments (journey_id);
        CREATE INDEX IF NOT EXISTS idx_risk_assessments_user_id ON public.risk_assessments (user_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'trusted_contacts') THEN
        CREATE INDEX IF NOT EXISTS idx_trusted_contacts_owner_id ON public.trusted_contacts (owner_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'nexus_agent_runs') THEN
        CREATE INDEX IF NOT EXISTS idx_nexus_agent_runs_project_id ON public.nexus_agent_runs (project_id);
        CREATE INDEX IF NOT EXISTS idx_nexus_agent_runs_user_id ON public.nexus_agent_runs (user_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'nexus_agent_tasks') THEN
        CREATE INDEX IF NOT EXISTS idx_nexus_agent_tasks_run_id ON public.nexus_agent_tasks (run_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'nexus_audit_logs') THEN
        CREATE INDEX IF NOT EXISTS idx_nexus_audit_logs_user_id ON public.nexus_audit_logs (user_id);
        CREATE INDEX IF NOT EXISTS idx_nexus_audit_logs_project_id ON public.nexus_audit_logs (project_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'nexus_deployments') THEN
        CREATE INDEX IF NOT EXISTS idx_nexus_deployments_project_id ON public.nexus_deployments (project_id);
    END IF;
END $$;

-- -------------------------------------------------------------------------
-- PART 2: COMPOSITE, PARTIAL & COVERING INDEXES
-- Accelerate specific application query patterns and index-only scans.
-- -------------------------------------------------------------------------
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'projects') THEN
        -- Composite: query user projects sorted by update time
        CREATE INDEX IF NOT EXISTS idx_projects_user_updated ON public.projects (user_id, updated_at DESC);
        
        -- Partial: public explore feed
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'is_public') THEN
            CREATE INDEX IF NOT EXISTS idx_projects_public_feed ON public.projects (created_at DESC) WHERE is_public = TRUE;
        END IF;

        -- Partial: user favorites tab
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'is_favorite') THEN
            CREATE INDEX IF NOT EXISTS idx_projects_user_favorites ON public.projects (user_id, updated_at DESC) WHERE is_favorite = TRUE;
        END IF;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'generations') THEN
        CREATE INDEX IF NOT EXISTS idx_generations_user_created ON public.generations (user_id, created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_generations_project_created ON public.generations (project_id, created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_generations_active_queue ON public.generations (status, created_at ASC)
            WHERE status NOT IN ('completed', 'failed');
        CREATE INDEX IF NOT EXISTS idx_generations_specification_gin ON public.generations USING gin (specification jsonb_path_ops);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tracks') THEN
        CREATE INDEX IF NOT EXISTS idx_tracks_project_order ON public.tracks (project_id, order_index ASC);
        CREATE INDEX IF NOT EXISTS idx_tracks_clips_gin ON public.tracks USING gin (clips jsonb_path_ops);
    END IF;
END $$;

-- -------------------------------------------------------------------------
-- PART 3: RLS INITPLAN OPTIMIZATION (Linter Rule: 0003 & 0006)
-- Fixes auth.uid() row-by-row re-evaluation and removes duplicate policies.
-- -------------------------------------------------------------------------

-- 1. Profiles Policy Consolidation & InitPlan Fix
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
        DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
        DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
        DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
        DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
        DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

        CREATE POLICY "Users can view own profile" ON public.profiles
            FOR SELECT TO authenticated
            USING (id = (SELECT auth.uid()));

        CREATE POLICY "Users can update own profile" ON public.profiles
            FOR UPDATE TO authenticated
            USING (id = (SELECT auth.uid()))
            WITH CHECK (id = (SELECT auth.uid()));

        CREATE POLICY "Users can insert own profile" ON public.profiles
            FOR INSERT TO authenticated
            WITH CHECK (id = (SELECT auth.uid()));
    END IF;
END $$;

-- 2. Projects Policy Consolidation & InitPlan Fix
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'projects') THEN
        DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
        DROP POLICY IF EXISTS "Users can insert own projects" ON public.projects;
        DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
        DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;
        DROP POLICY IF EXISTS "Users view own or public projects" ON public.projects;
        DROP POLICY IF EXISTS "Users insert own projects" ON public.projects;
        DROP POLICY IF EXISTS "Users update own projects" ON public.projects;
        DROP POLICY IF EXISTS "Users delete own projects" ON public.projects;

        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'is_public') THEN
            CREATE POLICY "Users view own or public projects" ON public.projects
                FOR SELECT TO authenticated, anon
                USING (is_public = TRUE OR user_id = (SELECT auth.uid()));
        ELSE
            CREATE POLICY "Users can view own projects" ON public.projects
                FOR SELECT TO authenticated
                USING (user_id = (SELECT auth.uid()));
        END IF;

        CREATE POLICY "Users can insert own projects" ON public.projects
            FOR INSERT TO authenticated
            WITH CHECK (user_id = (SELECT auth.uid()));

        CREATE POLICY "Users can update own projects" ON public.projects
            FOR UPDATE TO authenticated
            USING (user_id = (SELECT auth.uid()))
            WITH CHECK (user_id = (SELECT auth.uid()));

        CREATE POLICY "Users can delete own projects" ON public.projects
            FOR DELETE TO authenticated
            USING (user_id = (SELECT auth.uid()));
    END IF;
END $$;

-- 3. Agent Outputs InitPlan Fix
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agent_outputs') THEN
        DROP POLICY IF EXISTS "Users can view own agent outputs" ON public.agent_outputs;
        DROP POLICY IF EXISTS "Users can insert own agent outputs" ON public.agent_outputs;

        CREATE POLICY "Users can view own agent outputs" ON public.agent_outputs
            FOR SELECT TO authenticated
            USING (user_id = (SELECT auth.uid()));

        CREATE POLICY "Users can insert own agent outputs" ON public.agent_outputs
            FOR INSERT TO authenticated
            WITH CHECK (user_id = (SELECT auth.uid()));
    END IF;
END $$;

-- 4. Secure SECURITY DEFINER functions (Linter Rule: 0028 & 0029)
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'rls_auto_enable') THEN
        REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
    END IF;
END $$;
