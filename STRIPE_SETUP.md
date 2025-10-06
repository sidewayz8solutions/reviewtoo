# Stripe Payment Integration Setup Guide

This guide will help you set up Stripe payments for your LearnCraft AI application.

## Prerequisites

1. A Stripe account (sign up at [stripe.com](https://stripe.com))
2. Your Supabase project set up and running
3. Next.js application running locally

## Step 1: Stripe Account Setup

1. **Create a Stripe Account** (if you haven't already)
   - Go to [stripe.com](https://stripe.com) and sign up
   - Complete the account verification process

2. **Get Your API Keys**
   - Go to your Stripe Dashboard
   - Navigate to `Developers > API Keys`
   - Copy your `Publishable key` and `Secret key` (use test keys for development)

3. **Create a Product and Price**
   - Go to `Products` in your Stripe Dashboard
   - Click `Add Product`
   - Name: "LearnCraft AI Pro"
   - Description: "Unlimited AI-powered lesson plans"
   - Set up pricing: $39.99/month recurring
   - Copy the `Price ID` (starts with `price_`)

## Step 2: Environment Variables

Update your `.env.local` file with the Stripe keys:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PRICE_ID_PRO=price_your_price_id_here
```

## Step 3: Database Setup

Run the SQL migration script to create the necessary tables:

1. Go to your Supabase project dashboard
2. Navigate to `SQL Editor`
3. Copy and paste the contents of `supabase-migration.sql`
4. Click `Run` to execute the migration

This will create:
- `profiles` table for user information
- `user_subscriptions` table for subscription tracking
- `lessons` table (if it doesn't exist)
- All necessary RLS policies and indexes

## Step 4: Webhook Setup

1. **Create a Webhook Endpoint in Stripe**
   - Go to `Developers > Webhooks` in your Stripe Dashboard
   - Click `Add endpoint`
   - Endpoint URL: `https://yourdomain.com/api/webhooks/stripe` (for production)
   - For local development: Use a tool like ngrok to expose your local server
   - Select these events to listen for:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

2. **Get Webhook Secret**
   - After creating the webhook, click on it
   - Go to `Signing secret` section
   - Click `Reveal` and copy the webhook secret
   - Add it to your `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Step 5: Testing the Integration

1. **Start your development server**
   ```bash
   npm run dev
   ```

2. **Test the payment flow**
   - Visit `/pricing` page
   - Click "Upgrade to Pro" 
   - Use Stripe's test card: `4242 4242 4242 4242`
   - Use any future date for expiry and any 3-digit CVC
   - Complete the payment flow

3. **Verify webhook delivery** (for local testing)
   - Install ngrok: `npm install -g ngrok`
   - Expose your local server: `ngrok http 3000`
   - Update your webhook URL in Stripe to use the ngrok URL
   - Test a payment and check the webhook delivery in Stripe Dashboard

## Step 6: Production Deployment

1. **Update environment variables** in your production environment
2. **Update webhook URL** in Stripe to point to your production domain
3. **Switch to live API keys** when ready for real payments
4. **Test the complete flow** in production

## Available Pages and Features

### User-Facing Pages
- `/pricing` - Pricing page with payment integration
- `/account` - Account management and billing portal
- Landing page updated with active Pro plan

### API Endpoints
- `/api/checkout` - Creates Stripe checkout sessions
- `/api/billing` - Creates billing portal sessions
- `/api/webhooks/stripe` - Handles Stripe webhooks

### Database Tables
- `profiles` - User profile information including Stripe customer ID
- `user_subscriptions` - Subscription status and billing details
- `lessons` - Lesson storage with user association

## Subscription Features

### Free Plan (Default)
- 1 lesson plan total
- All grade levels (K-5)
- PDF export
- Save to library

### Pro Plan ($39.99/month)
- Unlimited lessons
- All grade levels (K-12)
- Advanced customization
- Priority support
- Collaboration tools

## Usage Limits Enforcement

The application automatically:
- Tracks total lesson creation per user
- Enforces 1-lesson limit for free users (total, not monthly)
- Allows unlimited lessons for Pro subscribers
- Shows usage warnings and upgrade prompts

## Billing Management

Users can:
- View their current subscription status
- Access Stripe's billing portal for:
  - Updating payment methods
  - Downloading invoices
  - Canceling subscriptions
  - Viewing billing history

## Security Features

- Row Level Security (RLS) on all database tables
- Webhook signature verification
- Secure API key handling
- User authentication required for all subscription operations

## Troubleshooting

### Common Issues

1. **Webhook not receiving events**
   - Check webhook URL is accessible
   - Verify webhook secret is correct
   - Check server logs for errors

2. **Payment not working**
   - Verify API keys are correct
   - Check Price ID is valid
   - Ensure test mode is enabled for development

3. **Database errors**
   - Verify migration was run successfully
   - Check RLS policies are enabled
   - Ensure user has proper permissions

### Test Cards for Development

Use these test cards with Stripe:
- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`
- Requires authentication: `4000 0025 0000 3155`

## Support

For issues with this integration:
1. Check the server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test with Stripe's test mode and test cards first
4. Check Stripe's documentation for additional webhook events or API changes