import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { fetchTransactions, saveTrialsFromTransactions } from '@/lib/plaid'
import { generateMockPlaidTransaction } from '@/lib/test-utils'

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
      useRealPlaid = false,
      useMockData = false,
      daysPast = 90,
      saveToDatabase = false
    } = body

    let trialTransactions: any[] = []
    let error: string | null = null

    if (useRealPlaid) {
      try {
        console.log('🏦 Fetching real transactions from Plaid...')
        trialTransactions = await fetchTransactions(user.id, daysPast)
        console.log(`Found ${trialTransactions.length} trial transactions`)
      } catch (plaidError) {
        error = plaidError instanceof Error ? plaidError.message : 'Plaid fetch failed'
        console.error('Plaid fetch error:', plaidError)
      }
    } else if (useMockData) {
      console.log('🧪 Using mock transaction data...')
      // Generate multiple mock transactions
      const services = ['Spotify', 'Netflix', 'Adobe', 'Microsoft', 'Disney+']
      trialTransactions = services.map((service, index) => {
        const mockTransaction = generateMockPlaidTransaction()
        mockTransaction.serviceName = service
        mockTransaction.merchantName = service.toUpperCase()
        mockTransaction.amount = [0.99, 1.00, 0.00, 2.99, 4.99][index]
        mockTransaction.estimatedTrialEnd = new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000)
        mockTransaction.rawTransaction.merchant_name = service.toUpperCase()
        mockTransaction.rawTransaction.amount = mockTransaction.amount
        return mockTransaction
      })
    } else {
      return NextResponse.json({ 
        error: 'Must specify either useRealPlaid: true or useMockData: true' 
      }, { status: 400 })
    }

    let savedTrialIds: string[] = []
    
    if (saveToDatabase && trialTransactions.length > 0) {
      try {
        console.log('💾 Saving trials to database...')
        savedTrialIds = await saveTrialsFromTransactions(user.id, trialTransactions)
        console.log(`Saved ${savedTrialIds.length} trials`)
      } catch (saveError) {
        error = saveError instanceof Error ? saveError.message : 'Save failed'
        console.error('Save error:', saveError)
      }
    }

    // Analyze detection quality
    const analysis = {
      totalTransactions: trialTransactions.length,
      byService: trialTransactions.reduce((acc, transaction) => {
        acc[transaction.serviceName] = (acc[transaction.serviceName] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      byAmount: {
        free: trialTransactions.filter(t => t.amount === 0).length,
        dollar: trialTransactions.filter(t => t.amount === 1 || t.amount === 0.99).length,
        other: trialTransactions.filter(t => t.amount !== 0 && t.amount !== 1 && t.amount !== 0.99).length,
      },
      byConfidence: {
        high: trialTransactions.filter(t => t.confidence >= 0.8).length,
        medium: trialTransactions.filter(t => t.confidence >= 0.5 && t.confidence < 0.8).length,
        low: trialTransactions.filter(t => t.confidence < 0.5).length,
      },
      withEstimatedEndDate: trialTransactions.filter(t => t.estimatedTrialEnd).length,
    }

    return NextResponse.json({
      success: !error,
      error,
      trialTransactions,
      savedTrialIds,
      analysis,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error testing Plaid transactions:', error)
    return NextResponse.json(
      { 
        error: 'Failed to test Plaid transactions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Plaid transaction test endpoint',
    usage: {
      'POST with { useRealPlaid: true }': 'Test with real Plaid data',
      'POST with { useMockData: true, saveToDatabase: true }': 'Test with mock data and save',
      'POST with { useRealPlaid: true, daysPast: 180 }': 'Test with more historical data'
    }
  })
} 