'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap, LayoutDashboard, Sparkles, BookOpen, LogOut, Menu, X } from 'lucide-react'
import { getCurrentUser, signOut } from '@/lib/supabase'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      router.push('/login')
    } else {
      setUser(currentUser)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Create Lesson', href: '/create', icon: Sparkles },
    { name: 'My Library', href: '/library', icon: BookOpen },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  LearnCraft AI
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700'
                        : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                )
              })}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-purple-50 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-purple-100 bg-white">
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700'
                        : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                )
              })}
              <button
                onClick={() => {
                  handleSignOut()
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  )
}