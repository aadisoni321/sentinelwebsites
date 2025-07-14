import { NextRequest, NextResponse } from 'next/server'
import { checkTrialsForReminders } from '@/lib/notifications'

export async function POST(request: NextRequest) {
  try {
    // Verify the request is from a cron job or has proper authorization
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.CRON_SECRET_TOKEN
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check for trials needing reminders
    const result = await checkTrialsForReminders()

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error checking trials for reminders:', error)
    return NextResponse.json(
      { 
        error: 'Failed to check trials for reminders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Allow GET for health checks
  return NextResponse.json({ 
    status: 'ok', 
    service: 'notification-checker',
    timestamp: new Date().toISOString()
  })
} 