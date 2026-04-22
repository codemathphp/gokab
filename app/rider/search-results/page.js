export const dynamic = 'force-dynamic'

'use client'

import { useRouter } from 'next/navigation'
import { useRideStore } from '@/lib/store'
import { useEffect, useState } from 'react'
import MapComponent from '@/components/MapComponent'
import { 
  calculateDistanceAndDuration, 
  calculateFareForDriver, 
  formatPrice,
  getDistanceEstimate,
  getDurationEstimate 
} from '@/lib/distanceAndPricingService'
import { getDriver } from '@/lib/firebaseServices'
import { FiArrowLeft, FiCar, FiStar, FiUser, FiTrendingDown, FiLoader } from 'react-icons/fi'

export default function RiderSearchResults() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { setCurrentRide } = useRideStore()
  const [pickupLocation, setPickupLocation] = useState(null)
  const [destination, setDestination] = useState(null)
  const [distance, setDistance] = useState(0)
  const [duration, setDuration] = useState(0)
  const [drivers, setDrivers] = useState([])
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [loading, setLoading] = useState(true)

  // Mock drivers list - in real app, fetch from Firebase
  const mockDrivers = [
    {
      id: 1,
      name: 'Lloyd Gutu',
      rating: 5.0,
      rides: 4,
      vehicle: 'Honda Fit New Hybrid Shape',
      plate: 'Ae478 - 388',
      phone: '+263 77 123 4567',
    },
    {
      id: 2,
      name: 'Munyaradzi',
      rating: 4.8,
      rides: 4,
      vehicle: 'Toyota Vits',
      plate: 'TY489 - 221',
      phone: '+263 77 234 5678',
    },
    {
      id: 3,
      name: 'Tonderai',
      rating: 5.0,
      rides: 4,
      vehicle: 'Mercedes Benz',
      plate: 'MB555 - 666',
      phone: '+263 77 345 6789',
    },
  ]

  useEffect(() => {
    if (!user || user.role !== 'rider') {
      router.push('/welcome')
      return
    }

    const initializeRide = async () => {
      try {
        // Get location from session/store
        const session = JSON.parse(localStorage.getItem('gokab_ride_context') || '{}')
        if (!session.pickup || !session.destination) {
          router.push('/rider/home')
          return
        }

        setPickupLocation(session.pickup)
        setDestination(session.destination)

        // Calculate actual distance and duration
        const distanceData = await calculateDistanceAndDuration(session.pickup, session.destination)
        setDistance(parseFloat(distanceData.distance) || 0)
        setDuration(parseInt(distanceData.duration) || 0)

        // Process drivers with real rates
        const driversWithFares = await Promise.all(
          mockDrivers.map(async (driver) => {
            try {
              // Get driver's custom rate from Firebase if available
              const driverData = await getDriver(driver.phone)
              const driverRate = driverData?.ratePerKm || null

              // Calculate fare using driver's rate or default
              const price = await calculateFareForDriver(distanceData.distance, driverRate)

              return {
                ...driver,
                price,
                ratePerKm: driverRate,
                distance: distanceData.durationText,
              }
            } catch (error) {
              console.error(`Error processing driver ${driver.name}:`, error)
              const price = await calculateFareForDriver(distanceData.distance)
              return {
                ...driver,
                price,
                distance: distanceData.durationText,
              }
            }
          })
        )

        setDrivers(driversWithFares)
      } catch (error) {
        console.error('Error initializing ride:', error)
        setDrivers(mockDrivers.map((d) => ({ ...d, price: '$2.50', distance: 'N/A' })))
      } finally {
        setLoading(false)
      }
    }

    initializeRide()
  }, [user, router])

  const handleRequestRide = (driver) => {
    if (!driver) {
      alert('Please select a driver')
      return
    }

    setCurrentRide({
      pickup: pickupLocation,
      destination: destination,
      distance: distance,
      driver: {
        id: driver.id,
        name: driver.name,
        phone: driver.phone,
        vehicle: driver.vehicle,
        plate: driver.plate,
      },
      price: driver.price,
      status: 'requested',
    })

    router.push('/rider/requesting')
  }

  if (!pickupLocation) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin text-orange-500 text-4xl mx-auto mb-4" />
          <p className="text-gray-600">Loading available drivers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-20">
        <button
          onClick={() => router.back()}
          className="hover:opacity-70 transition"
        >
          <FiArrowLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="text-xl font-bold text-secondary flex-1 text-center">Available Drivers</h1>
        <div className="w-8"></div>
      </div>

      {/* Map with Locations */}
      <div className="h-48 bg-gray-200 flex-shrink-0 relative overflow-hidden shadow-md">
        {pickupLocation ? (
          <MapComponent center={{ lat: pickupLocation.lat || -17.825, lng: pickupLocation.lng || 31.033 }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-600">Loading map...</p>
          </div>
        )}

        {/* Location Info Badge */}
        <div className="absolute top-4 left-4 right-4 z-10 bg-white rounded-lg shadow-lg p-3">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-lg">●</span>
              <span className="font-semibold text-gray-800">{pickupLocation.address || 'Current Location'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-500 text-lg">●</span>
              <span className="font-semibold text-gray-800">{destination?.address || destination || 'Destination'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Service Info Card */}
      <div className="mx-4 mt-4 bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-lg flex-shrink-0">
            <FiCar className="text-orange-600" size={20} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-800">GoKab</p>
            <p className="text-sm text-gray-600">{getDistanceEstimate(distance)}</p>
            <p className="text-xs text-gray-500">{drivers.length} Drivers Available</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3 mt-3">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-gray-600 mb-1">Best Fare</p>
              <p className="text-3xl font-bold text-secondary">
                {drivers.length > 0 ? formatPrice(Math.min(...drivers.map((d) => parseFloat(d.price.replace('$', ''))))) : '$0.00'}
              </p>
              <p className="text-xs text-gray-500">{getDurationEstimate(duration)}</p>
            </div>
            <button className="px-6 py-2 bg-red-500 text-white rounded-full text-sm font-bold hover:bg-red-600 transition">
              Negotiate
            </button>
          </div>
        </div>
      </div>

      {/* Best Offers Section */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-gray-700 font-bold text-base">Best Offers</p>
      </div>

      {/* Drivers List */}
      <div className="px-4 pb-4 space-y-3 flex-1 overflow-y-auto">
        {drivers.map((driver) => (
          <div
            key={driver.id}
            onClick={() => setSelectedDriver(driver.id)}
            className={`border-2 rounded-xl p-4 transition-all cursor-pointer ${
              selectedDriver === driver.id
                ? 'border-green-500 bg-green-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-orange-300'
            }`}
          >
            <div className="flex items-start gap-3 mb-3">
              {/* Driver Avatar */}
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 border-2 border-gray-400">
                <FiUser className="text-gray-700" size={20} />
              </div>

              {/* Driver Info */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-800">
                      {driver.name} <span className="text-orange-500 text-sm ml-1"><FiStar size={14} className="inline mr-1" />{driver.rating}</span>
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{driver.distance}</p>
                    <p className="text-xs text-orange-600 font-semibold mt-2">{driver.vehicle}</p>
                  </div>
                  {/* Price */}
                  <p className="text-2xl font-bold text-secondary">{driver.price}</p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="text-right">
              <p className="text-xs text-gray-600">
                {driver.pricePerKm === DEFAULT_PRICE_PER_KM ? 'Ecocash' : 'Cash'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Request Button */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-white border-t border-gray-200 shadow-2xl">
        <button
          onClick={() => handleRequestRide(drivers.find((d) => d.id === selectedDriver))}
          disabled={!selectedDriver}
          className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          Request {selectedDriver ? drivers.find((d) => d.id === selectedDriver)?.name : 'Ride'}
        </button>
      </div>
    </div>
  )
}
