import { NextRequest, NextResponse } from 'next/server'
import { fetchTransactions, saveTrialsFromTransactions } from '@/lib/plaid'
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
    const { daysPast = 90 } = body

    // Fetch and analyze transactions
    const trialTransactions = await fetchTransactions(user.id, daysPast)
    
    // Save trials to database
    const trialIds = await saveTrialsFromTransactions(user.id, trialTransactions)

    return NextResponse.json({
      success: true,
      transactionsProcessed: trialTransactions.length,
      trialsFound: trialIds.length,
      trialIds,
      trials: trialTransactions.map(transaction => ({
        serviceName: transaction.serviceName,
        merchantName: transaction.merchantName,
        amount: transaction.amount,
        date: transaction.date,
        confidence: transaction.confidence,
        estimatedTrialEnd: transaction.estimatedTrialEnd,
      }))
    })
  } catch (error) {
    console.error('Error scanning transactions:', error)
    return NextResponse.json(
      { 
        error: 'Failed to scan transactions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 