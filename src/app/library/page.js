'use client'
export const dynamic = 'force-dynamic'


import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BookOpen, Search, Trash2, Download, X, Loader, Target, CheckCircle } from 'lucide-react'
import { getCurrentUser, getUserLessons, deleteLesson } from '@/lib/supabase'
import { formatDate, downloadPDF } from '@/lib/utils'

function LibraryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState(null)
  const [lessons, setLessons] = useState([])
  const [filteredLessons, setFilteredLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [filterGrade, setFilterGrade] = useState('All')
  const [filterSubject, setFilterSubject] = useState('All')

  const gradeLevels = ['All', 'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade']
  const subjects = ['All', 'Math', 'Science', 'Reading', 'Writing', 'Social Studies', 'Art']

  useEffect(() => {
    loadLibrary()
  }, [])

  useEffect(() => {
    const viewId = searchParams.get('view')
    if (viewId && lessons.length > 0) {
      const lesson = lessons.find(l => l.id === viewId)
      if (lesson) {
        setSelectedLesson(lesson)
      }
    }
  }, [searchParams, lessons])

  useEffect(() => {
    filterLessons()
  }, [lessons, searchQuery, filterGrade, filterSubject])

  const loadLibrary = async () => {
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

  const filterLessons = () => {
    let filtered = lessons

    if (searchQuery) {
      filtered = filtered.filter(lesson =>
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.prompt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filterGrade !== 'All') {
      filtered = filtered.filter(lesson => lesson.grade_level === filterGrade)
    }

    if (filterSubject !== 'All') {
      filtered = filtered.filter(lesson => lesson.subject === filterSubject)
    }

    setFilteredLessons(filtered)
  }

  const handleDelete = async (lessonId) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return

    const { error } = await deleteLesson(lessonId, user.id)

    if (!error) {
      setLessons(lessons.filter(l => l.id !== lessonId))
      if (selectedLesson?.id === lessonId) {
        setSelectedLesson(null)
      }
    }
  }

  const handleDownload = (lesson) => {
    downloadPDF(lesson.content, lesson.grade_level, lesson.subject)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <Loader className="w-12 h-12 text-purple-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-100 mb-2">My Lesson Library</h1>
          <p className="text-gray-300 text-lg">Browse and manage your saved lessons</p>
        </div>

        {/* Filters */}
        <div className="bg-dark-800 rounded-3xl shadow-xl p-6 mb-8 border-2 border-purple-500/30">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lessons..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-600 bg-dark-700 text-gray-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors placeholder-gray-400"
              />
            </div>

            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="px-4 py-3 border-2 border-gray-600 bg-dark-700 text-gray-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
            >
              {gradeLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-4 py-3 border-2 border-gray-600 bg-dark-700 text-gray-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
            >
              {subjects.map(subj => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="bg-dark-800 rounded-3xl shadow-xl p-8 border-2 border-purple-500/30">
          {filteredLessons.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-purple-500/20 to-primary-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
                <BookOpen className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-100 mb-2">
                {searchQuery || filterGrade !== 'All' || filterSubject !== 'All'
                  ? 'No lessons found'
                  : 'No lessons yet'}
              </h3>
              <p className="text-gray-300">
                {searchQuery || filterGrade !== 'All' || filterSubject !== 'All'
                  ? 'Try adjusting your filters'
                  : 'Create your first lesson to get started!'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="border-2 border-purple-500/30 bg-dark-700 rounded-2xl p-6 hover:border-purple-400/50 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedLesson(lesson)}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold bg-purple-500/20 text-purple-300 px-2 py-1 rounded border border-purple-500/30">
                      {lesson.grade_level}
                    </span>
                    <span className="text-xs font-semibold bg-primary-500/20 text-primary-300 px-2 py-1 rounded border border-primary-500/30">
                      {lesson.subject}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-100 mb-2 line-clamp-2">
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                    {lesson.prompt}
                  </p>
                  <p className="text-xs text-gray-400 mb-4">{formatDate(lesson.created_at)}</p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownload(lesson)
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-purple-500/20 text-purple-300 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-purple-500/30 transition-colors border border-purple-500/30"
                    >
                      <Download className="w-4 h-4" />
                      PDF
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(lesson.id)
                      }}
                      className="flex items-center justify-center bg-red-500/20 text-red-300 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition-colors border border-red-500/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lesson Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedLesson(null)}>
          <div className="bg-dark-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-primary-500 p-6 text-white flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold opacity-90">
                    {selectedLesson.subject} • {selectedLesson.grade_level}
                  </span>
                </div>
                <h3 className="text-2xl font-bold">{selectedLesson.title}</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(selectedLesson)}
                  className="bg-white text-purple-600 px-4 py-2 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedLesson(null)}
                  className="bg-white text-purple-600 px-4 py-2 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-purple-400" />
                  <h4 className="text-lg font-bold text-gray-100">Learning Objectives</h4>
                </div>
                <ul className="space-y-2">
                  {selectedLesson.content.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-200 text-sm">{obj}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="bg-primary-500/10 rounded-xl p-4 border border-primary-500/20">
                <h4 className="text-lg font-bold text-gray-100 mb-3">Materials</h4>
                <div className="grid md:grid-cols-2 gap-2">
                  {selectedLesson.content.materials.map((mat, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-200 text-sm">
                      <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                      {mat}
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="text-lg font-bold text-gray-100 mb-2">Introduction</h4>
                <p className="text-gray-200 text-sm leading-relaxed bg-purple-500/10 p-4 rounded-xl border border-purple-500/20">
                  {selectedLesson.content.introduction}
                </p>
              </section>

              <section>
                <h4 className="text-lg font-bold text-gray-100 mb-3">Main Content</h4>
                <div className="space-y-3">
                  {selectedLesson.content.mainContent.sections.map((section, i) => (
                    <div key={i} className="border-l-4 border-purple-400 pl-4 py-1">
                      <h5 className="text-md font-semibold text-purple-300 mb-1">{section.heading}</h5>
                      <p className="text-gray-200 text-sm leading-relaxed">{section.content}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default function LibraryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center"><Loader className="w-12 h-12 text-purple-400 animate-spin" /></div>}>
      <LibraryContent />
    </Suspense>
  )
}

