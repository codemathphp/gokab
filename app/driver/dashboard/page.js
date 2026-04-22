'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore, useDriverStore } from '@/lib/store'
import MapComponent from '@/components/MapComponent'
import SideDrawer from '@/components/SideDrawer'
import TopBar from '@/components/TopBar'
import { FiUser } from 'react-icons/fi'

export default function DriverDashboard() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { driverStatus, setDriverStatus } = useDriverStore()
  const [location, setLocation] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    if (!user || user.role !== 'driver') {
      router.push('/welcome')
    }

    // Get driver's location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => console.error('Geolocation error:', error)
      )
    }
  }, [user, router])

  const toggleOnlineStatus = () => {
    const newStatus = driverStatus === 'online' ? 'offline' : 'online'
    setDriverStatus(newStatus)
  }

  const handleLogout = () => {
    logout()
    localStorage.removeItem('gokab_session')
    router.push('/welcome')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Bar */}
      <TopBar onMenuClick={() => setIsDrawerOpen(true)} />

      {/* Status Card */}
      <div className="bg-gradient-to-r from-primary to-orange-500 text-white p-6 m-4 rounded-2xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-white text-opacity-90 mb-1">Status</p>
            <p className="text-2xl font-bold flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${driverStatus === 'online' ? 'bg-green-400' : 'bg-gray-400'}`}></div>
              {driverStatus === 'online' ? 'Online' : 'Offline'}
            </p>
          </div>
          <button
            onClick={toggleOnlineStatus}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-colors ${
              driverStatus === 'online'
                ? 'bg-white bg-opacity-30 hover:bg-opacity-40'
                : 'bg-white text-primary hover:bg-opacity-90'
            }`}
          >
            {driverStatus === 'online' ? 'Go Offline' : 'Go Online'}
          </button>
        </div>
      </div>

      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        {location && <MapComponent center={location} />}
      </div>

      {/* Stats */}
      <div className="flex gap-3 px-4 py-4">
        <div className="flex-1 bg-gray-50 rounded-2xl p-4 text-center">
          <p className="text-gray-600 text-sm">Earnings Today</p>
          <p className="text-2xl font-bold text-primary">$24.50</p>
        </div>
        <div className="flex-1 bg-gray-50 rounded-2xl p-4 text-center">
          <p className="text-gray-600 text-sm">Acceptance Rate</p>
          <p className="text-2xl font-bold text-secondary">98%</p>
        </div>
        <div className="flex-1 bg-gray-50 rounded-2xl p-4 text-center">
          <p className="text-gray-600 text-sm">Rating</p>
          <p className="text-2xl font-bold text-accent">4.8⭐</p>
        </div>
      </div>

      {/* Active Ride / No Ride */}
      <div className="flex-1 px-4 py-6 flex flex-col items-center justify-center">
        {driverStatus === 'online' ? (
          <div className="text-center">
            <div className="text-6xl mb-4">🎧</div>
            <h2 className="text-2xl font-bold text-secondary mb-2">Ready for Requests</h2>
            <p className="text-gray-600">You're online and ready to accept rides</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4">😴</div>
            <h2 className="text-2xl font-bold text-secondary mb-2">You're Offline</h2>
            <p className="text-gray-600">Go online to receive ride requests</p>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="px-4 py-6 space-y-3">
        <button 
          onClick={() => router.push('/driver/settings')}
          className="w-full py-3 bg-blue-100 text-blue-700 rounded-xl font-semibold hover:bg-blue-200 transition"
        >
          💰 Pricing Settings
        </button>
        <button className="w-full py-3 bg-gray-100 text-secondary rounded-xl font-semibold hover:bg-gray-200 transition">
          📊 View History
        </button>
        <button
          onClick={handleLogout}
          className="w-full py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
