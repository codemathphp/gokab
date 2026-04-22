'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { useEffect, useState } from 'react'
import TopBar from '@/components/TopBar'
import SideDrawer from '@/components/SideDrawer'
import { FiArrowLeft, FiUser, FiCreditCard, FiNavigation, FiHelpCircle, FiSettings } from 'react-icons/fi'

export default function RiderProfile() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

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
      {/* Top Bar */}
      <TopBar onMenuClick={() => setIsDrawerOpen(true)} />

      {/* Header with Back Button */}
      <div className="bg-primary text-white p-6 pb-12">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 mb-4 hover:opacity-80 transition"
        >
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Profile Avatar */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser size={48} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-secondary">{user?.name || user?.phone}</h2>
          <p className="text-gray-600">{user?.phone}</p>
          <p className="text-gray-500 text-sm mt-1">Rider</p>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
            <div className="flex items-center gap-3">
              <FiCreditCard size={20} className="text-primary" />
              <span className="font-semibold text-secondary">Payment Methods</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
            <div className="flex items-center gap-3">
              <FiNavigation size={20} className="text-primary" />
              <span className="font-semibold text-secondary">Ride History</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
            <div className="flex items-center gap-3">
              <FiHelpCircle size={20} className="text-primary" />
              <span className="font-semibold text-secondary">Help & Support</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
            <div className="flex items-center gap-3">
              <FiSettings size={20} className="text-primary" />
              <span className="font-semibold text-secondary">Settings</span>
            </div>
            <span className="text-gray-400">→</span>
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

      {/* Side Drawer */}
      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  )
}
