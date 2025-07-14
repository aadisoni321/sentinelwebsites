import { NextRequest, NextResponse } from 'next/server'
import { getCalendarAuthUrl } from '@/lib/calendar'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check if user is authenticated
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Generate Google Calendar OAuth URL
    const authUrl = getCalendarAuthUrl()
    
    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error('Error generating Calendar auth URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    )
  }
} 