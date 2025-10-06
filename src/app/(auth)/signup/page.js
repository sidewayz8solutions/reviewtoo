'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap, Mail, Lock, User, Loader, AlertCircle, CheckCircle } from 'lucide-react'
import { signUp } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    const { data, error: signUpError } = await signUp(email, password, fullName)

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data?.user) {
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-green-200 text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to LearnCraft!</h2>
            <p className="text-gray-600 mb-4">Your account has been created successfully.</p>
            <div className="flex items-center justify-center gap-2 text-purple-600">
              <Loader className="w-5 h-5 animate-spin" />
              <span>Redirecting to dashboard...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-2xl">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              LearnCraft AI
            </h1>
          </div>
        </Link>

        {/* Signup Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-purple-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Create Account</h2>
          <p className="text-gray-600 text-center mb-8">Start creating amazing lessons today</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-purple-600 font-semibold hover:text-purple-700">
                Log in
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-gray-600 hover:text-purple-600 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}