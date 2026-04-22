'use client'

import { useRouter } from 'next/navigation'
import { useRideStore } from '@/lib/store'
import MapComponent from '@/components/MapComponent'
import { useEffect } from 'react'
import { FiCar, FiStar, FiPhone, FiMessageCircle } from 'react-icons/fi'

export default function RiderDriverFound() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { currentRide } = useRideStore()

  useEffect(() => {
    if (!user || user.role !== 'rider') {
      router.push('/welcome')
    }

    if (!currentRide || !currentRide.driver) {
      router.push('/rider/home')
    }
  }, [user, currentRide, router])

  if (!currentRide?.driver) {
    return <div>Loading...</div>
  }

  const driver = currentRide.driver

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Map */}
      <div className="h-96 bg-gray-200 relative">
        <MapComponent center={currentRide.pickup} />
      </div>

      {/* Bottom Sheet */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-6 relative z-10 p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-secondary mb-4">Driver on the Way</h2>

        {/* Driver Card */}
        <div className="bg-gradient-to-r from-primary to-orange-500 text-white rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
              <FiCar className="text-white" size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{driver.name}</h3>
              <p className="text-white text-opacity-90 flex items-center gap-1"><FiStar size={16} /> {driver.rating}</p>
            </div>
          </div>

          <div className="bg-white bg-opacity-20 rounded-xl p-3">
            <p className="text-sm text-white text-opacity-90">Vehicle</p>
            <p className="font-bold">{driver.vehicle}</p>
            <p className="text-sm text-white text-opacity-90">Plate: {driver.licensePlate}</p>
          </div>
        </div>

        {/* ETA */}
        <div className="bg-green-100 border-l-4 border-accent rounded-lg p-4 mb-6">
          <p className="text-gray-700">
            <span className="font-bold text-accent text-2xl">{driver.eta}</span>
            <span className="text-gray-600 ml-2">Driver arriving</span>
          </p>
        </div>

        {/* Contact */}
        <div className="flex gap-3 mb-6">
          <button className="flex-1 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
            <FiPhone size={18} /> Call
          </button>
          <button className="flex-1 py-3 bg-gray-100 text-secondary rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
            <FiMessageCircle size={18} /> Message
          </button>
        </div>

        {/* Trip Details */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-gray-600 text-sm mb-2">Pickup</p>
          <p className="text-secondary font-semibold mb-4">Current Location</p>

          <p className="text-gray-600 text-sm mb-2">Dropoff</p>
          <p className="text-secondary font-semibold">Destination</p>
        </div>
      </div>
    </div>
  )
}
