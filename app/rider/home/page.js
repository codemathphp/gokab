'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import MapComponent from '@/components/MapComponent'
import SideDrawer from '@/components/SideDrawer'
import TopBar from '@/components/TopBar'
import AddressAutocomplete from '@/components/AddressAutocomplete'
import { getCurrentLocation, reverseGeocode, getRecentLocations, saveRecentLocation } from '@/lib/locationService'
import { calculateDistanceAndDuration, getDistanceEstimate, getDurationEstimate } from '@/lib/distanceAndPricingService'
import { FiMapPin, FiClock, FiDollarSign, FiArrowLeft, FiLoader } from 'react-icons/fi'

export default function RiderHome() {
  const router = useRouter()
  const [location, setLocation] = useState(null)
  const [currentAddress, setCurrentAddress] = useState('Loading location...')
  const [destination, setDestination] = useState('')
  const [destinationAddress, setDestinationAddress] = useState('')
  const [destinationCoords, setDestinationCoords] = useState(null)
  const [recentLocations, setRecentLocations] = useState([])
  const [selectedService, setSelectedService] = useState('gokab')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState(false)
  const [tripInfo, setTripInfo] = useState(null)
  const [calculatingDistance, setCalculatingDistance] = useState(false)
  const [nearbyDrivers, setNearbyDrivers] = useState([
    { id: 1, name: 'Lloyd G.', distance: '2 min away', lat: -17.820, lng: 31.040 },
    { id: 2, name: 'Munyaradzi', distance: '5 min away', lat: -17.830, lng: 31.025 },
    { id: 3, name: 'Tonderai', distance: '8 min away', lat: -17.815, lng: 31.045 },
  ])

  const services = [
    { id: 'gokab', name: 'GoKab', description: '2-4 mins' },
    { id: 'comfort', name: 'Go Comfort', description: 'Premium' },
  ]

  useEffect(() => {
    // Validate session exists and has required fields
    const session = localStorage.getItem('gokab_session')
    if (!session) {
      router.replace('/welcome')
      return
    }

    try {
      const userData = JSON.parse(session)
      if (!userData.phone || !userData.role || userData.role !== 'rider') {
        // Invalid session - clear and redirect
        localStorage.removeItem('gokab_session')
        router.replace('/welcome')
        return
      }
    } catch (err) {
      localStorage.removeItem('gokab_session')
      router.replace('/welcome')
      return
    }

    // Get current location and reverse geocode it
    const initializeLocation = async () => {
      try {
        const currentLoc = await getCurrentLocation()
        setLocation(currentLoc)
        
        // Reverse geocode to get address (won't block if fails)
        try {
          const address = await reverseGeocode(currentLoc.lat, currentLoc.lng)
          setCurrentAddress(address)
        } catch (geocodeErr) {
          // Use coordinates as fallback
          setCurrentAddress(`${currentLoc.lat.toFixed(4)}, ${currentLoc.lng.toFixed(4)}`)
        }
        
        // Load recent locations
        setRecentLocations(getRecentLocations())
      } catch (locErr) {
        console.error('Failed to initialize location:', locErr)
        // Set default location if geolocation fails
        setLocation({ lat: -17.825, lng: 31.033, accuracy: null })
        setCurrentAddress('Harare')
        setRecentLocations(getRecentLocations())
      }
    }

    initializeLocation()

    // Callback for map to update trip info
    window.onTripInfoUpdate = (info) => {
      setTripInfo(info)
    }

    return () => {
      delete window.onTripInfoUpdate
    }
  }, [router])

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
        lat: destinationCoords?.lat,
        lng: destinationCoords?.lng,
      },
      tripInfo: tripInfo,
    }
    localStorage.setItem('gokab_ride_context', JSON.stringify(rideContext))
    
    // Navigate to search results to see available drivers
    router.push('/rider/search-results')
  }

  const handleSelectRecentLocation = (loc) => {
    setDestination(loc.address)
    setDestinationAddress(loc.address)
    // Mock coordinates for the selected location
    setDestinationCoords({ lat: location.lat + 0.05, lng: location.lng + 0.05 })
    // Trigger distance calculation
    calculateDistance(loc)
  }

  const calculateDistance = async (destinationLocation) => {
    if (!location || !destinationLocation) return

    setCalculatingDistance(true)
    try {
      const distanceData = await calculateDistanceAndDuration(
        {
          lat: location.lat,
          lng: location.lng,
          address: currentAddress,
        },
        destinationLocation
      )

      setTripInfo({
        distance: parseFloat(distanceData.distance),
        distanceText: distanceData.distanceText,
        duration: parseInt(distanceData.duration),
        durationText: distanceData.durationText,
      })
    } catch (error) {
      console.error('Error calculating distance:', error)
    } finally {
      setCalculatingDistance(false)
    }
  }

  const handleUpdateLocation = async (newAddress) => {
    setCurrentAddress(newAddress)
    setEditingLocation(false)
  }

  if (!location) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">
          <FiMapPin className="inline-block" />
        </div>
        <p className="text-gray-600">Getting your location...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {/* Full-screen Map */}
      <div className="absolute inset-0 z-0">
        {location ? (
          <MapComponent 
            center={{ lat: location.lat, lng: location.lng }}
            pickup={{ lat: location.lat, lng: location.lng }}
            destination={destination && destinationCoords ? { 
              lat: destinationCoords.lat, 
              lng: destinationCoords.lng 
            } : null}
            drivers={nearbyDrivers}
            tripInfo={tripInfo}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-600">Loading map...</p>
          </div>
        )}
      </div>

      {/* Transparent Header - Overlaying Map */}
      <div className="relative z-20">
        <TopBar onMenuClick={() => setIsDrawerOpen(true)} />
      </div>

      {/* Scrollable Content - Over Map */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        {/* Current Location Badge - Translucent */}
        <div className="mx-4 mt-4 bg-white bg-opacity-95 backdrop-blur-md rounded-2xl shadow-lg p-4 border-l-4 border-green-500">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Pickup</p>
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
              className="text-gray-400 hover:text-orange-500 transition flex-shrink-0"
              title="Edit location"
            >
              <FiArrowLeft className="rotate-90" size={18} />
            </button>
          </div>
        </div>

        {/* Service Selection */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex gap-3">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`flex-1 rounded-xl p-3 transition-all border-2 ${
                  selectedService === service.id
                    ? 'border-orange-500 bg-white bg-opacity-95'
                    : 'border-gray-300 bg-white bg-opacity-90 hover:border-orange-300'
                }`}
              >
                <p className="font-semibold text-xs text-gray-800">{service.name}</p>
                <p className="text-xs text-gray-500 mt-1">{service.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Destination Input */}
        <div className="px-4 py-4 bg-white bg-opacity-95 backdrop-blur-md border-t border-b border-gray-200 border-opacity-50">
          <p className="text-gray-700 font-semibold text-sm mb-3 flex items-center gap-2">
            <FiMapPin className="text-red-500" size={18} />
            Where to?
          </p>
          <AddressAutocomplete
            value={destination}
            onChange={setDestination}
            onSelect={(selected) => {
              setDestinationAddress(selected.address)
              setDestinationCoords({ lat: selected.lat, lng: selected.lng })
              saveRecentLocation(selected, selected.address)
              // Calculate distance for this destination
              calculateDistance(selected)
            }}
            placeholder="Enter destination address"
            recentLocations={recentLocations}
            showRecent={true}
          />
        </div>

        {/* Trip Info - Show when destination is set */}
        {tripInfo && (
          <div className="mx-4 mt-4 bg-white bg-opacity-95 backdrop-blur-md rounded-2xl shadow-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FiClock className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Est. Time</p>
                  <p className="font-bold text-gray-800">{getDurationEstimate(tripInfo.duration)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FiMapPin className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Distance</p>
                  <p className="font-bold text-gray-800">{getDistanceEstimate(tripInfo.distance)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {calculatingDistance && (
          <div className="mx-4 mt-4 bg-white bg-opacity-95 backdrop-blur-md rounded-2xl shadow-lg p-4 flex items-center justify-center">
            <FiLoader className="animate-spin text-orange-500 mr-2" />
            <p className="text-gray-600 text-sm">Calculating distance...</p>
          </div>
        )}

        {/* Recent Locations / Suggestions */}
        {recentLocations.length > 0 && !destination && (
          <div className="px-4 py-4">
            <p className="text-gray-700 font-semibold text-sm mb-3">Recent Locations</p>
            <div className="space-y-2">
              {recentLocations.map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectRecentLocation(loc)}
                  className="w-full text-left px-4 py-3 bg-white bg-opacity-90 border border-gray-300 rounded-lg hover:bg-opacity-100 hover:border-orange-300 transition"
                >
                  <p className="flex items-center gap-2 text-gray-700">
                    <FiClock className="text-gray-400" size={16} />
                    <span className="font-semibold text-sm">{loc.address}</span>
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Locations */}
        {!destination && (
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
                  className="w-full text-left px-4 py-3 bg-white bg-opacity-90 border border-gray-300 rounded-lg hover:bg-opacity-100 hover:border-orange-300 transition"
                >
                  <p className="flex items-center gap-2 text-gray-700 mb-1">
                    <FiMapPin className="text-gray-400" size={16} />
                    <span className="font-semibold text-sm">{place.name}</span>
                  </p>
                  <p className="text-xs text-gray-500 ml-6">{place.address}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Request Button */}
      <div className="relative z-20 px-4 py-4 bg-white bg-opacity-95 backdrop-blur-md border-t border-gray-200 border-opacity-50 shadow-2xl">
        <button
          onClick={handleRequestRide}
          disabled={!destination}
          className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
        >
          <FiArrowLeft className="rotate-90" size={20} />
          Request Ride
        </button>
      </div>

      {/* Side Drawer */}
      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  )
}

