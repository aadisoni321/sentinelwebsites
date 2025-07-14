import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { fetchRecentEmails, saveTrialsFromEmails } from '@/lib/gmail'
import { generateMockTrialEmail } from '@/lib/test-utils'

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
      useRealGmail = false,
      useMockData = false,
      emailLimit = 20,
      saveToDatabase = false
    } = body

    let parsedEmails: any[] = []
    let error: string | null = null

    if (useRealGmail) {
      try {
        console.log('📧 Fetching real emails from Gmail...')
        parsedEmails = await fetchRecentEmails(user.id, emailLimit)
        console.log(`Found ${parsedEmails.length} trial emails`)
      } catch (gmailError) {
        error = gmailError instanceof Error ? gmailError.message : 'Gmail fetch failed'
        console.error('Gmail fetch error:', gmailError)
      }
    } else if (useMockData) {
      console.log('🧪 Using mock email data...')
      // Generate multiple mock emails
      const services = ['Netflix', 'Spotify', 'Adobe Creative Cloud', 'Microsoft 365', 'Disney+']
      parsedEmails = services.map((service, index) => {
        const mockEmail = generateMockTrialEmail()
        mockEmail.serviceName = service
        mockEmail.trialEnd = new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000) // Different end dates
        mockEmail.rawData.subject = `Welcome to ${service} - Your free trial has started`
        mockEmail.rawData.from = `${service.toLowerCase()}@${service.toLowerCase().replace(/\s+/g, '')}.com`
        return mockEmail
      })
    } else {
      return NextResponse.json({ 
        error: 'Must specify either useRealGmail: true or useMockData: true' 
      }, { status: 400 })
    }

    let savedTrialIds: string[] = []
    
    if (saveToDatabase && parsedEmails.length > 0) {
      try {
        console.log('💾 Saving trials to database...')
        savedTrialIds = await saveTrialsFromEmails(user.id, parsedEmails)
        console.log(`Saved ${savedTrialIds.length} trials`)
      } catch (saveError) {
        error = saveError instanceof Error ? saveError.message : 'Save failed'
        console.error('Save error:', saveError)
      }
    }

    // Analyze detection quality
    const analysis = {
      totalEmails: parsedEmails.length,
      byService: parsedEmails.reduce((acc, email) => {
        acc[email.serviceName] = (acc[email.serviceName] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      byConfidence: {
        high: parsedEmails.filter(e => e.confidence >= 0.8).length,
        medium: parsedEmails.filter(e => e.confidence >= 0.5 && e.confidence < 0.8).length,
        low: parsedEmails.filter(e => e.confidence < 0.5).length,
      },
      withCancelUrl: parsedEmails.filter(e => e.cancelUrl).length,
      withAmount: parsedEmails.filter(e => e.subscriptionAmount).length,
    }

    return NextResponse.json({
      success: !error,
      error,
      parsedEmails,
      savedTrialIds,
      analysis,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error testing email parsing:', error)
    return NextResponse.json(
      { 
        error: 'Failed to test email parsing',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Email parsing test endpoint',
    usage: {
      'POST with { useRealGmail: true }': 'Test with real Gmail data',
      'POST with { useMockData: true, saveToDatabase: true }': 'Test with mock data and save',
      'POST with { useRealGmail: true, emailLimit: 50 }': 'Test with more emails'
    }
  })
} 