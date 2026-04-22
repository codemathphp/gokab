export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')

  if (!query || query.length < 2) {
    return Response.json({ error: 'Query too short' }, { status: 400 })
  }

  try {
    // Use Google Places API - Autocomplete
    const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    
    if (!googleApiKey) {
      console.warn('Google Maps API key not configured')
      return Response.json({ predictions: [] })
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        query
      )}&key=${googleApiKey}&components=country:zw`
    )

    const data = await response.json()

    if (data.predictions) {
      // For each prediction, get place details to get lat/lng
      const enrichedPredictions = await Promise.all(
        data.predictions.slice(0, 8).map(async (prediction) => {
          try {
            const detailsResponse = await fetch(
              `https://maps.googleapis.com/maps/api/place/details/json?place_id=${prediction.place_id}&key=${googleApiKey}&fields=geometry`
            )
            const detailsData = await detailsResponse.json()
            const location = detailsData.result?.geometry?.location

            return {
              description: prediction.description,
              main_text: prediction.structured_formatting?.main_text,
              secondary_text: prediction.structured_formatting?.secondary_text,
              place_id: prediction.place_id,
              lat: location?.lat,
              lng: location?.lng,
            }
          } catch (error) {
            console.error('Error getting place details:', error)
            return {
              description: prediction.description,
              main_text: prediction.structured_formatting?.main_text,
              secondary_text: prediction.structured_formatting?.secondary_text,
              place_id: prediction.place_id,
              lat: null,
              lng: null,
            }
          }
        })
      )

      return Response.json({ predictions: enrichedPredictions })
    }

    return Response.json({ predictions: [] })
  } catch (error) {
    console.error('Places autocomplete error:', error)
    return Response.json({ predictions: [] })
  }
}
