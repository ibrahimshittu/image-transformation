'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Check } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
    }

    setLoading(false)
    onClose()
    router.push('/dashboard')
    router.refresh()
  }

  const resetModal = () => {
    setEmail('')
    setPassword('')
    setError(null)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden flex min-h-[550px]">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 left-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isLogin ? 'Welcome back' : 'Create an account'}
              </h2>
              <p className="text-gray-500 mt-1">
                {isLogin ? 'Sign in to continue to Uplane' : 'Sign up to get started with Uplane'}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Free Background Removal</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">HD Image Downloads</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">No Watermarks</span>
              </div>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4 pt-2">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="h-10 border-gray-200 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-400"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  className="h-10 border-gray-200 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-400"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-10 bg-black hover:bg-gray-800 text-white"
                disabled={loading}
              >
                {loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}
              </Button>

              <div className="text-center text-sm">
                <span className="text-gray-500">
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setError(null)
                  }}
                  className="text-black font-medium hover:underline"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </div>
            </form>

            <p className="text-xs text-gray-400 text-center">
              By signing in you agree to our{' '}
              <a href="#" className="underline hover:text-gray-600">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>
            </p>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block w-1/2 relative">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('/demo-clean-original.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/30" />
        </div>
      </div>
    </div>
  )
}
