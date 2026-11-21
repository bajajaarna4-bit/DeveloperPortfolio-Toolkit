import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/login/actions'
import { Shield, ArrowLeft, LogOut, CheckCircle2 } from 'lucide-react'

export default async function AccountPage() {
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

  if (!user) {
    redirect('/login?redirectTo=/account')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-text-muted hover:text-text transition-colors flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-panel hover:bg-panel-subtle border border-border text-xs text-text-muted hover:text-text flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-10 w-full">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text">
            Account & Security Settings
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Manage your authenticated producer credentials, session details, and security policies.
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Card */}
          <div className="glass-panel p-6 rounded-2xl border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-accent-secondary to-accent-primary flex items-center justify-center text-text font-bold text-xl shadow-glow-primary">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text">
                  {user.user_metadata?.full_name || 'Producer Account'}
                </h2>
                <p className="text-text-muted text-sm">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <span className="text-xs text-text-subtle uppercase tracking-wider block mb-1">
                  User Unique ID (UUID)
                </span>
                <span className="text-xs font-mono text-text bg-background-secondary px-2.5 py-1.5 rounded-lg border border-border block truncate">
                  {user.id}
                </span>
              </div>
              <div>
                <span className="text-xs text-text-subtle uppercase tracking-wider block mb-1">
                  Email Status
                </span>
                <span className="text-xs text-success flex items-center gap-1.5 py-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{user.email_confirmed_at ? 'Email Confirmed' : 'Verified Session'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Security & Token Info */}
          <div className="glass-panel p-6 rounded-2xl border border-border">
            <h3 className="text-base font-semibold text-text mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent-primary" />
              <span>Authentication Architecture</span>
            </h3>

            <div className="space-y-3 text-xs text-text-muted">
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <span className="text-text-subtle">Session Storage</span>
                <span className="text-text font-mono">HttpOnly Cookie Tokens (@supabase/ssr)</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <span className="text-text-subtle">Server-Side Verification</span>
                <span className="text-text font-mono">supabase.auth.getUser()</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <span className="text-text-subtle">Database Access Control</span>
                <span className="text-text font-mono">PostgreSQL Row Level Security (RLS)</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-text-subtle">Route Interceptor</span>
                <span className="text-text font-mono">Next.js Edge Middleware</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
