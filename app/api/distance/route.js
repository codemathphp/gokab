export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const origin = searchParams.get('origin')
  const destination = searchParams.get('destination')

  if (!origin || !destination) {
    return Response.json({ error: 'Missing origin or destination' }, { status: 400 })
  }

  try {
    const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (!googleApiKey) {
      console.warn('Google Maps API key not configured')
      return Response.json({
        distance: 0,
        duration: 0,
        distanceText: 'N/A',
        durationText: 'N/A',
      })
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
        origin
      )}&destinations=${encodeURIComponent(destination)}&key=${googleApiKey}&units=metric`
    )

    const data = await response.json()

    if (data.rows && data.rows[0] && data.rows[0].elements && data.rows[0].elements[0]) {
      const element = data.rows[0].elements[0]

      if (element.status === 'OK') {
        return Response.json({
          distance: (element.distance.value / 1000).toFixed(2), // Convert to km
          duration: Math.ceil(element.duration.value / 60), // Convert to minutes
          distanceText: element.distance.text,
          durationText: element.duration.text,
        })
      }
    }

    return Response.json({
      distance: 0,
      duration: 0,
      distanceText: 'N/A',
      durationText: 'N/A',
    })
  } catch (error) {
    console.error('Distance calculation error:', error)
    return Response.json({
      distance: 0,
      duration: 0,
      distanceText: 'N/A',
      durationText: 'N/A',
    })
  }
}
