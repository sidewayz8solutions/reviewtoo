'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, BookOpen, Target, CheckCircle, Download, Loader, Lightbulb, Save } from 'lucide-react'
import { getCurrentUser, saveLesson } from '@/lib/supabase'
import { downloadPDF } from '@/lib/utils'

export default function CreatePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [gradeLevel, setGradeLevel] = useState('1st Grade')
  const [subject, setSubject] = useState('Math')
  const [loading, setLoading] = useState(false)
  const [lesson, setLesson] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const gradeLevels = ['Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade']
  const subjects = ['Math', 'Science', 'Reading', 'Writing', 'Social Studies', 'Art']

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
  }

  const generateLesson = async () => {
    if (!prompt.trim()) {
      setError('Please enter a lesson topic')
      return
    }

    setLoading(true)
    setError('')
    setLesson(null)

    try {
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          gradeLevel,
          subject
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate lesson')
      }

      setLesson(data.lesson)
    } catch (err) {
      console.error('Error generating lesson:', err)
      setError(err.message || 'Failed to generate lesson. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    setSaving(true)
    const { error: saveError } = await saveLesson({
      title: lesson.title,
      gradeLevel,
      subject,
      prompt,
      content: lesson
    }, user.id)

    setSaving(false)

    if (!saveError) {
      router.push('/library')
    } else {
      setError('Failed to save lesson. Please try again.')
    }
  }

  const handleDownload = () => {
    downloadPDF(lesson, gradeLevel, subject)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Input Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-2 border-purple-100">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-bold text-gray-800">Create Your Lesson</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Grade Level
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              >
                {gradeLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              >
                {subjects.map(subj => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Lesson Topic
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., 'Teach addition with pictures and objects' or 'Introduce the water cycle with fun experiments'"
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors resize-none"
              rows="3"
            />
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700">
              {error}
            </div>
          )}

          <button
            onClick={generateLesson}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Crafting Your Lesson...
              </>
            ) : (
              <>
                <Lightbulb className="w-5 h-5" />
                Generate Lesson Plan
              </>
            )}
          </button>
        </div>

        {/* Lesson Display */}
        {lesson && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-purple-100 animate-fadeIn">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 text-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-6 h-6" />
                    <span className="text-sm font-semibold opacity-90">{subject} • {gradeLevel}</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-2">{lesson.title}</h3>
                  <p className="text-purple-100">Duration: {lesson.duration}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownload}
                    className="bg-white text-purple-600 px-4 py-2 rounded-xl font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                  {user && (
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-white text-purple-600 px-4 py-2 rounded-xl font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Learning Objectives */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-6 h-6 text-purple-500" />
                  <h4 className="text-xl font-bold text-gray-800">Learning Objectives</h4>
                </div>
                <ul className="space-y-2">
                  {lesson.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{obj}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Materials */}
              <section className="bg-blue-50 rounded-2xl p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Materials Needed</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {lesson.materials.map((mat, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      {mat}
                    </div>
                  ))}
                </div>
              </section>

              {/* Introduction */}
              <section>
                <h4 className="text-xl font-bold text-gray-800 mb-3">Introduction</h4>
                <p className="text-gray-700 leading-relaxed bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl">
                  {lesson.introduction}
                </p>
              </section>

              {/* Main Content */}
              <section>
                <h4 className="text-xl font-bold text-gray-800 mb-4">Main Content</h4>
                <div className="space-y-4">
                  {lesson.mainContent.sections.map((section, i) => (
                    <div key={i} className="border-l-4 border-purple-400 pl-6 py-2">
                      <h5 className="text-lg font-semibold text-purple-700 mb-2">
                        {section.heading}
                      </h5>
                      <p className="text-gray-700 leading-relaxed">{section.content}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Activities */}
              <section className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Activities</h4>
                <div className="space-y-4">
                  {lesson.activities.map((activity, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-lg font-semibold text-gray-800">
                          {i + 1}. {activity.name}
                        </h5>
                        <span className="text-sm font-medium text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                          {activity.duration}
                        </span>
                      </div>
                      <p className="text-gray-700">{activity.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Assessment */}
              <section>
                <h4 className="text-xl font-bold text-gray-800 mb-4">Assessment</h4>
                <div className="space-y-4">
                  {lesson.assessment.map((q, i) => (
                    <div key={i} className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                      <p className="font-semibold text-gray-800 mb-2">
                        Question {i + 1}: {q.question}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">Type: {q.type}</p>
                      <p className="text-green-700 font-medium">✓ {q.correctAnswer}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Closure */}
              <section className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-3">Lesson Closure</h4>
                <p className="text-gray-700 leading-relaxed">{lesson.closure}</p>
              </section>

              {/* Extensions */}
              <section>
                <h4 className="text-xl font-bold text-gray-800 mb-4">Extension Activities</h4>
                <div className="space-y-2">
                  {lesson.extensions.map((ext, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                      <span className="font-bold text-blue-600">{i + 1}.</span>
                      <span className="text-gray-700">{ext}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {!lesson && !loading && (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-12 h-12 text-purple-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Ready to Create Amazing Lessons?
            </h3>
            <p className="text-gray-600">
              Enter a topic above and let AI craft a perfect lesson plan!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}