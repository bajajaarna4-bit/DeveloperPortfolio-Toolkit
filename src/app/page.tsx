import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from './login/actions'
import { Music, Sparkles, Layers, Sliders, Shield, ArrowRight, UserCheck, Play } from 'lucide-react'

export default async function HomePage() {
  let user = null
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    if (!error && data?.user) {
      user = data.user
    }
  } catch {
    user = null
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative selection:bg-accent-primary/20 selection:text-accent-primary">
      {/* Navigation */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-secondary to-accent-primary flex items-center justify-center shadow-glow-primary">
              <Music className="w-5 h-5 text-text" />
            </div>
            <span className="font-bold tracking-tight text-xl bg-clip-text text-transparent bg-gradient-to-r from-text to-accent-primary">
              SONORA AI
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            <a
              href="/portfolio"
              className="hidden sm:inline-flex px-3.5 py-2 rounded-xl text-text-muted hover:text-accent-primary text-sm font-medium transition-colors"
            >
              Portfolio Dashboard
            </a>
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-xl bg-panel hover:bg-panel-subtle border border-border text-sm font-medium text-text flex items-center gap-2 transition-all"
                >
                  <UserCheck className="w-4 h-4 text-accent-primary" />
                  <span>Dashboard</span>
                </Link>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl text-text-muted hover:text-text text-sm transition-colors"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-text-muted hover:text-text text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/login?mode=signup"
                  className="px-4 py-2 rounded-xl bg-accent-secondary hover:bg-accent-secondary/90 text-text text-sm font-medium shadow-glow-primary transition-all flex items-center gap-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center relative z-10">
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-accent-secondary/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-panel border border-border text-xs text-accent-primary font-medium mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Protected by Supabase Server-Side Authentication</span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.15] mb-6">
          Produce Studio-Grade Music Powered by{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-primary via-accent-secondary to-cyan-400">
            Intelligent Audio AI
          </span>
        </h1>

        <p className="text-text-muted text-lg max-w-2xl mb-10 leading-relaxed">
          From text-to-composition, stems, and MIDI generation to full arrangement in a modern web DAW.
          Secure user authentication, projects, and asset management powered by Supabase.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
          <Link
            href={user ? '/dashboard' : '/login?mode=signup'}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-accent-secondary to-accent-primary text-text font-semibold text-base shadow-glow-primary hover:scale-[1.02] transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{user ? 'Open Studio Dashboard' : 'Start Creating Free'}</span>
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-3.5 rounded-xl glass-panel text-text font-medium text-base hover:bg-panel-subtle transition-all"
          >
            Explore Protected Routes
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="glass-panel p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-accent-secondary/20 border border-accent-secondary/30 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-accent-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Supabase Auth & SSR</h3>
            <p className="text-text-muted text-sm leading-relaxed">
              Strict cookie-based JWT sessions with server-side route guards protecting <code>/dashboard</code>, <code>/account</code>, and studio endpoints.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Stem & MIDI Engine</h3>
            <p className="text-text-muted text-sm leading-relaxed">
              Extract drums, bass, piano, synths, and chords directly into individual WAV audio stems and standard MIDI files.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mb-4">
              <Sliders className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Row Level Security (RLS)</h3>
            <p className="text-text-muted text-sm leading-relaxed">
              Postgres RLS policies ensure producers strictly access only their own projects, audio generations, and arrangement data.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-text-subtle text-xs">
        <p>SONORA AI • Supabase Authentication Architecture</p>
      </footer>
    </div>
  )
}
