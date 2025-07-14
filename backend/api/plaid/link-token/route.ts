import { NextRequest, NextResponse } from 'next/server'
import { createLinkToken } from '@/lib/plaid'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check if user is authenticated
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create Plaid Link token
    const linkToken = await createLinkToken(user.id)
    
    return NextResponse.json({ link_token: linkToken })
  } catch (error) {
    console.error('Error creating Plaid link token:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create link token',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 