'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, BookOpen, Clock, Trash2, Eye, Loader } from 'lucide-react'
import { getCurrentUser, getUserLessons, deleteLesson } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      router.push('/login')
      return
    }

    setUser(currentUser)

    const { data: userLessons } = await getUserLessons(currentUser.id)
    setLessons(userLessons || [])
    setLoading(false)
  }

  const handleDelete = async (lessonId) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return

    const { error } = await deleteLesson(lessonId, user.id)
    
    if (!error) {
      setLessons(lessons.filter(l => l.id !== lessonId))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <Loader className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.user_metadata?.full_name || 'Teacher'}!
          </h1>
          <p className="text-gray-600 text-lg">Ready to create more amazing lessons?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link 
            href="/create"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-4"
          >
            <div className="bg-white/20 p-4 rounded-2xl">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-1">Create New Lesson</h3>
              <p className="text-purple-100">Start crafting your next lesson plan</p>
            </div>
          </Link>

          <Link 
            href="/library"
            className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-4 border-2 border-purple-100"
          >
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-2xl">
              <BookOpen className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">My Library</h3>
              <p className="text-gray-600">Browse all your saved lessons</p>
            </div>
          </Link>
        </div>

        {/* Recent Lessons */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-purple-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Lessons</h2>
            {lessons.length > 0 && (
              <Link 
                href="/library"
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                View All →
              </Link>
            )}
          </div>

          {lessons.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No lessons yet</h3>
              <p className="text-gray-600 mb-6">Create your first lesson to get started!</p>
              <Link 
                href="/create"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Create Lesson
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {lessons.slice(0, 4).map((lesson) => (
                <div 
                  key={lesson.id}
                  className="border-2 border-gray-200 rounded-2xl p-6 hover:border-purple-300 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          {lesson.grade_level}
                        </span>
                        <span className="text-xs font-semibold bg-pink-100 text-pink-700 px-2 py-1 rounded">
                          {lesson.subject}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                        {lesson.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {formatDate(lesson.created_at)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <Link
                      href={`/library?view=${lesson.id}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-semibold hover:bg-purple-200 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(lesson.id)}
                      className="flex items-center justify-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6">
            <div className="text-3xl font-bold text-blue-600 mb-1">{lessons.length}</div>
            <div className="text-blue-700 font-medium">Total Lessons</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-6">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {Math.max(0, 5 - lessons.length)}
            </div>
            <div className="text-green-700 font-medium">Lessons Remaining (Free)</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl p-6">
            <div className="text-3xl font-bold text-purple-600 mb-1">K-5</div>
            <div className="text-purple-700 font-medium">Grade Levels</div>
          </div>
        </div>
      </div>
    </div>
  )
}