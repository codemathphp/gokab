// Distance and Pricing Service
export const calculateDistanceAndDuration = async (pickup, destination) => {
  if (!pickup || !destination) {
    return { distance: 0, duration: 0, distanceText: 'N/A', durationText: 'N/A' }
  }

  try {
    // Format addresses for API
    const origin = pickup.address || `${pickup.lat},${pickup.lng}`
    const dest = destination.address || `${destination.lat},${destination.lng}`

    const response = await fetch(
      `/api/distance?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}`
    )

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Distance calculation error:', error)
    return { distance: 0, duration: 0, distanceText: 'N/A', durationText: 'N/A' }
  }
}

export const getPricingConfig = async () => {
  try {
    const response = await fetch('/api/pricing-config')
    const config = await response.json()
    return config
  } catch (error) {
    console.error('Error fetching pricing config:', error)
    return {
      defaultRatePerKm: 1.50,
      baseFare: 2.00,
      minPrice: 0.50,
      maxPrice: 3.00,
      surgeMultiplier: 1.0,
    }
  }
}

export const calculateFareForDriver = async (distance, driverRatePerKm = null) => {
  const config = await getPricingConfig()

  // Use driver's rate if available, otherwise use admin default
  const ratePerKm = driverRatePerKm || config.defaultRatePerKm
  const baseFare = config.baseFare
  const distanceFare = parseFloat(distance) * ratePerKm

  // Apply surge multiplier if applicable
  const totalFare = (Math.max(baseFare, distanceFare) * config.surgeMultiplier).toFixed(2)

  // Ensure fare is within min/max range
  const finalFare = Math.max(
    config.minPrice,
    Math.min(config.maxPrice, parseFloat(totalFare))
  ).toFixed(2)

  return finalFare
}

export const formatPrice = (price) => {
  return `$${parseFloat(price).toFixed(2)}`
}

export const getDistanceEstimate = (distanceKm) => {
  if (distanceKm < 1) {
    return 'Less than 1 km'
  } else if (distanceKm < 5) {
    return `${parseFloat(distanceKm).toFixed(1)} km`
  }
  return `${Math.round(distanceKm)} km`
}

export const getDurationEstimate = (durationMinutes) => {
  if (durationMinutes < 1) {
    return 'Less than 1 min'
  } else if (durationMinutes === 1) {
    return '1 min'
  }
  return `${Math.round(durationMinutes)} mins`
}
