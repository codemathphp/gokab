'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FiUser, FiArrowLeft, FiStar } from 'react-icons/fi'

export default function DriverProfile() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Get user from localStorage
    const session = localStorage.getItem('gokab_session')
    if (!session) {
      router.replace('/welcome')
      return
    }

    try {
      const userData = JSON.parse(session)
      if (!userData.phone || !userData.role || userData.role !== 'driver') {
        localStorage.removeItem('gokab_session')
        router.replace('/welcome')
        return
      }
      setUser(userData)
    } catch (err) {
      localStorage.removeItem('gokab_session')
      router.replace('/welcome')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('gokab_session')
    router.replace('/welcome')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-primary text-white p-6 pt-8 pb-12">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 mb-4 hover:opacity-80 transition"
        >
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Driver Profile</h1>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 -mt-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUser size={64} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-secondary">{user?.phone}</h2>
            <p className="text-gray-600">Professional Driver</p>
          </div>

          {/* Rating */}
          <div className="text-center py-4 border-t border-b border-gray-200 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <p className="text-3xl font-bold text-primary">4.8</p>
              <FiStar size={28} className="text-primary fill-primary" />
            </div>
            <p className="text-gray-600 text-sm">Based on 127 rides</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">$892.50</p>
              <p className="text-xs text-gray-600">Total Earnings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">127</p>
              <p className="text-xs text-gray-600">Total Rides</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-3 mb-8">
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
            <span className="font-semibold text-secondary">Vehicle Details</span>
            <span>→</span>
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
            <span className="font-semibold text-secondary">Earnings & Payouts</span>
            <span>→</span>
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
            <span className="font-semibold text-secondary">Documents</span>
            <span>→</span>
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
            <span className="font-semibold text-secondary">Help & Support</span>
            <span>→</span>
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
