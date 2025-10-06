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