import { NextRequest, NextResponse } from 'next/server'
import { exchangePublicToken, getAccountInfo } from '@/lib/plaid'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check if user is authenticated
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get public token from request body
    const { public_token } = await request.json()
    
    if (!public_token) {
      return NextResponse.json({ error: 'Public token required' }, { status: 400 })
    }

    // Exchange public token for access token
    const accessToken = await exchangePublicToken(public_token)
    
    // Get account information
    const { accounts, item } = await getAccountInfo(accessToken)
    
    // Store connected account in database
    const accountData = {
      user_id: user.id,
      provider: 'plaid' as const,
      account_id: item.item_id,
      access_token: accessToken,
      metadata: {
        institution_id: item.institution_id,
        available_products: item.available_products,
        billed_products: item.billed_products,
        accounts: accounts.map(acc => ({
          account_id: acc.account_id,
          name: acc.name,
          type: acc.type,
          subtype: acc.subtype,
        }))
      },
      is_active: true,
    }

    // Upsert connected account
    const { error: upsertError } = await supabase
      .from('connected_accounts')
      .upsert(accountData, {
        onConflict: 'user_id,provider,account_id',
      })

    if (upsertError) {
      console.error('Error storing Plaid access token:', upsertError)
      return NextResponse.json(
        { error: 'Failed to store account information' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      accounts: accounts.length,
      institution_id: item.institution_id,
    })
  } catch (error) {
    console.error('Error exchanging Plaid token:', error)
    return NextResponse.json(
      { 
        error: 'Failed to exchange token',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 