'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { useEffect, useState } from 'react'

export default function RiderHome() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [location, setLocation] = useState(null)
  const [dropoff, setDropoff] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'rider') {
      router.push('/welcome')
      return
    }

    // Get current location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      })
    }
  }, [user, router])

  const handleRequestRide = () => {
    if (!dropoff) {
      alert('Please enter destination')
      return
    }
    router.push('/rider/searching')
  }

  if (!user) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-orange-500 text-white p-4 pt-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">goKab</h1>
          <button
            onClick={() => router.push('/rider/profile')}
            className="text-2xl opacity-90 hover:opacity-100 transition"
          >
            👤
          </button>
        </div>
        <p className="text-white text-opacity-90">Hi {user.phone}, Ready for a ride?</p>
      </div>

      {/* Map Placeholder */}
      <div className="h-64 bg-gray-200 flex items-center justify-center relative overflow-hidden">
        <div className="text-center">
          <div className="text-5xl mb-2">🗺️</div>
          <p className="text-gray-600">Map Loading...</p>
        </div>
      </div>

      {/* Request Form */}
      <div className="flex-1 px-4 py-6">
        <h2 className="text-xl font-bold text-secondary mb-4">Where to?</h2>

        {/* Pickup */}
        <div className="mb-4">
          <label className="text-gray-700 font-semibold text-sm mb-2 block">From</label>
          <div className="bg-gray-100 p-4 rounded-2xl">
            <p className="font-semibold text-secondary">📍 Current Location</p>
            {location && (
              <p className="text-gray-600 text-sm">
                {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </p>
            )}
          </div>
        </div>

        {/* Dropoff */}
        <div className="mb-6">
          <label className="text-gray-700 font-semibold text-sm mb-2 block">To</label>
          <input
            type="text"
            placeholder="Enter destination..."
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-primary focus:outline-none"
          />
        </div>

        {/* Request Button */}
        <button
          onClick={handleRequestRide}
          className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-dark transition-colors shadow-lg"
        >
          🚗 Request Ride Now
        </button>

        {/* Quick Actions */}
        <div className="flex gap-3 mt-6">
          <button className="flex-1 py-3 bg-gray-100 rounded-xl text-secondary font-semibold hover:bg-gray-200 transition">
            💳 Wallet
          </button>
          <button className="flex-1 py-3 bg-gray-100 rounded-xl text-secondary font-semibold hover:bg-gray-200 transition">
            ⭐ Saved
          </button>
        </div>
      </div>
    </div>
  )
}
