'use client'

import Link from 'next/link'
import { GraduationCap, Sparkles, Zap, Target, BookOpen, Users, ArrowRight, Check } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  LearnCraft AI
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/login"
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
              >
                Log In
              </Link>
              <Link 
                href="/signup"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-6 font-semibold text-sm">
            <Sparkles className="w-4 h-4" />
            AI-Powered Education
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Where Every Lesson
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Comes Alive
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Create comprehensive, engaging lesson plans in seconds. Powered by advanced AI to help teachers focus on what matters most - their students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
            >
              Start Creating Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/create"
              className="bg-white text-purple-600 border-2 border-purple-200 px-8 py-4 rounded-xl font-bold text-lg hover:border-purple-400 transition-all flex items-center justify-center gap-2"
            >
              See Demo
              <Sparkles className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Demo Preview */}
        <div className="bg-white rounded-3xl shadow-2xl p-4 border-4 border-purple-200 animate-slideUp">
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="bg-white p-6 rounded-2xl shadow-lg inline-block mb-4">
                <BookOpen className="w-16 h-16 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Beautiful Lesson Plans</h3>
              <p className="text-gray-600">Complete with objectives, activities, and assessments</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Teach Better
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive tools designed for modern educators
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:shadow-xl transition-shadow">
              <div className="bg-purple-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Generate complete lesson plans in under 30 seconds. Save hours of planning time every week.</p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-200 hover:shadow-xl transition-shadow">
              <div className="bg-pink-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Standards Aligned</h3>
              <p className="text-gray-600">Every lesson is crafted with educational best practices and learning objectives in mind.</p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:shadow-xl transition-shadow">
              <div className="bg-blue-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Age Appropriate</h3>
              <p className="text-gray-600">Content tailored for every grade level from Kindergarten through 5th grade and beyond.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Three Steps to Perfect Lessons
            </h2>
            <p className="text-xl text-gray-600">
              It's as easy as 1-2-3
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Enter Your Topic</h3>
              <p className="text-gray-600">Choose grade level, subject, and describe what you want to teach</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Generates Plan</h3>
              <p className="text-gray-600">Watch as comprehensive lesson materials are created instantly</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Teach & Save</h3>
              <p className="text-gray-600">Download as PDF, save to your library, and start teaching</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade when you're ready
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="border-2 border-gray-200 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">5 lessons per month</span>
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
              <Link 
                href="/signup"
                className="block text-center bg-gray-100 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            <div className="border-4 border-purple-500 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                Coming Soon
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$19</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Unlimited lessons</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">All grade levels (K-12)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Advanced customization</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Collaboration tools</span>
                </li>
              </ul>
              <button 
                disabled
                className="block w-full text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold opacity-50 cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Teaching?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of educators creating better lessons with AI
          </p>
          <Link 
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            Start Creating Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold">LearnCraft AI</div>
                <div className="text-sm text-gray-400">Where Every Lesson Comes Alive</div>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 LearnCraft AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}