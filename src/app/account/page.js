'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  GraduationCap, 
  User, 
  CreditCard, 
  Settings, 
  Crown, 
  Calendar,
  Loader2,
  CheckCircle,
  XCircle,
  BookOpen,
  BarChart3,
  LogOut
} from 'lucide-react'
import { getCurrentUser, getUserSubscription, getUserUsage, signOut } from '@/lib/supabase'

export default function AccountPage() {
  const [user, setUser] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [usage, setUsage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processingBilling, setProcessingBilling] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadAccountData()
  }, [])

  const loadAccountData = async () => {
    try {
      const currentUser = await getCurrentUser()
      
      if (!currentUser) {
        router.push('/login')
        return
      }

      setUser(currentUser)

      // Load subscription and usage data
      const [subscriptionData, usageData] = await Promise.all([
        getUserSubscription(currentUser.id),
        getUserUsage(currentUser.id)
      ])

      setSubscription(subscriptionData.data)
      setUsage(usageData)
    } catch (error) {
      console.error('Error loading account data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleManageBilling = async () => {
    setProcessingBilling(true)
    
    try {
      const response = await fetch('/api/billing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const { url, error } = await response.json()

      if (error) {
        throw new Error(error)
      }

      window.location.href = url
    } catch (error) {
      console.error('Billing portal error:', error)
      alert('Unable to open billing portal. Please try again.')
      setProcessingBilling(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const isProUser = subscription?.status === 'active'
  const currentMonth = 'Total'
  const usageCount = usage?.count || 0
  const usageLimit = isProUser ? 'Unlimited' : 1
  const usagePercentage = isProUser ? 0 : Math.min((usageCount / 1) * 100, 100)

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
              {isProUser && (
                <div className=\"flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold\">
                  <Crown className=\"w-4 h-4\" />
                  Pro User
                </div>
              )}
              <Link 
                href=\"/create\"
                className=\"text-gray-700 hover:text-purple-600 font-medium transition-colors\"
              >
                Create Lesson
              </Link>
              <button
                onClick={handleSignOut}
                className=\"flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium transition-colors\"
              >
                <LogOut className=\"w-4 h-4\" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Account Content */}
      <div className=\"max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8\">
        {/* Header */}
        <div className=\"mb-8\">
          <h1 className=\"text-3xl font-bold text-gray-900 mb-2\">Account Settings</h1>
          <p className=\"text-gray-600\">Manage your subscription and account preferences</p>
        </div>

        {/* Success Message */}
        {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('success') && (
          <div className=\"mb-6 p-4 bg-green-100 border border-green-300 rounded-lg text-green-700\">
            <CheckCircle className=\"w-5 h-5 inline-block mr-2\" />
            Welcome to Pro! Your subscription is now active.
          </div>
        )}

        <div className=\"grid gap-6\">
          {/* User Profile */}
          <div className=\"bg-white rounded-2xl p-6 shadow-sm border border-purple-100\">
            <div className=\"flex items-center gap-4 mb-4\">
              <div className=\"bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-full\">
                <User className=\"w-6 h-6 text-purple-600\" />
              </div>
              <div>
                <h2 className=\"text-xl font-bold text-gray-900\">Profile Information</h2>
                <p className=\"text-gray-600\">Your account details</p>
              </div>
            </div>
            <div className=\"space-y-3\">
              <div>
                <label className=\"text-sm font-medium text-gray-500\">Email Address</label>
                <p className=\"text-gray-900\">{user?.email}</p>
              </div>
              <div>
                <label className=\"text-sm font-medium text-gray-500\">Full Name</label>
                <p className=\"text-gray-900\">{user?.user_metadata?.full_name || 'Not provided'}</p>
              </div>
              <div>
                <label className=\"text-sm font-medium text-gray-500\">Account Created</label>
                <p className=\"text-gray-900\">{new Date(user?.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Subscription Status */}
          <div className=\"bg-white rounded-2xl p-6 shadow-sm border border-purple-100\">
            <div className=\"flex items-center gap-4 mb-4\">
              <div className=\"bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-full\">
                <Crown className=\"w-6 h-6 text-purple-600\" />
              </div>
              <div>
                <h2 className=\"text-xl font-bold text-gray-900\">Subscription</h2>
                <p className=\"text-gray-600\">Your current plan and billing</p>
              </div>
            </div>
            
            <div className=\"grid md:grid-cols-2 gap-6\">
              <div>
                <div className=\"space-y-3\">
                  <div>
                    <label className=\"text-sm font-medium text-gray-500\">Current Plan</label>
                    <div className=\"flex items-center gap-2\">
                      <p className=\"text-gray-900 font-semibold\">
                        {isProUser ? 'Pro Plan' : 'Free Plan'}
                      </p>
                      {isProUser ? (
                        <CheckCircle className=\"w-5 h-5 text-green-500\" />
                      ) : (
                        <XCircle className=\"w-5 h-5 text-gray-400\" />
                      )}
                    </div>
                  </div>
                  
                  {subscription && (
                    <>
                      <div>
                        <label className=\"text-sm font-medium text-gray-500\">Status</label>
                        <p className=\"text-gray-900 capitalize\">{subscription.status}</p>
                      </div>
                      <div>
                        <label className=\"text-sm font-medium text-gray-500\">Next Billing Date</label>
                        <p className=\"text-gray-900\">
                          {new Date(subscription.current_period_end).toLocaleDateString()}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className=\"flex flex-col justify-end\">
                {isProUser ? (
                  <button
                    onClick={handleManageBilling}
                    disabled={processingBilling}
                    className=\"flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed\"
                  >
                    {processingBilling ? (
                      <>
                        <Loader2 className=\"w-5 h-5 animate-spin\" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <CreditCard className=\"w-5 h-5\" />
                        Manage Billing
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    href=\"/pricing\"
                    className=\"inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all\"
                  >
                    <Crown className=\"w-5 h-5\" />
                    Upgrade to Pro
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Usage Statistics */}
          <div className=\"bg-white rounded-2xl p-6 shadow-sm border border-purple-100\">
            <div className=\"flex items-center gap-4 mb-4\">
              <div className=\"bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-full\">
                <BarChart3 className=\"w-6 h-6 text-purple-600\" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Usage Statistics</h2>
                <p className="text-gray-600">{currentMonth} lessons created</p>
              </div>
            </div>

            <div className=\"space-y-4\">
              <div>
                <div className=\"flex justify-between items-center mb-2\">
                  <span className=\"text-sm font-medium text-gray-500\">Lessons Created</span>
                  <span className=\"text-sm text-gray-900\">
                    {usageCount} / {usageLimit}
                  </span>
                </div>
                {!isProUser && (
                  <div className=\"w-full bg-gray-200 rounded-full h-2\">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        usagePercentage >= 100 
                          ? 'bg-red-500' 
                          : usagePercentage >= 80 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    />
                  </div>
                )}
              </div>

              {!isProUser && usageCount >= 1 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-800 text-sm">
                    You've reached your free plan limit. 
                    <Link href="/pricing" className="text-yellow-900 font-semibold hover:underline ml-1">
                      Upgrade to Pro
                    </Link> for unlimited lessons.
                  </p>
                </div>
              )}

              <div className=\"pt-2\">
                <Link
                  href=\"/library\"
                  className=\"inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors\"
                >
                  <BookOpen className=\"w-4 h-4\" />
                  View Lesson Library
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className=\"bg-white rounded-2xl p-6 shadow-sm border border-purple-100\">
            <div className=\"flex items-center gap-4 mb-4\">
              <div className=\"bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-full\">
                <Settings className=\"w-6 h-6 text-purple-600\" />
              </div>
              <div>
                <h2 className=\"text-xl font-bold text-gray-900\">Quick Actions</h2>
                <p className=\"text-gray-600\">Common account tasks</p>
              </div>
            </div>

            <div className=\"grid sm:grid-cols-2 gap-4\">
              <Link
                href=\"/create\"
                className=\"flex items-center gap-3 p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors\"
              >
                <BookOpen className=\"w-5 h-5 text-purple-600\" />
                <span className=\"text-gray-900 font-medium\">Create New Lesson</span>
              </Link>
              <Link
                href=\"/pricing\"
                className=\"flex items-center gap-3 p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors\"
              >
                <Crown className=\"w-5 h-5 text-purple-600\" />
                <span className=\"text-gray-900 font-medium\">View Pricing</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}