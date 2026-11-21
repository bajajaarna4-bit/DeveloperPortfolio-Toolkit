'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string
  const redirectTo = (formData.get('redirectTo') as string) || '/dashboard'

  if (!email || !password) {
    redirect(
      `/login?error=${encodeURIComponent(
        'Please provide both email and password.'
      )}&redirectTo=${encodeURIComponent(redirectTo)}`
    )
  }

  let authError: string | null = null

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      authError = error.message
    }
  } catch (err: any) {
    authError = err?.message || 'Authentication service error.'
  }

  if (authError) {
    redirect(
      `/login?error=${encodeURIComponent(authError)}&redirectTo=${encodeURIComponent(
        redirectTo
      )}`
    )
  }

  revalidatePath('/', 'layout')
  redirect(redirectTo)
}

export async function signup(formData: FormData) {
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string
  const fullName = (formData.get('fullName') as string)?.trim()
  const redirectTo = (formData.get('redirectTo') as string) || '/dashboard'

  if (!email || !password) {
    redirect(
      `/login?error=${encodeURIComponent(
        'Please provide both email and password.'
      )}&mode=signup&redirectTo=${encodeURIComponent(redirectTo)}`
    )
  }

  if (password.length < 6) {
    redirect(
      `/login?error=${encodeURIComponent(
        'Password must be at least 6 characters long.'
      )}&mode=signup&redirectTo=${encodeURIComponent(redirectTo)}`
    )
  }

  let signupError: string | null = null
  let hasSession = false

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || '',
        },
      },
    })

    if (error) {
      signupError = error.message
    } else if (data?.session) {
      hasSession = true
    }
  } catch (err: any) {
    signupError = err?.message || 'Failed to create account.'
  }

  if (signupError) {
    redirect(
      `/login?error=${encodeURIComponent(
        signupError
      )}&mode=signup&redirectTo=${encodeURIComponent(redirectTo)}`
    )
  }

  if (hasSession) {
    revalidatePath('/', 'layout')
    redirect(redirectTo)
  }

  redirect(
    `/login?message=${encodeURIComponent(
      'Account created! If confirmation is required, please check your email inbox.'
    )}&mode=signin`
  )
}

export async function signOut() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch (e) {
    console.error('SignOut error:', e)
  }
  revalidatePath('/', 'layout')
  redirect('/login')
}
