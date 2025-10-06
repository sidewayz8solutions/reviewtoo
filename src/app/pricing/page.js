'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GraduationCap, Check, Loader2, Crown, AlertCircle } from 'lucide-react'
import { getCurrentUser, getUserSubscription } from '@/lib/supabase'

export default function PricingPage() {
  const [user, setUser] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processingPayment, setProcessingPayment] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkUserAndSubscription()
  }, [])

  const checkUserAndSubscription = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      if (currentUser) {
        const { data: userSubscription } = await getUserSubscription(currentUser.id)
        setSubscription(userSubscription)
      }
    } catch (error) {
      console.error('Error checking user status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async () => {
    if (!user) {
      router.push('/login?redirect=pricing')
      return
    }

    setProcessingPayment(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO || 'price_1234567890',
        }),
      })

      const { url, error } = await response.json()

      if (error) {
        throw new Error(error)
      }

      // Redirect to Stripe Checkout
      window.location.href = url
    } catch (error) {
      console.error('Payment error:', error)
      alert('Something went wrong. Please try again.')
      setProcessingPayment(false)
    }
  }

  const isProUser = subscription?.status === 'active'

  if (loading) {
    return (
      <div className=\"min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center\">
        <Loader2 className=\"w-8 h-8 animate-spin text-purple-600\" />
      </div>
    )
  }

  return (
    <div className=\"min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50\">
      {/* Navigation */}
      <nav className=\"bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50\">
        <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
          <div className=\"flex justify-between items-center h-16\">
            <Link href=\"/\" className=\"flex items-center gap-3\">
              <div className=\"bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl\">
                <GraduationCap className=\"w-6 h-6 text-white\" />
              </div>
              <div>
                <h1 className=\"text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent\">
                  LearnCraft AI
                </h1>
              </div>
            </Link>
            <div className=\"flex items-center gap-4\">
              {user ? (
                <>
                  {isProUser && (
                    <div className=\"flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold\">
                      <Crown className=\"w-4 h-4\" />
                      Pro User
                    </div>
                  )}
                  <Link 
                    href=\"/account\"
                    className=\"text-gray-700 hover:text-purple-600 font-medium transition-colors\"
                  >
                    Account
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href=\"/login\"
                    className=\"text-gray-700 hover:text-purple-600 font-medium transition-colors\"
                  >
                    Log In
                  </Link>
                  <Link 
                    href=\"/signup\"
                    className=\"bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105\"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16\">
        <div className=\"text-center mb-16\">
          <h1 className=\"text-5xl font-bold text-gray-900 mb-6\">
            Simple, Transparent Pricing
          </h1>
          <p className=\"text-xl text-gray-600 max-w-2xl mx-auto\">
            Start free, upgrade when you're ready to unlock unlimited lesson planning
          </p>
          {isProUser && (
            <div className=\"mt-6 inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold\">
              <Check className=\"w-5 h-5\" />
              You're on the Pro plan!
            </div>
          )}
        </div>

        {/* Success/Error Messages */}
        {typeof window !== 'undefined' && (
          <>
            {new URLSearchParams(window.location.search).get('success') && (
              <div className=\"max-w-md mx-auto mb-8 p-4 bg-green-100 border border-green-300 rounded-lg text-green-700 text-center\">
                <Check className=\"w-6 h-6 inline-block mr-2\" />
                Welcome to Pro! Your subscription is now active.
              </div>
            )}
            {new URLSearchParams(window.location.search).get('canceled') && (
              <div className=\"max-w-md mx-auto mb-8 p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-700 text-center\">
                <AlertCircle className=\"w-6 h-6 inline-block mr-2\" />
                Payment was canceled. You can try again anytime.
              </div>
            )}
          </>
        )}

        {/* Pricing Cards */}
        <div className=\"grid md:grid-cols-2 gap-8 max-w-4xl mx-auto\">
          {/* Free Plan */}
          <div className=\"border-2 border-gray-200 rounded-3xl p-8 bg-white\">
            <h3 className=\"text-2xl font-bold text-gray-900 mb-2\">Free</h3>
            <div className=\"mb-6\">
              <span className=\"text-4xl font-bold text-gray-900\">$0</span>
              <span className=\"text-gray-600\">/month</span>
            </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">1 lesson plan total</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">All grade levels (K-5)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">PDF export</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Save to library</span>
                </li>
              </ul>
            {!user ? (
              <Link 
                href=\"/signup\"
                className=\"block text-center bg-gray-100 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors\"
              >
                Get Started Free
              </Link>
            ) : !isProUser ? (
              <div className=\"text-center text-gray-500 font-medium py-3\">
                Your current plan
              </div>
            ) : (
              <div className=\"text-center text-gray-400 font-medium py-3\">
                Free plan available
              </div>
            )}
          </div>

          {/* Pro Plan */}
          <div className={`border-4 rounded-3xl p-8 relative overflow-hidden bg-white ${
            isProUser ? 'border-green-500' : 'border-purple-500'
          }`}>
            <div className={`absolute top-4 right-4 text-white px-3 py-1 rounded-full text-sm font-bold ${
              isProUser 
                ? 'bg-green-500' 
                : 'bg-gradient-to-r from-purple-500 to-pink-500'
            }`}>
              {isProUser ? 'Active' : 'Most Popular'}
            </div>
            <h3 className=\"text-2xl font-bold text-gray-900 mb-2\">Pro</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">$39.99</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className=\"space-y-3 mb-8\">
              <li className=\"flex items-start gap-2\">
                <Check className=\"w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5\" />
                <span className=\"text-gray-600\">Unlimited lessons</span>
              </li>
              <li className=\"flex items-start gap-2\">
                <Check className=\"w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5\" />
                <span className=\"text-gray-600\">All grade levels (K-12)</span>
              </li>
              <li className=\"flex items-start gap-2\">
                <Check className=\"w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5\" />
                <span className=\"text-gray-600\">Advanced customization</span>
              </li>
              <li className=\"flex items-start gap-2\">
                <Check className=\"w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5\" />
                <span className=\"text-gray-600\">Priority support</span>
              </li>
              <li className=\"flex items-start gap-2\">
                <Check className=\"w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5\" />
                <span className=\"text-gray-600\">Collaboration tools</span>
              </li>
            </ul>
            {isProUser ? (
              <Link
                href=\"/account\"
                className=\"block w-full text-center bg-green-100 text-green-700 px-6 py-3 rounded-xl font-semibold hover:bg-green-200 transition-colors\"
              >
                Manage Subscription
              </Link>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={processingPayment}
                className=\"block w-full text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2\"
              >
                {processingPayment ? (
                  <>
                    <Loader2 className=\"w-5 h-5 animate-spin\" />
                    Processing...
                  </>
                ) : (
                  'Upgrade to Pro'
                )}
              </button>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className=\"mt-20\">
          <h2 className=\"text-3xl font-bold text-gray-900 text-center mb-12\">
            Frequently Asked Questions
          </h2>
          <div className=\"max-w-3xl mx-auto space-y-8\">
            <div className=\"bg-white rounded-2xl p-6 shadow-sm\">
              <h3 className=\"text-xl font-bold text-gray-900 mb-3\">
                Can I cancel my subscription anytime?
              </h3>
              <p className=\"text-gray-600\">
                Yes! You can cancel your Pro subscription at any time. You'll continue to have access to Pro features until the end of your current billing period.
              </p>
            </div>
            <div className=\"bg-white rounded-2xl p-6 shadow-sm\">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Is there a free trial for the Pro plan?
              </h3>
              <p className="text-gray-600">
                While we don't offer a traditional free trial, our free plan gives you 1 lesson plan to try out LearnCraft AI. You can upgrade to Pro whenever you're ready for unlimited lessons.
              </p>
            </div>
            <div className=\"bg-white rounded-2xl p-6 shadow-sm\">
              <h3 className=\"text-xl font-bold text-gray-900 mb-3\">
                What payment methods do you accept?
              </h3>
              <p className=\"text-gray-600\">
                We accept all major credit cards and debit cards through Stripe, our secure payment processor. Your payment information is never stored on our servers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}