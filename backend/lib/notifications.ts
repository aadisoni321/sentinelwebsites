import { Resend } from 'resend'
import { Twilio } from 'twilio'
import * as OneSignal from 'onesignal-node'
import { createServerSupabaseClient } from './supabase'
import { Trial, InsertNotification } from '@/types/database'
import { format, subDays } from 'date-fns'

// Initialize notification services
const resend = new Resend(process.env.RESEND_API_KEY)

const twilio = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const oneSignalClient = new OneSignal.Client(
  process.env.ONESIGNAL_APP_ID!,
  process.env.ONESIGNAL_API_KEY!
)

export interface NotificationData {
  userId: string
  trialId?: string
  type: 'trial_reminder' | 'trial_expired' | 'cancellation_success'
  recipient: string
  subject?: string
  message: string
  scheduledFor?: Date
}

export interface EmailNotificationData extends NotificationData {
  htmlContent?: string
  attachments?: Array<{
    filename: string
    content: string
    type: string
  }>
}

export interface SMSNotificationData extends NotificationData {
  // SMS-specific options can be added here
}

export interface PushNotificationData extends NotificationData {
  title: string
  icon?: string
  url?: string
  data?: Record<string, any>
}

// Email notification functions
export async function sendEmailNotification(
  data: EmailNotificationData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const response = await resend.emails.send({
      from: 'SentinelApp <noreply@sentinelapp.com>',
      to: [data.recipient],
      subject: data.subject || 'Trial Reminder',
      text: data.message,
      html: data.htmlContent || `<p>${data.message.replace(/\n/g, '<br>')}</p>`,
    })

    if (response.error) {
      return { success: false, error: response.error.message }
    }

    return { success: true, messageId: response.data?.id }
  } catch (error) {
    console.error('Error sending email:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// SMS notification functions
export async function sendSMSNotification(
  data: SMSNotificationData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const response = await twilio.messages.create({
      body: data.message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: data.recipient,
    })

    return { success: true, messageId: response.sid }
  } catch (error) {
    console.error('Error sending SMS:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// Push notification functions
export async function sendPushNotification(
  data: PushNotificationData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const notification = {
      contents: { en: data.message },
      headings: { en: data.title },
      included_segments: ['All'],
      filters: [
        { field: 'tag', key: 'user_id', relation: '=', value: data.userId }
      ],
      url: data.url,
      data: data.data,
    }

    const response = await oneSignalClient.createNotification(notification)

    if (response.body.errors) {
      return { success: false, error: response.body.errors.join(', ') }
    }

    return { success: true, messageId: response.body.id }
  } catch (error) {
    console.error('Error sending push notification:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// Database notification management
export async function saveNotification(
  data: NotificationData,
  channel: 'email' | 'sms' | 'push',
  status: 'pending' | 'sent' | 'failed' = 'pending'
): Promise<string> {
  const supabase = createServerSupabaseClient()

  const notificationData: InsertNotification = {
    user_id: data.userId,
    trial_id: data.trialId,
    type: data.type,
    channel,
    recipient: data.recipient,
    subject: data.subject,
    message: data.message,
    status,
    scheduled_for: data.scheduledFor?.toISOString(),
  }

  const { data: notification, error } = await supabase
    .from('notifications')
    .insert(notificationData)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to save notification: ${error.message}`)
  }

  return notification.id
}

export async function updateNotificationStatus(
  notificationId: string,
  status: 'sent' | 'failed' | 'delivered',
  errorMessage?: string
): Promise<void> {
  const supabase = createServerSupabaseClient()

  const updateData: any = {
    status,
    sent_at: status === 'sent' || status === 'delivered' ? new Date().toISOString() : null,
  }

  if (errorMessage) {
    updateData.error_message = errorMessage
  }

  await supabase
    .from('notifications')
    .update(updateData)
    .eq('id', notificationId)
}

// Trial-specific notification templates
export function createTrialReminderEmailTemplate(trial: Trial): {
  subject: string
  text: string
  html: string
} {
  const trialEndDate = new Date(trial.trial_end)
  const daysUntilEnd = Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  
  const subject = `⚠️ Your ${trial.service_name} trial ends in ${daysUntilEnd} days`
  
  const text = `Hi there!

Your ${trial.service_name} free trial is ending soon:

🗓️ Trial ends: ${format(trialEndDate, 'MMMM d, yyyy')}
⏰ Time remaining: ${daysUntilEnd} days

${trial.subscription_amount ? `💰 After the trial: $${trial.subscription_amount}/month` : ''}

🔴 Action needed: Cancel before ${format(trialEndDate, 'MMMM d, yyyy')} to avoid charges.

${trial.cancel_url ? `👆 Cancel here: ${trial.cancel_url}` : ''}

Need help? Reply to this email or visit our support page.

Best regards,
The SentinelApp Team`

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
        <h1 style="color: white; margin: 0; font-size: 24px;">⚠️ Trial Ending Soon</h1>
      </div>
      
      <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
        <h2 style="color: #1f2937; margin-top: 0;">${trial.service_name}</h2>
        <p style="color: #6b7280; font-size: 16px; line-height: 1.5;">
          Your free trial is ending soon. Take action to avoid unexpected charges.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; color: #374151;"><strong>📅 Trial ends:</strong> ${format(trialEndDate, 'MMMM d, yyyy')}</p>
          <p style="margin: 8px 0 0 0; color: #374151;"><strong>⏰ Time remaining:</strong> ${daysUntilEnd} days</p>
          ${trial.subscription_amount ? `<p style="margin: 8px 0 0 0; color: #374151;"><strong>💰 After trial:</strong> $${trial.subscription_amount}/month</p>` : ''}
        </div>
      </div>
      
      ${trial.cancel_url ? `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${trial.cancel_url}" style="background: #ef4444; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
            Cancel Subscription
          </a>
        </div>
      ` : ''}
      
      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          This reminder was sent by <strong>SentinelApp</strong> to help you manage your free trials.
        </p>
      </div>
    </div>
  `

  return { subject, text, html }
}

export function createTrialReminderSMSTemplate(trial: Trial): string {
  const trialEndDate = new Date(trial.trial_end)
  const daysUntilEnd = Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  
  return `⚠️ TRIAL REMINDER: Your ${trial.service_name} trial ends in ${daysUntilEnd} days (${format(trialEndDate, 'MMM d')}). ${trial.cancel_url ? `Cancel: ${trial.cancel_url}` : 'Check your email for cancellation link.'} - SentinelApp`
}

export function createTrialReminderPushTemplate(trial: Trial): {
  title: string
  message: string
  url?: string
} {
  const trialEndDate = new Date(trial.trial_end)
  const daysUntilEnd = Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  
  return {
    title: `${trial.service_name} Trial Ending`,
    message: `Your trial ends in ${daysUntilEnd} days. Tap to manage.`,
    url: trial.cancel_url || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  }
}

// Send trial reminder across all channels
export async function sendTrialReminder(
  userId: string,
  trial: Trial,
  channels: Array<'email' | 'sms' | 'push'>,
  userPreferences: {
    email?: string
    phone?: string
    pushEnabled?: boolean
  }
): Promise<{ sent: string[]; failed: string[] }> {
  const sent: string[] = []
  const failed: string[] = []

  for (const channel of channels) {
    try {
      let notificationId: string
      let result: { success: boolean; messageId?: string; error?: string }

      switch (channel) {
        case 'email':
          if (!userPreferences.email) {
            failed.push(`email: No email address provided`)
            continue
          }

          const emailTemplate = createTrialReminderEmailTemplate(trial)
          notificationId = await saveNotification({
            userId,
            trialId: trial.id,
            type: 'trial_reminder',
            recipient: userPreferences.email,
            subject: emailTemplate.subject,
            message: emailTemplate.text,
          }, 'email')

          result = await sendEmailNotification({
            userId,
            trialId: trial.id,
            type: 'trial_reminder',
            recipient: userPreferences.email,
            subject: emailTemplate.subject,
            message: emailTemplate.text,
            htmlContent: emailTemplate.html,
          })
          break

        case 'sms':
          if (!userPreferences.phone) {
            failed.push(`sms: No phone number provided`)
            continue
          }

          const smsMessage = createTrialReminderSMSTemplate(trial)
          notificationId = await saveNotification({
            userId,
            trialId: trial.id,
            type: 'trial_reminder',
            recipient: userPreferences.phone,
            message: smsMessage,
          }, 'sms')

          result = await sendSMSNotification({
            userId,
            trialId: trial.id,
            type: 'trial_reminder',
            recipient: userPreferences.phone,
            message: smsMessage,
          })
          break

        case 'push':
          if (!userPreferences.pushEnabled) {
            failed.push(`push: Push notifications not enabled`)
            continue
          }

          const pushTemplate = createTrialReminderPushTemplate(trial)
          notificationId = await saveNotification({
            userId,
            trialId: trial.id,
            type: 'trial_reminder',
            recipient: 'push_notification',
            subject: pushTemplate.title,
            message: pushTemplate.message,
          }, 'push')

          result = await sendPushNotification({
            userId,
            trialId: trial.id,
            type: 'trial_reminder',
            recipient: 'push_notification',
            title: pushTemplate.title,
            message: pushTemplate.message,
            url: pushTemplate.url,
          })
          break

        default:
          failed.push(`${channel}: Unsupported channel`)
          continue
      }

      if (result.success) {
        await updateNotificationStatus(notificationId!, 'sent')
        sent.push(`${channel}: ${result.messageId || 'sent'}`)
      } else {
        await updateNotificationStatus(notificationId!, 'failed', result.error)
        failed.push(`${channel}: ${result.error}`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      failed.push(`${channel}: ${errorMessage}`)
    }
  }

  return { sent, failed }
}

// Check for trials needing reminders
export async function checkTrialsForReminders(): Promise<{
  processed: number
  sent: number
  failed: number
}> {
  const supabase = createServerSupabaseClient()
  
  // Get trials ending in the next 48 hours that haven't been reminded recently
  const twoDaysFromNow = new Date()
  twoDaysFromNow.setHours(twoDaysFromNow.getHours() + 48)
  
  const { data: trials } = await supabase
    .from('trials')
    .select(`
      *,
      profiles!inner(email, phone, preferences),
      notifications!left(created_at)
    `)
    .eq('status', 'active')
    .lte('trial_end', twoDaysFromNow.toISOString().split('T')[0])
    .order('trial_end', { ascending: true })

  if (!trials || trials.length === 0) {
    return { processed: 0, sent: 0, failed: 0 }
  }

  let totalSent = 0
  let totalFailed = 0

  for (const trial of trials) {
    // Check if reminder was sent in the last 24 hours
    const recentReminders = trial.notifications?.filter((n: any) => 
      n.type === 'trial_reminder' && 
      new Date(n.created_at) > subDays(new Date(), 1)
    )

    if (recentReminders && recentReminders.length > 0) {
      continue // Skip if already reminded recently
    }

    const profile = trial.profiles
    const preferences = profile.preferences || {}
    
    // Determine which channels to use
    const channels: Array<'email' | 'sms' | 'push'> = []
    
    if (preferences.emailNotifications !== false) channels.push('email')
    if (preferences.smsNotifications === true && profile.phone) channels.push('sms')
    if (preferences.pushNotifications !== false) channels.push('push')

    // Default to email if no preferences set
    if (channels.length === 0) channels.push('email')

    const result = await sendTrialReminder(
      trial.user_id,
      trial,
      channels,
      {
        email: profile.email,
        phone: profile.phone,
        pushEnabled: preferences.pushNotifications !== false,
      }
    )

    totalSent += result.sent.length
    totalFailed += result.failed.length
  }

  return {
    processed: trials.length,
    sent: totalSent,
    failed: totalFailed,
  }
} 