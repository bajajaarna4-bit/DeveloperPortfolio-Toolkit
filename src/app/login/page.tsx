import Link from 'next/link'
import { login, signup } from './actions'
import { Music, Lock, Mail, User, ShieldCheck, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'

interface LoginPageProps {
  searchParams?: {
    error?: string
    message?: string
    mode?: string
    redirectTo?: string
  }
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams || {}
  const isSignup = params.mode === 'signup'
  const error = params.error
  const message = params.message
  const redirectTo = params.redirectTo || '/dashboard'

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-secondary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-8 relative z-10">
        <Link href="/" className="inline-flex items-center gap-3 group mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-secondary to-accent-primary flex items-center justify-center shadow-glow-primary group-hover:scale-105 transition-transform">
            <Music className="w-5 h-5 text-text" />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-text via-text to-accent-primary">
            SONORA AI
          </span>
        </Link>
        <p className="text-text-muted text-sm mt-1">
          {isSignup
            ? 'Create your studio account to start producing AI music'
            : 'Welcome back. Sign in to your music creation workspace'}
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl relative z-10 shadow-panel-soft">
        {/* Tab Switcher */}
        <div className="flex p-1 bg-background-secondary rounded-xl border border-border mb-6">
          <Link
            href={`/login?mode=signin&redirectTo=${encodeURIComponent(redirectTo)}`}
            className={`flex-1 py-2 text-center text-sm font-medium rounded-lg transition-all ${
              !isSignup
                ? 'bg-panel text-text shadow-sm border border-border-light'
                : 'text-text-muted hover:text-text'
            }`}
          >
            Sign In
          </Link>
          <Link
            href={`/login?mode=signup&redirectTo=${encodeURIComponent(redirectTo)}`}
            className={`flex-1 py-2 text-center text-sm font-medium rounded-lg transition-all ${
              isSignup
                ? 'bg-panel text-text shadow-sm border border-border-light'
                : 'text-text-muted hover:text-text'
            }`}
          >
            Create Account
          </Link>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm flex items-start gap-3">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-5 p-3.5 rounded-xl bg-success/10 border border-success/30 text-success text-sm flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Auth Form */}
        <form className="space-y-4">
          <input type="hidden" name="redirectTo" value={redirectTo} />

          {isSignup && (
            <div>
              <label className="block text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Alex Rivera"
                  className="w-full pl-10 pr-4 py-2.5 bg-background-secondary border border-border rounded-xl text-text placeholder:text-text-subtle text-sm focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="producer@sonora.ai"
                className="w-full pl-10 pr-4 py-2.5 bg-background-secondary border border-border rounded-xl text-text placeholder:text-text-subtle text-sm focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-text-muted uppercase tracking-wider">
                Password
              </label>
              {!isSignup && (
                <span className="text-xs text-text-subtle hover:text-accent-primary cursor-pointer transition-colors">
                  Forgot password?
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-background-secondary border border-border rounded-xl text-text placeholder:text-text-subtle text-sm focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2">
            {isSignup ? (
              <button
                type="submit"
                formAction={signup}
                className="w-full py-3 px-4 bg-gradient-to-r from-accent-secondary to-accent-primary hover:from-accent-secondary/90 hover:to-accent-primary/90 text-text font-medium text-sm rounded-xl shadow-glow-primary transition-all flex items-center justify-center gap-2 group"
              >
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <button
                type="submit"
                formAction={login}
                className="w-full py-3 px-4 bg-gradient-to-r from-accent-secondary to-accent-primary hover:from-accent-secondary/90 hover:to-accent-primary/90 text-text font-medium text-sm rounded-xl shadow-glow-primary transition-all flex items-center justify-center gap-2 group"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        </form>

        {/* Security badge */}
        <div className="mt-6 pt-5 border-t border-border flex items-center justify-center gap-2 text-text-subtle text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-accent-primary" />
          <span>Secured by Supabase Auth & JWT cookie sessions</span>
        </div>
      </div>

      {/* Back to Home */}
      <div className="mt-6 text-center relative z-10">
        <Link
          href="/"
          className="text-xs text-text-muted hover:text-text transition-colors flex items-center gap-1.5"
        >
          <span>← Back to SONORA AI home</span>
        </Link>
      </div>
    </div>
  )
}
