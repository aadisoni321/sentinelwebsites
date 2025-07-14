import { NextRequest, NextResponse } from 'next/server'
import { fetchRecentEmails, saveTrialsFromEmails } from '@/lib/gmail'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check if user is authenticated
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get request body
    const body = await request.json()
    const { limit = 20 } = body

    // Fetch and parse recent emails
    const parsedEmails = await fetchRecentEmails(user.id, limit)
    
    // Save trials to database
    const trialIds = await saveTrialsFromEmails(user.id, parsedEmails)

    return NextResponse.json({
      success: true,
      emailsProcessed: parsedEmails.length,
      trialsFound: trialIds.length,
      trialIds,
      trials: parsedEmails.map(email => ({
        serviceName: email.serviceName,
        trialEnd: email.trialEnd,
        confidence: email.confidence,
        subscriptionAmount: email.subscriptionAmount,
      }))
    })
  } catch (error) {
    console.error('Error parsing emails:', error)
    return NextResponse.json(
      { 
        error: 'Failed to parse emails',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 