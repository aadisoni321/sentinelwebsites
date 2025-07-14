import { createServerSupabaseClient } from './supabase-server'
import { Trial, Profile, ConnectedAccount } from '@/types/database'
import { ParsedTrialEmail } from './gmail'
import { PlaidTrialTransaction } from './plaid'

export interface TestResult {
  success: boolean
  message: string
  data?: any
  error?: string
  duration?: number
}

export interface FlowTestResult {
  step: string
  result: TestResult
  timestamp: string
}

export class EndToEndTester {
  private userId: string
  private testResults: FlowTestResult[] = []

  constructor(userId: string) {
    this.userId = userId
  }

  async testGmailConnection(): Promise<TestResult> {
    const startTime = Date.now()
    
    try {
      const supabase = createServerSupabaseClient()
      
      // Check if Gmail account is connected
      const { data: account, error } = await supabase
        .from('connected_accounts')
        .select('*')
        .eq('user_id', this.userId)
        .eq('provider', 'gmail')
        .eq('is_active', true)
        .single()

      if (error || !account) {
        return {
          success: false,
          message: 'Gmail account not connected',
          error: error?.message || 'No active Gmail account found'
        }
      }

      // Test token validity
      if (account.expires_at && new Date(account.expires_at) <= new Date()) {
        return {
          success: false,
          message: 'Gmail access token expired',
          error: 'Token needs refresh'
        }
      }

      return {
        success: true,
        message: 'Gmail connection verified',
        data: { accountId: account.account_id },
        duration: Date.now() - startTime
      }
    } catch (error) {
      return {
        success: false,
        message: 'Gmail connection test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime
      }
    }
  }

  async testPlaidConnection(): Promise<TestResult> {
    const startTime = Date.now()
    
    try {
      const supabase = createServerSupabaseClient()
      
      const { data: account, error } = await supabase
        .from('connected_accounts')
        .select('*')
        .eq('user_id', this.userId)
        .eq('provider', 'plaid')
        .eq('is_active', true)
        .single()

      if (error || !account) {
        return {
          success: false,
          message: 'Plaid account not connected',
          error: error?.message || 'No active Plaid account found'
        }
      }

      return {
        success: true,
        message: 'Plaid connection verified',
        data: { accountId: account.account_id },
        duration: Date.now() - startTime
      }
    } catch (error) {
      return {
        success: false,
        message: 'Plaid connection test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime
      }
    }
  }

  async testCalendarConnection(): Promise<TestResult> {
    const startTime = Date.now()
    
    try {
      const supabase = createServerSupabaseClient()
      
      const { data: account, error } = await supabase
        .from('connected_accounts')
        .select('*')
        .eq('user_id', this.userId)
        .eq('provider', 'google_calendar')
        .eq('is_active', true)
        .single()

      if (error || !account) {
        return {
          success: false,
          message: 'Calendar account not connected',
          error: error?.message || 'No active Calendar account found'
        }
      }

      return {
        success: true,
        message: 'Calendar connection verified',
        data: { accountId: account.account_id },
        duration: Date.now() - startTime
      }
    } catch (error) {
      return {
        success: false,
        message: 'Calendar connection test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime
      }
    }
  }

  async testTrialDetection(): Promise<TestResult> {
    const startTime = Date.now()
    
    try {
      const supabase = createServerSupabaseClient()
      
      // Get recent trials for this user
      const { data: trials, error } = await supabase
        .from('trials')
        .select('*')
        .eq('user_id', this.userId)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) {
        return {
          success: false,
          message: 'Failed to fetch trials',
          error: error.message
        }
      }

      const detectionStats = {
        totalTrials: trials.length,
        bySource: {
          email: trials.filter(t => t.source === 'email').length,
          financial: trials.filter(t => t.source === 'financial').length,
          manual: trials.filter(t => t.source === 'manual').length,
        },
        byConfidence: {
          high: trials.filter(t => t.confidence >= 0.8).length,
          medium: trials.filter(t => t.confidence >= 0.5 && t.confidence < 0.8).length,
          low: trials.filter(t => t.confidence < 0.5).length,
        },
        activeTrials: trials.filter(t => t.status === 'active').length,
      }

      return {
        success: true,
        message: `Found ${trials.length} trials`,
        data: { trials, detectionStats },
        duration: Date.now() - startTime
      }
    } catch (error) {
      return {
        success: false,
        message: 'Trial detection test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime
      }
    }
  }

  async testDuplicateDetection(): Promise<TestResult> {
    const startTime = Date.now()
    
    try {
      const supabase = createServerSupabaseClient()
      
      // Check for potential duplicates
      const { data: trials, error } = await supabase
        .from('trials')
        .select('*')
        .eq('user_id', this.userId)
        .order('created_at', { ascending: false })

      if (error) {
        return {
          success: false,
          message: 'Failed to fetch trials for duplicate check',
          error: error.message
        }
      }

      const duplicates = this.findDuplicateTrials(trials)
      
      return {
        success: true,
        message: `Found ${duplicates.length} potential duplicates`,
        data: { duplicates, totalTrials: trials.length },
        duration: Date.now() - startTime
      }
    } catch (error) {
      return {
        success: false,
        message: 'Duplicate detection test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime
      }
    }
  }

  async testCalendarSync(): Promise<TestResult> {
    const startTime = Date.now()
    
    try {
      const supabase = createServerSupabaseClient()
      
      // Check calendar events
      const { data: events, error } = await supabase
        .from('calendar_events')
        .select(`
          *,
          trials!inner(*)
        `)
        .eq('user_id', this.userId)

      if (error) {
        return {
          success: false,
          message: 'Failed to fetch calendar events',
          error: error.message
        }
      }

      const syncStats = {
        totalEvents: events.length,
        eventsWithExternalId: events.filter(e => e.external_event_id).length,
        upcomingEvents: events.filter(e => new Date(e.event_date) > new Date()).length,
      }

      return {
        success: true,
        message: `Found ${events.length} calendar events`,
        data: { events, syncStats },
        duration: Date.now() - startTime
      }
    } catch (error) {
      return {
        success: false,
        message: 'Calendar sync test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime
      }
    }
  }

  async testNotifications(): Promise<TestResult> {
    const startTime = Date.now()
    
    try {
      const supabase = createServerSupabaseClient()
      
      // Check recent notifications
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', this.userId)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) {
        return {
          success: false,
          message: 'Failed to fetch notifications',
          error: error.message
        }
      }

      const notificationStats = {
        total: notifications.length,
        byChannel: {
          email: notifications.filter(n => n.channel === 'email').length,
          sms: notifications.filter(n => n.channel === 'sms').length,
          push: notifications.filter(n => n.channel === 'push').length,
        },
        byStatus: {
          sent: notifications.filter(n => n.status === 'sent').length,
          failed: notifications.filter(n => n.status === 'failed').length,
          pending: notifications.filter(n => n.status === 'pending').length,
        },
        byType: {
          trial_reminder: notifications.filter(n => n.type === 'trial_reminder').length,
          trial_expired: notifications.filter(n => n.type === 'trial_expired').length,
          cancellation_success: notifications.filter(n => n.type === 'cancellation_success').length,
        }
      }

      return {
        success: true,
        message: `Found ${notifications.length} notifications`,
        data: { notifications, notificationStats },
        duration: Date.now() - startTime
      }
    } catch (error) {
      return {
        success: false,
        message: 'Notifications test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime
      }
    }
  }

  async testRLSSecurity(): Promise<TestResult> {
    const startTime = Date.now()
    
    try {
      const supabase = createServerSupabaseClient()
      
      // Try to access another user's data (should fail)
      const { data: otherUserTrials, error: trialsError } = await supabase
        .from('trials')
        .select('*')
        .neq('user_id', this.userId)
        .limit(1)

      const { data: otherUserNotifications, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .neq('user_id', this.userId)
        .limit(1)

      const securityResults = {
        trialsAccessBlocked: !otherUserTrials || otherUserTrials.length === 0,
        notificationsAccessBlocked: !otherUserNotifications || otherUserNotifications.length === 0,
        trialsError: trialsError?.message,
        notificationsError: notificationsError?.message,
      }

      const allBlocked = securityResults.trialsAccessBlocked && securityResults.notificationsAccessBlocked

      return {
        success: allBlocked,
        message: allBlocked ? 'RLS security working correctly' : 'RLS security issues detected',
        data: securityResults,
        duration: Date.now() - startTime
      }
    } catch (error) {
      return {
        success: false,
        message: 'RLS security test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime
      }
    }
  }

  async runFullFlowTest(): Promise<FlowTestResult[]> {
    console.log('🚀 Starting end-to-end flow test...')
    
    const tests = [
      { name: 'Gmail Connection', test: () => this.testGmailConnection() },
      { name: 'Plaid Connection', test: () => this.testPlaidConnection() },
      { name: 'Calendar Connection', test: () => this.testCalendarConnection() },
      { name: 'Trial Detection', test: () => this.testTrialDetection() },
      { name: 'Duplicate Detection', test: () => this.testDuplicateDetection() },
      { name: 'Calendar Sync', test: () => this.testCalendarSync() },
      { name: 'Notifications', test: () => this.testNotifications() },
      { name: 'RLS Security', test: () => this.testRLSSecurity() },
    ]

    for (const { name, test } of tests) {
      console.log(`\n🔍 Testing: ${name}`)
      const result = await test()
      
      this.testResults.push({
        step: name,
        result,
        timestamp: new Date().toISOString()
      })

      console.log(`   ${result.success ? '✅' : '❌'} ${result.message}`)
      if (result.error) {
        console.log(`   Error: ${result.error}`)
      }
      if (result.duration) {
        console.log(`   Duration: ${result.duration}ms`)
      }
    }

    return this.testResults
  }

  private findDuplicateTrials(trials: Trial[]): Array<{ trial1: Trial; trial2: Trial; reason: string }> {
    const duplicates: Array<{ trial1: Trial; trial2: Trial; reason: string }> = []
    
    for (let i = 0; i < trials.length; i++) {
      for (let j = i + 1; j < trials.length; j++) {
        const trial1 = trials[i]
        const trial2 = trials[j]
        
        // Check for same service name and similar dates
        if (trial1.service_name.toLowerCase() === trial2.service_name.toLowerCase()) {
          const date1 = new Date(trial1.trial_end)
          const date2 = new Date(trial2.trial_end)
          const daysDiff = Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24)
          
          if (daysDiff <= 7) {
            duplicates.push({
              trial1,
              trial2,
              reason: `Same service (${trial1.service_name}) with similar end dates (${daysDiff.toFixed(1)} days apart)`
            })
          }
        }
      }
    }
    
    return duplicates
  }

  getTestSummary(): {
    totalTests: number
    passed: number
    failed: number
    totalDuration: number
    criticalIssues: string[]
  } {
    const totalTests = this.testResults.length
    const passed = this.testResults.filter(r => r.result.success).length
    const failed = totalTests - passed
    const totalDuration = this.testResults.reduce((sum, r) => sum + (r.result.duration || 0), 0)
    
    const criticalIssues = this.testResults
      .filter(r => !r.result.success)
      .map(r => `${r.step}: ${r.result.error || r.result.message}`)

    return {
      totalTests,
      passed,
      failed,
      totalDuration,
      criticalIssues
    }
  }
}

// Mock data generators for testing
export function generateMockTrialEmail(): ParsedTrialEmail {
  return {
    serviceName: 'Netflix',
    trialStart: new Date(),
    trialEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    cancelUrl: 'https://netflix.com/account/cancel',
    subscriptionAmount: 15.99,
    confidence: 0.9,
    rawData: {
      subject: 'Welcome to Netflix - Your free trial has started',
      from: 'netflix@netflix.com',
      date: new Date(),
      body: 'Your Netflix free trial has started. Cancel anytime before your trial ends to avoid charges.',
      messageId: 'mock-message-id-123'
    }
  }
}

export function generateMockPlaidTransaction(): PlaidTrialTransaction {
  return {
    serviceName: 'Spotify',
    merchantName: 'SPOTIFY USA',
    amount: 0.99,
    date: new Date(),
    transactionId: 'mock-transaction-123',
    accountId: 'mock-account-123',
    confidence: 0.8,
    estimatedTrialStart: new Date(),
    estimatedTrialEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    rawTransaction: {
      transaction_id: 'mock-transaction-123',
      account_id: 'mock-account-123',
      amount: 0.99,
      date: new Date().toISOString().split('T')[0],
      merchant_name: 'SPOTIFY USA',
      category: ['Entertainment', 'Music']
    }
  }
}

// Test notification sending
export async function testNotificationSending(userId: string): Promise<TestResult> {
  const startTime = Date.now()
  
  try {
    const supabase = createServerSupabaseClient()
    
    // Get user profile for contact info
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!profile) {
      return {
        success: false,
        message: 'User profile not found',
        error: 'Cannot send test notifications without user profile'
      }
    }

    // Create a test trial
    const testTrial: Partial<Trial> = {
      user_id: userId,
      source: 'manual',
      service_name: 'Test Service',
      trial_end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
      subscription_amount: 9.99,
      confidence: 1.0,
      status: 'active'
    }

    const { data: trial, error: trialError } = await supabase
      .from('trials')
      .insert(testTrial)
      .select()
      .single()

    if (trialError) {
      return {
        success: false,
        message: 'Failed to create test trial',
        error: trialError.message
      }
    }

    // Test email notification
    const { sendEmailNotification } = await import('./notifications')
    
    const emailResult = await sendEmailNotification({
      userId,
      trialId: trial.id,
      type: 'trial_reminder',
      recipient: profile.email,
      subject: '🧪 Test Notification - Trial Ending Soon',
      message: 'This is a test notification from SentinelApp. Your Test Service trial ends in 2 days.',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #ef4444;">🧪 Test Notification</h2>
          <p>This is a test notification from SentinelApp.</p>
          <p>Your <strong>Test Service</strong> trial ends in 2 days.</p>
          <p>If you received this, the notification system is working correctly!</p>
        </div>
      `
    })

    return {
      success: emailResult.success,
      message: emailResult.success ? 'Test notification sent successfully' : 'Test notification failed',
      data: { trialId: trial.id, emailResult },
      error: emailResult.error,
      duration: Date.now() - startTime
    }
  } catch (error) {
    return {
      success: false,
      message: 'Test notification sending failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - startTime
    }
  }
} 