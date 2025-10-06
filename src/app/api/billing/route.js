import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/supabase'
import { createBillingPortalSession } from '@/lib/stripe-server'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
  try {
    // Get the current user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user's profile to find Stripe customer ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No billing information found' },
        { status: 404 }
      )
    }

    // Create billing portal session
    const session = await createBillingPortalSession(profile.stripe_customer_id)

    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.error('Billing portal error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}