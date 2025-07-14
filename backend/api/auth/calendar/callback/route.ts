import { NextRequest, NextResponse } from 'next/server'
import { exchangeCalendarCode } from '@/lib/calendar'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check if user is authenticated
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return NextResponse.redirect(
        new URL('/login', request.url)
      )
    }

    // Get authorization code from query params
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const error_param = searchParams.get('error')

    if (error_param) {
      console.error('Calendar OAuth error:', error_param)
      return NextResponse.redirect(
        new URL('/dashboard?error=calendar_auth_failed', request.url)
      )
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/dashboard?error=no_auth_code', request.url)
      )
    }

    // Exchange code for tokens
    const tokens = await exchangeCalendarCode(code)

    if (!tokens.access_token || !tokens.refresh_token) {
      return NextResponse.redirect(
        new URL('/dashboard?error=token_exchange_failed', request.url)
      )
    }

    // Store tokens in database
    const accountData = {
      user_id: user.id,
      provider: 'google_calendar' as const,
      account_id: user.email!, // Use user's email as account ID
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
      metadata: {
        scope: tokens.scope,
        token_type: tokens.token_type,
      },
      is_active: true,
    }

    // Upsert connected account
    const { error: upsertError } = await supabase
      .from('connected_accounts')
      .upsert(accountData, {
        onConflict: 'user_id,provider,account_id',
      })

    if (upsertError) {
      console.error('Error storing Calendar tokens:', upsertError)
      return NextResponse.redirect(
        new URL('/dashboard?error=token_storage_failed', request.url)
      )
    }

    // Redirect to dashboard with success
    return NextResponse.redirect(
      new URL('/dashboard?success=calendar_connected', request.url)
    )
  } catch (error) {
    console.error('Error in Calendar OAuth callback:', error)
    return NextResponse.redirect(
      new URL('/dashboard?error=auth_callback_failed', request.url)
    )
  }
} 