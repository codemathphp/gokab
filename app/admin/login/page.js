'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authenticateAdmin } from '@/lib/firebaseServices'
import { FiUser, FiLock, FiArrowRight } from 'react-icons/fi'

export default function AdminLogin() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Check if admin already logged in
  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session')
    if (adminSession) {
      router.replace('/admin/dashboard')
    }
  }, [router])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!username.trim()) {
        throw new Error('Please enter username')
      }
      if (!password.trim()) {
        throw new Error('Please enter password')
      }

      // Authenticate admin
      const adminData = await authenticateAdmin(username, password)

      // Store admin session in localStorage
      localStorage.setItem(
        'admin_session',
        JSON.stringify({
          username: adminData.username,
          role: 'admin',
          loginTime: new Date().toISOString(),
        })
      )

      console.log('Admin logged in successfully')
      router.replace('/admin/dashboard')
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed. Please check your credentials.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-orange-500 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/main_logo.png"
            alt="goKab"
            className="w-40 h-28 mx-auto object-contain"
          />
        </div>

        {/* Admin Panel Title */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-secondary text-center mb-2">
            Admin Portal
          </h1>
          <p className="text-gray-600 text-center text-sm mb-6">
            Secure access for administrators only
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 mb-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Field */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                Username
              </label>
              <div className="relative">
                <FiUser
                  size={18}
                  className="absolute left-4 top-3 text-gray-400"
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors bg-white"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                Password
              </label>
              <div className="relative">
                <FiLock
                  size={18}
                  className="absolute left-4 top-3 text-gray-400"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors bg-white"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading || !username.trim() || !password.trim()}
              className="w-full py-3 bg-primary text-white rounded-lg font-semibold text-base hover:bg-orange-600 disabled:opacity-60 transition-colors flex items-center justify-center gap-2 mt-6"
            >
              {loading ? 'Authenticating...' : (
                <>
                  Login
                  <FiArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 text-center">
              This is a secure admin portal. Do not share your credentials.
            </p>
          </div>
        </div>

        {/* Return to Home Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/')}
            className="text-white hover:text-gray-100 transition-colors text-sm underline"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
