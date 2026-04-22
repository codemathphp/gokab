export const dynamic = 'force-dynamic'
// Build version: 2024-04-22-v2

'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import MapComponent from '@/components/MapComponent'
import SideDrawer from '@/components/SideDrawer'
import { getCurrentLocation, reverseGeocode, getRecentLocations, saveRecentLocation } from '@/lib/locationService'

export default function RiderHome() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [location, setLocation] = useState(null)
  const [currentAddress, setCurrentAddress] = useState('Loading location...')
  const [destination, setDestination] = useState('')
  const [destinationAddress, setDestinationAddress] = useState('')
  const [recentLocations, setRecentLocations] = useState([])
  const [selectedService, setSelectedService] = useState('gokab')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState(false)

  const services = [
    { id: 'gokab', name: 'GoKab', icon: 'car', color: 'orange', description: '2:4' },
    { id: 'comfort', name: 'Go Comfort', icon: 'suv', color: 'gray', description: 'Premium' },
  ]

  useEffect(() => {
    // Get user from localStorage
    const session = localStorage.getItem('gokab_session')
    if (!session) {
      router.replace('/welcome')
      return
    }
    try {
      const userData = JSON.parse(session)
      if (!userData.phone || !userData.role || userData.role !== 'rider') {
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

  useEffect(() => {
    if (!user || user.role !== 'rider') {
      router.push('/welcome')
      return
    }

    // Get current location and reverse geocode it
    const initializeLocation = async () => {
      const currentLoc = await getCurrentLocation()
      setLocation(currentLoc)
      
      // Reverse geocode to get address
      const address = await reverseGeocode(currentLoc.lat, currentLoc.lng)
      setCurrentAddress(address)
      
      // Load recent locations
      setRecentLocations(getRecentLocations())
    }

    initializeLocation()
  }, [user, router])

  const handleRequestRide = () => {
    if (!destination) {
      alert('Please enter a destination')
      return
    }
    // Save ride context before navigating
    const rideContext = {
      pickup: {
        lat: location.lat,
        lng: location.lng,
        address: currentAddress,
      },
      destination: {
        address: destination,
      },
    }
    localStorage.setItem('gokab_ride_context', JSON.stringify(rideContext))
    
    // Navigate to search results to see available drivers
    router.push('/rider/search-results')
  }

  const handleSelectRecentLocation = (loc) => {
    setDestination(loc.address)
    setDestinationAddress(loc.address)
  }

  const handleUpdateLocation = async (newAddress) => {
    setCurrentAddress(newAddress)
    setEditingLocation(false)
    // In a real app, save to database
  }

  if (!user || !location) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">📍</div>
        <p className="text-gray-600">Getting your location...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-20">
        <h1 className="text-2xl font-bold text-secondary">goKab</h1>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-2xl hover:bg-orange-200 transition"
        >
          ☰
        </button>
      </div>

      {/* Map Container - Live Interactive Map */}
      <div className="h-64 bg-gray-200 flex-shrink-0 relative overflow-hidden shadow-md">
        {location ? (
          <MapComponent center={{ lat: location.lat, lng: location.lng }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-600">Loading map...</p>
          </div>
        )}

        {/* Current Location Badge - Over Map */}
        <div className="absolute top-4 left-4 right-4 z-10 bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-semibold mb-1">Pickup</p>
              {editingLocation ? (
                <input
                  type="text"
                  value={currentAddress}
                  onChange={(e) => setCurrentAddress(e.target.value)}
                  onBlur={() => handleUpdateLocation(currentAddress)}
                  autoFocus
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-800 focus:outline-none focus:border-orange-500"
                />
              ) : (
                <p className="text-sm font-semibold text-gray-800 line-clamp-2">{currentAddress}</p>
              )}
            </div>
            <button
              onClick={() => setEditingLocation(!editingLocation)}
              className="text-gray-400 hover:text-orange-500 transition text-xl flex-shrink-0"
              title="Edit location"
            >
              ✏️
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Service Selection */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex gap-3">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`flex-1 rounded-xl p-3 transition-all border-2 ${
                  selectedService === service.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white hover:border-orange-300'
                }`}
              >
                <p className="text-2xl mb-1">{service.icon}</p>
                <p className="font-semibold text-xs text-gray-800">{service.name}</p>
                <p className="text-xs text-gray-500">{service.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Destination Input */}
        <div className="px-4 py-4 bg-white border-t border-b border-gray-200">
          <p className="text-gray-700 font-semibold text-sm mb-3 flex items-center gap-2">
            <span className="text-red-500 text-lg">📍</span>
            Where To?
          </p>
          <input
            type="text"
            placeholder="Enter destination address"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition"
          />
        </div>

        {/* Recent Locations / Suggestions */}
        {recentLocations.length > 0 && (
          <div className="px-4 py-4">
            <p className="text-gray-700 font-semibold text-sm mb-3">Recent Locations</p>
            <div className="space-y-2">
              {recentLocations.map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectRecentLocation(loc)}
                  className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-orange-300 transition"
                >
                  <p className="flex items-center gap-2 text-gray-700">
                    <span className="text-lg">🕐</span>
                    <span className="font-semibold text-sm">{loc.address}</span>
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Locations */}
        <div className="px-4 py-4">
          <p className="text-gray-700 font-semibold text-sm mb-3">Suggested Places</p>
          <div className="space-y-2">
            {[
              { name: 'Chicken Inn First', address: 'Stand 851 & 852, First Street Harare.' },
              { name: '1302 172nd Close', address: 'Budiriro, Harare' },
              { name: 'Construction House', address: 'Nelson Mandela Avenue, Harare' },
              { name: 'West End Clinic', address: 'Baines Avenue, Harare' },
            ].map((place, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectRecentLocation({ address: place.name })}
                className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-orange-300 transition"
              >
                <p className="flex items-center gap-2 text-gray-700 mb-1">
                  <span className="text-lg">🕐</span>
                  <span className="font-semibold text-sm">{place.name}</span>
                </p>
                <p className="text-xs text-gray-500 ml-7">{place.address}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Request Button */}
      <div className="px-4 py-4 bg-white border-t border-gray-200 sticky bottom-0">
        <button
          onClick={handleRequestRide}
          disabled={!destination}
          className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          Request Ride
        </button>
      </div>

      {/* Side Drawer */}
      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  )
}

