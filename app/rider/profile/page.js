'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { useEffect } from 'react'

export default function RiderProfile() {
  const router = useRouter()
  const { user, logout } = useAuthStore()

  useEffect(() => {
    if (!user || user.role !== 'rider') {
      router.push('/welcome')
    }
  }, [user, router])

  const handleLogout = () => {
    logout()
    localStorage.removeItem('gokab_session')
    router.push('/welcome')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-primary text-white p-6 pt-8 pb-12">
        <button onClick={() => router.back()} className="text-xl mb-4">
          ←
        </button>
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Profile Avatar */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-5xl mx-auto mb-4">
            👤
          </div>
          <h2 className="text-2xl font-bold text-secondary">{user?.phone}</h2>
          <p className="text-gray-600">Rider</p>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
            <span className="font-semibold text-secondary">Payment Methods</span>
            <span>→</span>
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
            <span className="font-semibold text-secondary">Ride History</span>
            <span>→</span>
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
            <span className="font-semibold text-secondary">Help & Support</span>
            <span>→</span>
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
            <span className="font-semibold text-secondary">Settings</span>
            <span>→</span>
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full mt-8 py-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
