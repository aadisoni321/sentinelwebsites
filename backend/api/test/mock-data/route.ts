import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { generateMockTrialEmail, generateMockPlaidTransaction } from '@/lib/test-utils'
import { saveTrialsFromEmails, saveTrialsFromTransactions } from '@/lib/gmail'
import { InsertTrial } from '@/types/database'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check if user is authenticated
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      createMockTrials = true,
      createMockNotifications = true,
      createMockCalendarEvents = true,
      trialCount = 5 
    } = body

    const results: any = {}

    // Create mock trials
    if (createMockTrials) {
      const mockTrials: InsertTrial[] = []
      
      const services = [
        'Netflix', 'Spotify', 'Adobe Creative Cloud', 'Microsoft 365', 
        'Disney+', 'Hulu', 'YouTube Premium', 'Dropbox', 'Notion', 'Slack'
      ]

      for (let i = 0; i < trialCount; i++) {
        const service = services[i % services.length]
        const trialEnd = new Date()
        trialEnd.setDate(trialEnd.getDate() + Math.floor(Math.random() * 30) + 1) // 1-30 days from now
        
        const trial: InsertTrial = {
          user_id: user.id,
          source: Math.random() > 0.5 ? 'email' : 'financial',
          service_name: service,
          trial_start: new Date().toISOString().split('T')[0],
          trial_end: trialEnd.toISOString().split('T')[0],
          cancel_url: `https://${service.toLowerCase().replace(/\s+/g, '')}.com/cancel`,
          subscription_amount: Math.floor(Math.random() * 20) + 5, // $5-$25
          confidence: 0.7 + Math.random() * 0.3, // 0.7-1.0
          status: 'active',
          raw_data: {
            mock: true,
            created_at: new Date().toISOString()
          }
        }
        
        mockTrials.push(trial)
      }

      const { data: createdTrials, error: trialError } = await supabase
        .from('trials')
        .insert(mockTrials)
        .select()

      if (trialError) {
        results.trials = { success: false, error: trialError.message }
      } else {
        results.trials = { 
          success: true, 
          count: createdTrials?.length || 0,
          trials: createdTrials 
        }
      }
    }

    // Create mock notifications
    if (createMockNotifications) {
      const mockNotifications = []
      
      for (let i = 0; i < 3; i++) {
        const notification = {
          user_id: user.id,
          type: 'trial_reminder' as const,
          channel: ['email', 'sms', 'push'][i] as 'email' | 'sms' | 'push',
          recipient: i === 0 ? user.email : (i === 1 ? '+1234567890' : 'push_notification'),
          subject: 'Mock Trial Reminder',
          message: 'This is a mock notification for testing purposes.',
          status: 'sent' as const,
          sent_at: new Date().toISOString(),
        }
        
        mockNotifications.push(notification)
      }

      const { data: createdNotifications, error: notificationError } = await supabase
        .from('notifications')
        .insert(mockNotifications)
        .select()

      if (notificationError) {
        results.notifications = { success: false, error: notificationError.message }
      } else {
        results.notifications = { 
          success: true, 
          count: createdNotifications?.length || 0,
          notifications: createdNotifications 
        }
      }
    }

    // Create mock calendar events
    if (createMockCalendarEvents) {
      // Get some trials to create events for
      const { data: trials } = await supabase
        .from('trials')
        .select('id, service_name, trial_end')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .limit(3)

      if (trials && trials.length > 0) {
        const mockEvents = trials.map(trial => ({
          user_id: user.id,
          trial_id: trial.id,
          calendar_provider: 'google_calendar',
          external_event_id: `mock-event-${trial.id}`,
          event_title: `⚠️ Trial Ending Soon: ${trial.service_name}`,
          event_description: `Mock calendar event for ${trial.service_name} trial ending on ${trial.trial_end}`,
          event_date: new Date(trial.trial_end).toISOString(),
          reminder_minutes: 2880, // 48 hours
        }))

        const { data: createdEvents, error: eventError } = await supabase
          .from('calendar_events')
          .insert(mockEvents)
          .select()

        if (eventError) {
          results.calendarEvents = { success: false, error: eventError.message }
        } else {
          results.calendarEvents = { 
            success: true, 
            count: createdEvents?.length || 0,
            events: createdEvents 
          }
        }
      } else {
        results.calendarEvents = { success: false, error: 'No trials found to create events for' }
      }
    }

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error creating mock data:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create mock data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check if user is authenticated
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete all mock data for this user
    const results: any = {}

    // Delete mock trials
    const { error: trialError } = await supabase
      .from('trials')
      .delete()
      .eq('user_id', user.id)
      .eq('raw_data->mock', true)

    results.trials = { success: !trialError, error: trialError?.message }

    // Delete mock notifications
    const { error: notificationError } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', user.id)
      .eq('subject', 'Mock Trial Reminder')

    results.notifications = { success: !notificationError, error: notificationError?.message }

    // Delete mock calendar events
    const { error: eventError } = await supabase
      .from('calendar_events')
      .delete()
      .eq('user_id', user.id)
      .like('external_event_id', 'mock-event-%')

    results.calendarEvents = { success: !eventError, error: eventError?.message }

    return NextResponse.json({
      success: true,
      results,
      message: 'Mock data cleaned up',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error cleaning up mock data:', error)
    return NextResponse.json(
      { 
        error: 'Failed to clean up mock data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Mock data testing endpoint',
    usage: {
      'POST /api/test/mock-data': 'Create mock data for testing',
      'DELETE /api/test/mock-data': 'Clean up mock data',
      'POST with { createMockTrials: true, trialCount: 10 }': 'Create specific mock data'
    }
  })
} 