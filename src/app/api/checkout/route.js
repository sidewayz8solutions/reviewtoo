import { NextResponse } from 'next/server'
import { getCurrentUser, updateUserProfile } from '@/lib/supabase'
import { createStripeCustomer, createCheckoutSession, getCustomerByEmail } from '@/lib/stripe-server'

export async function POST(request) {
  try {
    const { priceId } = await request.json()

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      )
    }

    // Get the current user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if customer already exists in Stripe
    let customer = await getCustomerByEmail(user.email)
    
    // If customer doesn't exist, create one
    if (!customer) {
      customer = await createStripeCustomer(user.email, user.id)
      
      // Update user profile with Stripe customer ID
      await updateUserProfile(user.id, {
        stripe_customer_id: customer.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email
      })
    }

    // Create checkout session
    const session = await createCheckoutSession(
      customer.id,
      priceId,
      user.id
    )

    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}