import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import { createServerSupabaseClient } from './supabase'
import { Trial, InsertCalendarEvent } from '@/types/database'
import { addDays, subDays, format } from 'date-fns'

// Google Calendar OAuth2 configuration
const CALENDAR_SCOPES = ['https://www.googleapis.com/auth/calendar']

export function createCalendarOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/calendar/callback`
  )
}

export function getCalendarAuthUrl() {
  const oauth2Client = createCalendarOAuth2Client()
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: CALENDAR_SCOPES,
    prompt: 'consent'
  })
}

export async function exchangeCalendarCode(code: string) {
  const oauth2Client = createCalendarOAuth2Client()
  const { tokens } = await oauth2Client.getTokens(code)
  return tokens
}

export async function refreshCalendarToken(refreshToken: string) {
  const oauth2Client = createCalendarOAuth2Client()
  oauth2Client.setCredentials({ refresh_token: refreshToken })
  const { credentials } = await oauth2Client.refreshAccessToken()
  return credentials
}

export async function getCalendarClient(accessToken: string) {
  const oauth2Client = createCalendarOAuth2Client()
  oauth2Client.setCredentials({ access_token: accessToken })
  return google.calendar({ version: 'v3', auth: oauth2Client })
}

export interface CalendarEventData {
  title: string
  description: string
  startDate: Date
  endDate: Date
  reminderMinutes?: number[]
}

export async function createCalendarEvent(
  userId: string,
  eventData: CalendarEventData
): Promise<string | null> {
  const supabase = createServerSupabaseClient()
  
  // Get user's Google Calendar account
  const { data: account } = await supabase
    .from('connected_accounts')
    .select('*')
    .eq('user_id', userId)
    .eq('provider', 'google_calendar')
    .eq('is_active', true)
    .single()

  if (!account) {
    throw new Error('No active Google Calendar account found')
  }

  // Refresh token if needed
  let accessToken = account.access_token
  if (account.expires_at && new Date(account.expires_at) <= new Date()) {
    const refreshedTokens = await refreshCalendarToken(account.refresh_token!)
    accessToken = refreshedTokens.access_token!
    
    // Update stored tokens
    await supabase
      .from('connected_accounts')
      .update({
        access_token: refreshedTokens.access_token,
        expires_at: refreshedTokens.expiry_date ? new Date(refreshedTokens.expiry_date).toISOString() : null,
      })
      .eq('id', account.id)
  }

  // Create calendar event
  const calendar = await getCalendarClient(accessToken!)

  const event = {
    summary: eventData.title,
    description: eventData.description,
    start: {
      dateTime: eventData.startDate.toISOString(),
      timeZone: 'UTC',
    },
    end: {
      dateTime: eventData.endDate.toISOString(),
      timeZone: 'UTC',
    },
    reminders: {
      useDefault: false,
      overrides: (eventData.reminderMinutes || [2880]).map(minutes => ({
        method: 'popup',
        minutes,
      })),
    },
  }

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    })

    return response.data.id || null
  } catch (error) {
    console.error('Error creating calendar event:', error)
    throw error
  }
}

export async function updateCalendarEvent(
  userId: string,
  eventId: string,
  eventData: Partial<CalendarEventData>
): Promise<void> {
  const supabase = createServerSupabaseClient()
  
  // Get user's Google Calendar account
  const { data: account } = await supabase
    .from('connected_accounts')
    .select('*')
    .eq('user_id', userId)
    .eq('provider', 'google_calendar')
    .eq('is_active', true)
    .single()

  if (!account) {
    throw new Error('No active Google Calendar account found')
  }

  // Refresh token if needed
  let accessToken = account.access_token
  if (account.expires_at && new Date(account.expires_at) <= new Date()) {
    const refreshedTokens = await refreshCalendarToken(account.refresh_token!)
    accessToken = refreshedTokens.access_token!
    
    // Update stored tokens
    await supabase
      .from('connected_accounts')
      .update({
        access_token: refreshedTokens.access_token,
        expires_at: refreshedTokens.expiry_date ? new Date(refreshedTokens.expiry_date).toISOString() : null,
      })
      .eq('id', account.id)
  }

  const calendar = await getCalendarClient(accessToken!)

  const updateData: any = {}
  
  if (eventData.title) updateData.summary = eventData.title
  if (eventData.description) updateData.description = eventData.description
  if (eventData.startDate) {
    updateData.start = {
      dateTime: eventData.startDate.toISOString(),
      timeZone: 'UTC',
    }
  }
  if (eventData.endDate) {
    updateData.end = {
      dateTime: eventData.endDate.toISOString(),
      timeZone: 'UTC',
    }
  }
  if (eventData.reminderMinutes) {
    updateData.reminders = {
      useDefault: false,
      overrides: eventData.reminderMinutes.map(minutes => ({
        method: 'popup',
        minutes,
      })),
    }
  }

  await calendar.events.update({
    calendarId: 'primary',
    eventId,
    requestBody: updateData,
  })
}

export async function deleteCalendarEvent(
  userId: string,
  eventId: string
): Promise<void> {
  const supabase = createServerSupabaseClient()
  
  // Get user's Google Calendar account
  const { data: account } = await supabase
    .from('connected_accounts')
    .select('*')
    .eq('user_id', userId)
    .eq('provider', 'google_calendar')
    .eq('is_active', true)
    .single()

  if (!account) {
    throw new Error('No active Google Calendar account found')
  }

  let accessToken = account.access_token
  if (account.expires_at && new Date(account.expires_at) <= new Date()) {
    const refreshedTokens = await refreshCalendarToken(account.refresh_token!)
    accessToken = refreshedTokens.access_token!
    
    await supabase
      .from('connected_accounts')
      .update({
        access_token: refreshedTokens.access_token,
        expires_at: refreshedTokens.expiry_date ? new Date(refreshedTokens.expiry_date).toISOString() : null,
      })
      .eq('id', account.id)
  }

  const calendar = await getCalendarClient(accessToken!)

  await calendar.events.delete({
    calendarId: 'primary',
    eventId,
  })
}

export async function createTrialReminderEvent(
  userId: string,
  trial: Trial
): Promise<string | null> {
  const trialEndDate = new Date(trial.trial_end)
  const reminderDate = subDays(trialEndDate, 2) // 48 hours before
  
  // Set reminder time to 9 AM on the reminder date
  reminderDate.setHours(9, 0, 0, 0)
  
  const eventTitle = `⚠️ Trial Ending Soon: ${trial.service_name}`
  const eventDescription = `Your ${trial.service_name} free trial ends on ${format(trialEndDate, 'MMMM d, yyyy')}.

🔴 Action Required: Cancel before ${format(trialEndDate, 'MMMM d, yyyy')} to avoid charges.

${trial.subscription_amount ? `💰 Subscription cost: $${trial.subscription_amount}/month` : ''}

${trial.cancel_url ? `🔗 Cancel here: ${trial.cancel_url}` : ''}

This reminder was created by SentinelApp to help you manage your free trials.`

  const eventData: CalendarEventData = {
    title: eventTitle,
    description: eventDescription,
    startDate: reminderDate,
    endDate: addDays(reminderDate, 0.5), // 12-hour event
    reminderMinutes: [2880, 1440, 60], // 48h, 24h, 1h before
  }

  try {
    const eventId = await createCalendarEvent(userId, eventData)
    
    if (eventId) {
      // Store calendar event in database
      const supabase = createServerSupabaseClient()
      const calendarEventData: InsertCalendarEvent = {
        user_id: userId,
        trial_id: trial.id,
        calendar_provider: 'google_calendar',
        external_event_id: eventId,
        event_title: eventTitle,
        event_description: eventDescription,
        event_date: reminderDate.toISOString(),
        reminder_minutes: 2880, // 48 hours
      }

      await supabase
        .from('calendar_events')
        .insert(calendarEventData)
    }

    return eventId
  } catch (error) {
    console.error('Error creating trial reminder event:', error)
    return null
  }
}

export async function createTrialRemindersForUser(userId: string): Promise<string[]> {
  const supabase = createServerSupabaseClient()
  const eventIds: string[] = []

  // Get active trials that don't have calendar events yet
  const { data: trials } = await supabase
    .from('trials')
    .select(`
      *,
      calendar_events!left(id)
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .is('calendar_events.id', null)

  if (!trials || trials.length === 0) {
    return eventIds
  }

  for (const trial of trials) {
    try {
      const eventId = await createTrialReminderEvent(userId, trial)
      if (eventId) {
        eventIds.push(eventId)
      }
    } catch (error) {
      console.error(`Error creating reminder for trial ${trial.id}:`, error)
    }
  }

  return eventIds
}

export async function updateTrialReminder(
  userId: string,
  trialId: string,
  newTrialEndDate: Date
): Promise<void> {
  const supabase = createServerSupabaseClient()

  // Get existing calendar event
  const { data: calendarEvent } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('user_id', userId)
    .eq('trial_id', trialId)
    .single()

  if (!calendarEvent || !calendarEvent.external_event_id) {
    throw new Error('Calendar event not found')
  }

  // Calculate new reminder date
  const reminderDate = subDays(newTrialEndDate, 2)
  reminderDate.setHours(9, 0, 0, 0)

  // Update calendar event
  await updateCalendarEvent(userId, calendarEvent.external_event_id, {
    startDate: reminderDate,
    endDate: addDays(reminderDate, 0.5),
  })

  // Update database record
  await supabase
    .from('calendar_events')
    .update({
      event_date: reminderDate.toISOString(),
    })
    .eq('id', calendarEvent.id)
}

export async function deleteTrialReminder(
  userId: string,
  trialId: string
): Promise<void> {
  const supabase = createServerSupabaseClient()

  // Get existing calendar event
  const { data: calendarEvent } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('user_id', userId)
    .eq('trial_id', trialId)
    .single()

  if (!calendarEvent) {
    return // Event doesn't exist
  }

  // Delete from Google Calendar if external event ID exists
  if (calendarEvent.external_event_id) {
    try {
      await deleteCalendarEvent(userId, calendarEvent.external_event_id)
    } catch (error) {
      console.error('Error deleting external calendar event:', error)
      // Continue to delete database record even if external deletion fails
    }
  }

  // Delete from database
  await supabase
    .from('calendar_events')
    .delete()
    .eq('id', calendarEvent.id)
} 