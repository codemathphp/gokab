'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore, useRideStore } from '@/lib/store'
import MapComponent from '@/components/MapComponent'

export default function RiderSearching() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { currentRide, setCurrentRide } = useRideStore()
  const [timeWaited, setTimeWaited] = useState(0)

  useEffect(() => {
    if (!user || user.role !== 'rider') {
      router.push('/welcome')
      return
    }

    if (!currentRide) {
      router.push('/rider/home')
      return
    }

    // Simulate finding a driver after 10 seconds
    const timer = setTimeout(() => {
      const driver = {
        id: 'DRV001',
        name: 'John Doe',
        phone: '+263 77 123 4567',
        rating: 4.8,
        vehicle: 'Toyota Avanza',
        licensePlate: 'ABC 1234',
        eta: '5 mins',
      }
      setCurrentRide({ ...currentRide, driver, status: 'confirmed' })
      router.push('/rider/driver-found')
    }, 10000)

    const interval = setInterval(() => {
      setTimeWaited((prev) => prev + 1)
    }, 1000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [user, currentRide, router, setCurrentRide])

  if (!currentRide) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Map */}
      <div className="h-96 bg-gray-200 relative">
        <MapComponent center={currentRide.pickup} />
      </div>

      {/* Bottom Sheet */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-6 relative z-10 p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-secondary mb-2">Finding a Driver...</h2>

        {/* Animated Dots */}
        <div className="flex gap-2 mb-6">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        <p className="text-gray-600 mb-4">Waiting: {timeWaited}s</p>

        {/* Ride Details */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <p className="text-gray-600 text-sm mb-2">Pickup</p>
          <p className="text-secondary font-semibold mb-4">Current Location</p>

          <p className="text-gray-600 text-sm mb-2">Dropoff</p>
          <p className="text-secondary font-semibold">Destination</p>
        </div>

        {/* Estimated Fare */}
        <div className="bg-primary bg-opacity-10 border-2 border-primary rounded-2xl p-4 mb-6 text-center">
          <p className="text-gray-600 text-sm">Estimated Fare</p>
          <p className="text-3xl font-bold text-primary">$8.50</p>
        </div>

        {/* Cancel Button */}
        <button
          onClick={() => {
            setCurrentRide(null)
            router.push('/rider/home')
          }}
          className="w-full py-3 border-2 border-gray-300 text-secondary rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancel Ride
        </button>
      </div>
    </div>
  )
}
