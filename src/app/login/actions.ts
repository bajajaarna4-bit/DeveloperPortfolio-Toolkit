'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = (formData.get('redirectTo') as string) || '/dashboard'

  if (!email || !password) {
    redirect(
      `/login?error=${encodeURIComponent(
        'Please provide both email and password.'
      )}&redirectTo=${encodeURIComponent(redirectTo)}`
    )
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect(
      `/login?error=${encodeURIComponent(
        error.message
      )}&redirectTo=${encodeURIComponent(redirectTo)}`
    )
  }

  revalidatePath('/', 'layout')
  redirect(redirectTo)
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
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
    redirect(
      `/login?error=${encodeURIComponent(
        error.message
      )}&mode=signup&redirectTo=${encodeURIComponent(redirectTo)}`
    )
  }

  // If email confirmation is disabled or automatic login occurs
  if (data?.session) {
    revalidatePath('/', 'layout')
    redirect(redirectTo)
  }

  // Email confirmation required
  redirect(
    `/login?message=${encodeURIComponent(
      'Account created! If confirmation is required, please check your email inbox.'
    )}&mode=signin`
  )
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
