import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export async function signUp(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  })
  return { data, error }
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Lesson CRUD operations
export async function saveLesson(lessonData, userId) {
  const { data, error } = await supabase
    .from('lessons')
    .insert([
      {
        user_id: userId,
        title: lessonData.title,
        grade_level: lessonData.gradeLevel,
        subject: lessonData.subject,
        prompt: lessonData.prompt,
        content: lessonData.content,
      }
    ])
    .select()
  
  return { data, error }
}

export async function getUserLessons(userId) {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export async function deleteLesson(lessonId, userId) {
  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', lessonId)
    .eq('user_id', userId)
  
  return { error }
}

export async function updateLesson(lessonId, updates, userId) {
  const { data, error } = await supabase
    .from('lessons')
    .update(updates)
    .eq('id', lessonId)
    .eq('user_id', userId)
    .select()
  
  return { data, error }
}

// Subscription management
export async function createUserSubscription(userId, stripeCustomerId, subscriptionData) {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .insert([
      {
        user_id: userId,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: subscriptionData.id,
        status: subscriptionData.status,
        current_period_start: new Date(subscriptionData.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscriptionData.current_period_end * 1000).toISOString(),
        plan_name: 'pro',
        price_id: subscriptionData.items.data[0].price.id
      }
    ])
    .select()
  
  return { data, error }
}

export async function updateUserSubscription(userId, subscriptionData) {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .update({
      status: subscriptionData.status,
      current_period_start: new Date(subscriptionData.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscriptionData.current_period_end * 1000).toISOString(),
    })
    .eq('user_id', userId)
    .eq('stripe_subscription_id', subscriptionData.id)
    .select()
  
  return { data, error }
}

export async function getUserSubscription(userId) {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()
  
  return { data, error }
}

export async function cancelUserSubscription(userId, stripeSubscriptionId) {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .update({ status: 'canceled' })
    .eq('user_id', userId)
    .eq('stripe_subscription_id', stripeSubscriptionId)
    .select()
  
  return { data, error }
}

// Usage tracking - Total lessons created (not monthly)
export async function getUserUsage(userId) {
  const { data, error } = await supabase
    .from('lessons')
    .select('id')
    .eq('user_id', userId)
  
  return { count: data?.length || 0, error }
}

export async function updateUserProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      ...updates,
      updated_at: new Date().toISOString()
    })
    .select()
  
  return { data, error }
}
