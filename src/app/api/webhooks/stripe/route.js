import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import stripe from '@/lib/stripe-server'
import { createUserSubscription, updateUserSubscription, cancelUserSubscription, updateUserProfile } from '@/lib/supabase'

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (err) {
    console.error(`Webhook signature verification failed.`, err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object)
        break
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object)
        break
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleSubscriptionCreated(subscription) {
  console.log('Subscription created:', subscription.id)
  
  const customer = await stripe.customers.retrieve(subscription.customer)
  const userId = customer.metadata.supabase_user_id

  if (userId) {
    await createUserSubscription(userId, subscription.customer, subscription)
    console.log(`Subscription created for user ${userId}`)
  }
}

async function handleSubscriptionUpdated(subscription) {
  console.log('Subscription updated:', subscription.id)
  
  const customer = await stripe.customers.retrieve(subscription.customer)
  const userId = customer.metadata.supabase_user_id

  if (userId) {
    await updateUserSubscription(userId, subscription)
    console.log(`Subscription updated for user ${userId}`)
  }
}

async function handleSubscriptionDeleted(subscription) {
  console.log('Subscription deleted:', subscription.id)
  
  const customer = await stripe.customers.retrieve(subscription.customer)
  const userId = customer.metadata.supabase_user_id

  if (userId) {
    await cancelUserSubscription(userId, subscription.id)
    console.log(`Subscription canceled for user ${userId}`)
  }
}

async function handlePaymentSucceeded(invoice) {
  console.log('Payment succeeded for subscription:', invoice.subscription)
  
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription)
    await handleSubscriptionUpdated(subscription)
  }
}

async function handlePaymentFailed(invoice) {
  console.log('Payment failed for subscription:', invoice.subscription)
  
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription)
    await handleSubscriptionUpdated(subscription)
  }
}