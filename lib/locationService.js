// Reverse geocode coordinates to address using Google Maps API
export const reverseGeocode = async (lat, lng) => {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

    const response = await fetch(
      `/api/geocode?lat=${lat}&lng=${lng}`,
      { signal: controller.signal }
    )
    clearTimeout(timeoutId)
    
    const data = await response.json()
    return data.address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
  } catch (error) {
    console.warn('Geocoding error:', error.message)
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
  }
}

// Get current position
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      // Default to Harare if geolocation not supported
      resolve({
        lat: -17.825,
        lng: 31.033,
        accuracy: null,
      })
      return
    }

    // Set a 3 second timeout for geolocation - fail fast
    const timeoutId = setTimeout(() => {
      resolve({
        lat: -17.825,
        lng: 31.033,
        accuracy: null,
      })
    }, 3000)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId)
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
      },
      (error) => {
        clearTimeout(timeoutId)
        // Default to Harare if geolocation fails
        console.warn('Geolocation denied or error:', error.message)
        resolve({
          lat: -17.825,
          lng: 31.033,
          accuracy: null,
        })
      },
      {
        enableHighAccuracy: false, // Low accuracy = faster response
        timeout: 3000, // 3 seconds max
        maximumAge: 300000, // Use cached position if less than 5 minutes old
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
