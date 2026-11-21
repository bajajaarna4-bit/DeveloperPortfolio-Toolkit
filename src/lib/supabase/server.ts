import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const DEFAULT_SUPABASE_URL = 'https://hhiomleelpegrbqxhams.supabase.co'
const DEFAULT_SUPABASE_KEY =
  'sb_publishable_zE7KuRPV_bja6MrSQwNU7A_YB8vIvMG'

export async function createClient() {
  let cookieStore: any
  try {
    cookieStore = await cookies()
  } catch {
    // cookies() unavailable in non-request contexts
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    DEFAULT_SUPABASE_KEY

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        try {
          return cookieStore ? cookieStore.getAll() : []
        } catch {
          return []
        }
      },
      setAll(cookiesToSet) {
        try {
          if (cookieStore) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          }
        } catch {
          // Expected when called from a Server Component; handled by middleware
        }
      },
    },
  })
}
