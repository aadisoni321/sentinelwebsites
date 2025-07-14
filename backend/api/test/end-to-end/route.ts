import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { EndToEndTester, testNotificationSending } from '@/lib/test-utils'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check if user is authenticated
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get request body for specific test options
    const body = await request.json()
    const { 
      includeNotificationTest = false,
      includeMockData = false,
      testSpecificStep 
    } = body

    const tester = new EndToEndTester(user.id)

    // Run specific test if requested
    if (testSpecificStep) {
      let result
      switch (testSpecificStep) {
        case 'gmail':
          result = await tester.testGmailConnection()
          break
        case 'plaid':
          result = await tester.testPlaidConnection()
          break
        case 'calendar':
          result = await tester.testCalendarConnection()
          break
        case 'trials':
          result = await tester.testTrialDetection()
          break
        case 'duplicates':
          result = await tester.testDuplicateDetection()
          break
        case 'calendar-sync':
          result = await tester.testCalendarSync()
          break
        case 'notifications':
          result = await tester.testNotifications()
          break
        case 'security':
          result = await tester.testRLSSecurity()
          break
        default:
          return NextResponse.json({ error: 'Invalid test step' }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        step: testSpecificStep,
        result,
        timestamp: new Date().toISOString()
      })
    }

    // Run full end-to-end test
    const testResults = await tester.runFullFlowTest()

    // Optionally test notification sending
    let notificationTestResult = null
    if (includeNotificationTest) {
      console.log('\n🧪 Testing notification sending...')
      notificationTestResult = await testNotificationSending(user.id)
      console.log(`   ${notificationTestResult.success ? '✅' : '❌'} ${notificationTestResult.message}`)
    }

    // Get test summary
    const summary = tester.getTestSummary()

    return NextResponse.json({
      success: true,
      summary,
      testResults,
      notificationTest: notificationTestResult,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error running end-to-end test:', error)
    return NextResponse.json(
      { 
        error: 'Failed to run end-to-end test',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'End-to-end testing endpoint',
    usage: {
      'POST /api/test/end-to-end': 'Run full end-to-end test',
      'POST /api/test/end-to-end with { testSpecificStep: "gmail" }': 'Test specific component',
      'POST /api/test/end-to-end with { includeNotificationTest: true }': 'Include notification testing'
    }
  })
} 