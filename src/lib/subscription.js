import { useState, useEffect } from 'react'
import { getCurrentUser, getUserSubscription, getUserUsage } from './supabase'

// Check if user has an active subscription
export async function hasActiveSubscription(userId) {
  if (!userId) return false

  try {
    const { data: subscription } = await getUserSubscription(userId)
    return subscription && subscription.status === 'active'
  } catch (error) {
    console.error('Error checking subscription:', error)
    return false
  }
}

// Check if user can create more lessons this month
export async function canCreateLesson(userId) {
  if (!userId) return { canCreate: false, reason: 'No user ID provided' }

  try {
    const isProUser = await hasActiveSubscription(userId)
    
    if (isProUser) {
      return { canCreate: true, isPro: true }
    }

    const { count: currentUsage } = await getUserUsage(userId)
    const FREE_PLAN_LIMIT = 1

    if (currentUsage >= FREE_PLAN_LIMIT) {
      return {
        canCreate: false,
        reason: 'Free plan limit reached',
        currentUsage,
        limit: FREE_PLAN_LIMIT,
        isPro: false
      }
    }

    return {
      canCreate: true,
      currentUsage,
      limit: FREE_PLAN_LIMIT,
      isPro: false
    }
  } catch (error) {
    console.error('Error checking lesson creation limits:', error)
    return { canCreate: false, reason: 'Error checking limits' }
  }
}

// Get user subscription details and usage
export async function getUserSubscriptionDetails(userId) {
  if (!userId) return null

  try {
    const [subscriptionData, usageData] = await Promise.all([
      getUserSubscription(userId),
      getUserUsage(userId)
    ])

    const isProUser = subscriptionData.data?.status === 'active'

    return {
      subscription: subscriptionData.data,
      isPro: isProUser,
      usage: {
        count: usageData.count,
        limit: isProUser ? 'unlimited' : 1,
        remaining: isProUser ? 'unlimited' : Math.max(0, 1 - usageData.count)
      }
    }
  } catch (error) {
    console.error('Error getting subscription details:', error)
    return null
  }
}

// Middleware function for API routes that require subscription checks
export function withSubscriptionCheck(handler, options = {}) {
  return async (request, response) => {
    try {
      const user = await getCurrentUser()
      
      if (!user) {
        return response.status(401).json({ 
          error: 'Authentication required',
          code: 'UNAUTHORIZED' 
        })
      }

      // Check if this action requires pro subscription
      if (options.requiresPro) {
        const isProUser = await hasActiveSubscription(user.id)
        
        if (!isProUser) {
          return response.status(403).json({ 
            error: 'Pro subscription required',
            code: 'PRO_REQUIRED' 
          })
        }
      }

      // Check if this action counts against usage limits
      if (options.countsAsUsage) {
        const canCreate = await canCreateLesson(user.id)
        
        if (!canCreate.canCreate) {
          return response.status(403).json({ 
            error: canCreate.reason,
            code: 'USAGE_LIMIT_REACHED',
            currentUsage: canCreate.currentUsage,
            limit: canCreate.limit
          })
        }
      }

      // Add user info to request for use in handler
      request.user = user
      request.subscriptionDetails = await getUserSubscriptionDetails(user.id)

      return handler(request, response)
    } catch (error) {
      console.error('Subscription middleware error:', error)
      return response.status(500).json({ 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR' 
      })
    }
  }
}

// Client-side hook for checking subscription status
export function useSubscription() {
  const [subscriptionDetails, setSubscriptionDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    checkSubscription()
  }, [])

  const checkSubscription = async () => {
    try {
      setLoading(true)
      const user = await getCurrentUser()
      
      if (!user) {
        setSubscriptionDetails(null)
        return
      }

      const details = await getUserSubscriptionDetails(user.id)
      setSubscriptionDetails(details)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    setError(null)
    checkSubscription()
  }

  return {
    subscriptionDetails,
    loading,
    error,
    refetch,
    isPro: subscriptionDetails?.isPro || false,
    canCreateLesson: subscriptionDetails?.usage?.remaining > 0 || subscriptionDetails?.isPro
  }
}