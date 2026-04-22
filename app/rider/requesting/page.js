'use client'

import { useRouter } from 'next/navigation'
import { useRideStore } from '@/lib/store'
import { useEffect, useState } from 'react'
import MapComponent from '@/components/MapComponent'
import { FiPhone, FiX } from 'react-icons/fi'

export default function RequestingDriver() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { currentRide, setCurrentRide } = useRideStore()
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    if (!user || user.role !== 'rider') {
      router.push('/welcome')
      return
    }

    if (!currentRide) {
      router.push('/rider/home')
      return
    }

    // Simulate driver acceptance after 3-5 seconds
    const acceptTimeout = setTimeout(() => {
      // In real app, this would come from a real-time update (WebSocket/Firebase)
      setCurrentRide({
        ...currentRide,
        status: 'accepted',
        driver: {
          ...currentRide.driver,
          eta: '3 min',
          lat: -17.820,
          lng: 31.040,
        },
      })
      router.push('/rider/driver-found')
    }, 3500)

    return () => clearTimeout(acceptTimeout)
  }, [user, currentRide, router, setCurrentRide])

  // Timer for elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleCancel = () => {
    setCurrentRide(null)
    router.push('/rider/home')
  }

  if (!currentRide) {
    return <div>Loading...</div>
  }

  const formatTime = (seconds) => {
    return `${seconds}s`
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Map */}
      <div className="h-96 bg-gray-200 relative">
        <MapComponent center={currentRide.pickup} />

        {/* Close Button */}
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 z-20 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
        >
          <FiX size={24} className="text-gray-800" />
        </button>
      </div>

      {/* Bottom Sheet */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-6 relative z-10 p-6 flex flex-col">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-secondary mb-2">Requesting Driver</h2>
          <p className="text-gray-600">Searching for {currentRide.driver?.name || 'your driver'}...</p>
        </div>

        {/* Animated Loading Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>

        {/* Driver Info Being Requested */}
        <div className="bg-gradient-to-r from-primary to-orange-500 text-white rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
              <div className="text-3xl font-bold">{currentRide.driver?.name?.charAt(0) || '?'}</div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{currentRide.driver?.name || 'Driver'}</h3>
              <p className="text-white text-opacity-90 flex items-center gap-1">
                Accepting request...
              </p>
            </div>
          </div>

          <div className="bg-white bg-opacity-20 rounded-xl p-3">
            <p className="text-sm text-white text-opacity-90">Vehicle</p>
            <p className="font-bold">{currentRide.driver?.vehicle}</p>
            <p className="text-sm text-white text-opacity-90">Plate: {currentRide.driver?.plate}</p>
          </div>
        </div>

        {/* Timer */}
        <div className="text-center mb-6">
          <p className="text-gray-600 text-sm">Time elapsed</p>
          <p className="text-3xl font-bold text-secondary">{formatTime(timeElapsed)}</p>
        </div>

        {/* Trip Details */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6 flex-1">
          <p className="text-gray-600 text-sm mb-2">Pickup</p>
          <p className="text-secondary font-semibold mb-4 line-clamp-2">
            {currentRide.pickup?.address || 'Current Location'}
          </p>

          <p className="text-gray-600 text-sm mb-2">Dropoff</p>
          <p className="text-secondary font-semibold line-clamp-2">
            {currentRide.destination?.address || 'Destination'}
          </p>

          <div className="border-t border-gray-200 mt-4 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Estimated Fare</span>
              <span className="text-2xl font-bold text-secondary">${currentRide.price}</span>
            </div>
          </div>
        </div>

        {/* Cancel Button */}
        <button
          onClick={handleCancel}
          className="w-full py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition"
        >
          Cancel Request
        </button>
      </div>
    </div>
  )
}
