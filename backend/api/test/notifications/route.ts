import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { sendEmailNotification, sendSMSNotification, sendPushNotification } from '@/lib/notifications'

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
      testEmail = true,
      testSMS = false,
      testPush = false,
      customMessage = null
    } = body

    const results: any = {}

    // Get user profile for contact info
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ 
        error: 'User profile not found. Cannot send test notifications.' 
      }, { status: 400 })
    }

    // Create a test trial for notifications
    const testTrial = {
      user_id: user.id,
      source: 'manual' as const,
      service_name: 'Test Service',
      trial_end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
      subscription_amount: 9.99,
      confidence: 1.0,
      status: 'active' as const
    }

    const { data: trial, error: trialError } = await supabase
      .from('trials')
      .insert(testTrial)
      .select()
      .single()

    if (trialError) {
      return NextResponse.json({ 
        error: 'Failed to create test trial',
        details: trialError.message 
      }, { status: 500 })
    }

    const message = customMessage || '🧪 This is a test notification from SentinelApp to verify the notification system is working correctly.'

    // Test email notification
    if (testEmail) {
      try {
        console.log('📧 Testing email notification...')
        const emailResult = await sendEmailNotification({
          userId: user.id,
          trialId: trial.id,
          type: 'trial_reminder',
          recipient: profile.email,
          subject: '🧪 Test Notification - SentinelApp',
          message,
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
              <h2 style="color: #ef4444; text-align: center;">🧪 Test Notification</h2>
              <div style="background-color: white; padding: 20px; border-radius: 6px; margin: 20px 0;">
                <p style="font-size: 16px; line-height: 1.6; color: #374151;">${message}</p>
                <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
                  <strong>Test Details:</strong><br>
                  • Service: Test Service<br>
                  • Trial End: ${trial.trial_end}<br>
                  • Amount: $${trial.subscription_amount}<br>
                  • Sent: ${new Date().toLocaleString()}
                </p>
              </div>
              <p style="text-align: center; color: #6b7280; font-size: 12px;">
                If you received this email, the notification system is working correctly! 🎉
              </p>
            </div>
          `
        })

        results.email = {
          success: emailResult.success,
          message: emailResult.success ? 'Email sent successfully' : 'Email failed',
          error: emailResult.error,
          notificationId: emailResult.notificationId
        }
      } catch (emailError) {
        results.email = {
          success: false,
          error: emailError instanceof Error ? emailError.message : 'Unknown error'
        }
      }
    }

    // Test SMS notification
    if (testSMS && profile.phone_number) {
      try {
        console.log('📱 Testing SMS notification...')
        const smsResult = await sendSMSNotification({
          userId: user.id,
          trialId: trial.id,
          type: 'trial_reminder',
          recipient: profile.phone_number,
          message: `🧪 Test: ${message} Your Test Service trial ends in 2 days.`
        })

        results.sms = {
          success: smsResult.success,
          message: smsResult.success ? 'SMS sent successfully' : 'SMS failed',
          error: smsResult.error,
          notificationId: smsResult.notificationId
        }
      } catch (smsError) {
        results.sms = {
          success: false,
          error: smsError instanceof Error ? smsError.message : 'Unknown error'
        }
      }
    } else if (testSMS && !profile.phone_number) {
      results.sms = {
        success: false,
        error: 'No phone number found in user profile'
      }
    }

    // Test push notification
    if (testPush) {
      try {
        console.log('🔔 Testing push notification...')
        const pushResult = await sendPushNotification({
          userId: user.id,
          trialId: trial.id,
          type: 'trial_reminder',
          title: '🧪 Test Notification',
          message,
          data: {
            trialId: trial.id,
            serviceName: trial.service_name,
            trialEnd: trial.trial_end
          }
        })

        results.push = {
          success: pushResult.success,
          message: pushResult.success ? 'Push notification sent successfully' : 'Push notification failed',
          error: pushResult.error,
          notificationId: pushResult.notificationId
        }
      } catch (pushError) {
        results.push = {
          success: false,
          error: pushError instanceof Error ? pushError.message : 'Unknown error'
        }
      }
    }

    // Clean up test trial
    await supabase
      .from('trials')
      .delete()
      .eq('id', trial.id)

    return NextResponse.json({
      success: true,
      results,
      testTrial: {
        id: trial.id,
        serviceName: trial.service_name,
        trialEnd: trial.trial_end
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error testing notifications:', error)
    return NextResponse.json(
      { 
        error: 'Failed to test notifications',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Notification testing endpoint',
    usage: {
      'POST with { testEmail: true }': 'Test email notifications',
      'POST with { testSMS: true }': 'Test SMS notifications (requires phone number)',
      'POST with { testPush: true }': 'Test push notifications',
      'POST with { testEmail: true, customMessage: "Custom test message" }': 'Test with custom message'
    }
  })
} 