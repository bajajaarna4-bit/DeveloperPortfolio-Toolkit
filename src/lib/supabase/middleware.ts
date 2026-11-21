import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const DEFAULT_SUPABASE_URL = 'https://hhiomleelpegrbqxhams.supabase.co'
const DEFAULT_SUPABASE_KEY =
  'sb_publishable_zE7KuRPV_bja6MrSQwNU7A_YB8vIvMG'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    DEFAULT_SUPABASE_KEY

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
          if (headers) {
            Object.entries(headers).forEach(([key, value]) =>
              supabaseResponse.headers.set(key, value)
            )
          }
        },
      },
    })

    // Safely check user without throwing uncaught exceptions in middleware
    let user = null
    try {
      const { data, error } = await supabase.auth.getUser()
      if (!error && data?.user) {
        user = data.user
      }
    } catch {
      user = null
    }

    const { pathname } = request.nextUrl

    // Protected paths that require authentication
    const protectedRoutes = ['/dashboard', '/account', '/studio', '/projects']
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

    // Auth pages (login, signup) - redirect to dashboard if already authenticated
    const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup')

    if (!user && isProtectedRoute) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/login'
      redirectUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    if (user && isAuthRoute) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/dashboard'
      return NextResponse.redirect(redirectUrl)
    }
  } catch (error) {
    console.error('Middleware updateSession error:', error)
  }

  return supabaseResponse
}
