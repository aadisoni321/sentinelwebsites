import { NextRequest, NextResponse } from 'next/server'
import { createTrialRemindersForUser } from '@/lib/calendar'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check if user is authenticated
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create calendar reminders for all active trials
    const eventIds = await createTrialRemindersForUser(user.id)

    return NextResponse.json({
      success: true,
      remindersCreated: eventIds.length,
      eventIds,
    })
  } catch (error) {
    console.error('Error creating calendar reminders:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create calendar reminders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 