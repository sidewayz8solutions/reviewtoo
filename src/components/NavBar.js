'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { GraduationCap, Menu, X, LayoutDashboard, Sparkles, BookOpen, LogOut } from 'lucide-react'
import { getCurrentUser, signOut } from '@/lib/supabase'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
  }

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
    router.push('/')
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Create', href: '/create', icon: Sparkles },
    { name: 'Library', href: '/library', icon: BookOpen },
  ]

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-3">
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
          {user ? (
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
          ) : (
            <div className="hidden md:flex items-center gap-4">
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
          )}

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
            {user ? (
              <>
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
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:text-purple-600 font-medium transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg font-semibold text-center hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}