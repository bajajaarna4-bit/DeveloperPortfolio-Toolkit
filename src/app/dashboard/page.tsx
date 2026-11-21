import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/login/actions'
import {
  Music,
  User,
  Shield,
  Layers,
  Sparkles,
  Sliders,
  FolderOpen,
  LogOut,
  Clock,
  Key,
  ExternalLink,
} from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Server-side session verification via getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/dashboard')
  }

  const createdAt = user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'
  const lastSignIn = user.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleString()
    : 'Active now'

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-secondary to-accent-primary flex items-center justify-center shadow-glow-primary">
                <Music className="w-4 h-4 text-text" />
              </div>
              <span className="font-bold tracking-tight text-lg text-text">SONORA AI</span>
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-accent-secondary/15 text-accent-primary border border-accent-secondary/30">
              Protected Studio Area
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/account"
              className="text-sm text-text-muted hover:text-text transition-colors flex items-center gap-1.5"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Account Settings</span>
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-panel hover:bg-panel-subtle border border-border text-xs text-text-muted hover:text-text flex items-center gap-1.5 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        {/* Welcome Banner */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success border border-success/20 text-xs font-medium mb-3">
              <Shield className="w-3.5 h-3.5" />
              <span>Authenticated Session Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text mb-2">
              Welcome to Your Studio, {user.user_metadata?.full_name || user.email?.split('@')[0]}
            </h1>
            <p className="text-text-muted text-sm max-w-xl">
              This dashboard route is fully protected by Supabase Auth with server-side cookie verification.
              Unauthenticated requests are intercepted and redirected by Next.js middleware.
            </p>
          </div>
        </div>

        {/* User Identity Details & Session Meta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-panel p-5 rounded-xl border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-panel-subtle flex items-center justify-center text-accent-primary">
                <User className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                User Identity
              </span>
            </div>
            <p className="text-sm font-semibold text-text truncate">{user.email}</p>
            <p className="text-xs text-text-subtle mt-1 font-mono truncate">ID: {user.id}</p>
          </div>

          <div className="glass-panel p-5 rounded-xl border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-panel-subtle flex items-center justify-center text-cyan-400">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                Session Activity
              </span>
            </div>
            <p className="text-sm font-semibold text-text">{lastSignIn}</p>
            <p className="text-xs text-text-subtle mt-1">Joined: {createdAt}</p>
          </div>

          <div className="glass-panel p-5 rounded-xl border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-panel-subtle flex items-center justify-center text-purple-400">
                <Key className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                Auth Role & Provider
              </span>
            </div>
            <p className="text-sm font-semibold text-text uppercase">
              {user.app_metadata?.provider || 'Email/Password'}
            </p>
            <p className="text-xs text-text-subtle mt-1">Role: {user.role || 'authenticated'}</p>
          </div>
        </div>

        {/* Studio Action Modules */}
        <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-primary" />
          <span>Studio Workspace Modules</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="glass-panel p-5 rounded-xl border border-border hover:border-border-light transition-all group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-accent-secondary/20 flex items-center justify-center text-accent-primary mb-4 group-hover:scale-105 transition-transform">
              <Music className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-text text-sm mb-1">Text to Composition</h3>
            <p className="text-text-muted text-xs leading-relaxed">
              Generate full musical arrangements from rich harmonic prompts using Sonora's built-in theory engine.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-xl border border-border hover:border-border-light transition-all group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-text text-sm mb-1">Stem Synthesis</h3>
            <p className="text-text-muted text-xs leading-relaxed">
              Export high-fidelity isolated stems: drums, melodic leads, sub-bass, and polyphonic chords.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-xl border border-border hover:border-border-light transition-all group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-105 transition-transform">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-text text-sm mb-1">Web DAW Timeline</h3>
            <p className="text-text-muted text-xs leading-relaxed">
              Arrange clips, adjust BPM, keys, pan, and volume with client-side Web Audio & Tone.js synthesis.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-xl border border-border hover:border-border-light transition-all group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
              <FolderOpen className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-text text-sm mb-1">Saved Projects</h3>
            <p className="text-text-muted text-xs leading-relaxed">
              Seamlessly persist your arrangements and generations in Supabase PostgreSQL tables under RLS protection.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
