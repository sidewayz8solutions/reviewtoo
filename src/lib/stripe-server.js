import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

export default stripe

// Create a customer in Stripe
export const createStripeCustomer = async (email, userId) => {
  try {
    const customer = await stripe.customers.create({
      email,
      metadata: {
        supabase_user_id: userId,
      },
    })
    return customer
  } catch (error) {
    throw new Error(`Failed to create Stripe customer: ${error.message}`)
  }
}

// Create a subscription checkout session
export const createCheckoutSession = async (customerId, priceId, userId) => {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        user_id: userId,
      },
    })
    return session
  } catch (error) {
    throw new Error(`Failed to create checkout session: ${error.message}`)
  }
}

// Create a billing portal session
export const createBillingPortalSession = async (customerId) => {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
    })
    return session
  } catch (error) {
    throw new Error(`Failed to create billing portal session: ${error.message}`)
  }
}

// Get subscription details
export const getSubscription = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    return subscription
  } catch (error) {
    throw new Error(`Failed to retrieve subscription: ${error.message}`)
  }
}

// Get customer by email
export const getCustomerByEmail = async (email) => {
  try {
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    })
    return customers.data[0] || null
  } catch (error) {
    throw new Error(`Failed to retrieve customer: ${error.message}`)
  }
}