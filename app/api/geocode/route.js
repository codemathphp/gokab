export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')

  if (!lat || !lng) {
    return Response.json({ error: 'Missing coordinates' }, { status: 400 })
  }

  try {
    // Use a free reverse geocoding API (OpenStreetMap Nominatim)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'User-Agent': 'GoKab-App/1.0'
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      }
    )

    if (!response.ok) {
      // Return default if API fails
      return Response.json({ address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` })
    }

    const data = await response.json()
    const address = data.address?.road 
      ? `${data.address.road}${data.address.house_number ? ' ' + data.address.house_number : ''}, ${data.address.city || data.address.town || ''}`
      : data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`

    return Response.json({ address })
  } catch (error) {
    // Fallback to coordinates if any error occurs
    console.warn('Reverse geocoding error:', error.message)
    return Response.json({ address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` })
  }
}
