// Reverse geocode coordinates to address using Google Maps API
export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `/api/geocode?lat=${lat}&lng=${lng}`
    )
    const data = await response.json()
    return data.address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
  } catch (error) {
    console.error('Geocoding error:', error)
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
  }
}

// Get current position
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
      },
      (error) => {
        // Default to Harare if geolocation fails
        console.error('Geolocation error:', error)
        resolve({
          lat: -17.825,
          lng: 31.033,
          accuracy: null,
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  })
}

// Format coordinates to readable address
export const formatAddress = (address) => {
  if (!address) return 'Unknown Location'
  // Truncate long addresses
  return address.length > 50 ? address.substring(0, 50) + '...' : address
}

// Get suggested recent locations from localStorage
export const getRecentLocations = () => {
  try {
    const stored = localStorage.getItem('gokab_recent_locations')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// Save location to recent locations
export const saveRecentLocation = (location, address) => {
  try {
    const recent = getRecentLocations()
    const newLocation = { lat: location.lat, lng: location.lng, address, timestamp: Date.now() }
    
    // Remove duplicates and keep last 5
    const filtered = recent.filter(loc => loc.address !== address)
    const updated = [newLocation, ...filtered].slice(0, 5)
    
    localStorage.setItem('gokab_recent_locations', JSON.stringify(updated))
  } catch (error) {
    console.error('Error saving location:', error)
  }
}
