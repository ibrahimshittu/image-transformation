/**
 * Auth Callback Route
 *
 * Handles OAuth redirects and email confirmation links.
 * Exchanges the auth code for a session.
 */

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')

  const supabase = await createClient()

  // Handle email confirmation (token_hash flow)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'email' | 'signup' | 'recovery' | 'email_change',
    })

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }

    // On error, redirect to home with auth modal
    return NextResponse.redirect(`${origin}/?auth=required&error=verification_failed`)
  }

  // Handle code exchange flow (OAuth)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        // In development, redirect to localhost
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        // In production behind a proxy
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // Return to home with auth modal if something went wrong
  return NextResponse.redirect(`${origin}/?auth=required&error=auth_callback_error`)
}
